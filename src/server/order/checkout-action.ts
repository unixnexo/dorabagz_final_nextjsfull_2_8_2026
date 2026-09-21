"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { checkoutSchema } from "@/lib/validations/checkout";
import { getCategoryIdsIncludingChildren } from "@/server/category/category-tree";
import { priceCoupon, type CartLineForPricing } from "@/server/coupon/coupon-pricing";
import { computeOrderTotals } from "./order-pricing";
import { getActiveDiscountGroupsForPricing } from "@/server/discount/pricing-service";
import { computeVariantDiscount } from "@/lib/discount-pricing";
import { resolveCourierType } from "@/lib/courier";
import { requestZarinpalPayment } from "@/server/payment/zarinpal";
import { notifyCouponLimitReached } from "@/server/notification/events";
import type { ActionResult } from "@/server/auth/actions";
import type { CheckoutResultDTO } from "@/types/order";

/**
 * Creates a PENDING order snapshotting the user's current cart + saved
 * address, then requests a ZarinPal payment session and returns the URL
 * to redirect the browser to.
 *
 * IMPORTANT: stock is NOT touched here — per your spec, stock is only
 * deducted once payment actually succeeds (see confirm-payment-action.ts).
 * This action just validates that stock currently looks sufficient (a
 * best-effort UX check), the REAL enforcement happens with a row lock at
 * payment-confirmation time.
 */
export async function createOrderAction(input: unknown): Promise<ActionResult<CheckoutResultDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const address = await prisma.address.findUnique({ where: { userId: identity.userId } });
  if (!address) return { success: false, error: "ابتدا آدرس ارسال را ثبت کنید." };

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: identity.userId },
    include: {
      variant: {
        include: {
          product: true,
          optionValues: { include: { optionValue: { include: { option: true } } } },
        },
      },
    },
  });

  if (cartItems.length === 0) {
    return { success: false, error: "سبد خرید شما خالی است." };
  }

  // Best-effort stock check (UX only — not the enforcement point).
  const outOfStock = cartItems.find((item) => item.quantity > item.variant.stock);
  if (outOfStock) {
    return {
      success: false,
      error: `موجودی «${outOfStock.variant.product.title}» کافی نیست.`,
    };
  }

  const unavailable = cartItems.find((i) => i.variant.product.isDeleted);
  if (unavailable) {
    return { success: false, error: `«${unavailable.variant.product.title}» دیگر موجود نیست. آن را از سبد حذف کنید.` };
  }

  // Product discounts (Module 9) apply BEFORE coupons — every price used
  // below (coupon eligibility, order subtotal, snapshotted unitPrice) is
  // the EFFECTIVE price after any active discount group, never the raw
  // variant.price. This is what makes a sale actually get charged.
  const discountGroups = await getActiveDiscountGroupsForPricing();
  const effectivePriceByVariantId = new Map(
    cartItems.map((item) => [
      item.variantId,
      computeVariantDiscount(discountGroups, {
        price: item.variant.price,
        productId: item.variant.productId,
        categoryId: item.variant.product.categoryId,
      }).discountedPrice,
    ])
  );

  // --- Coupon (optional) ---
  let couponId: string | null = null;
  let discountAmount = 0;
  let couponCodeForNotify: string | null = null;
  let couponMaxTotalUsage: number | null = null;
  let couponUsageCountBefore = 0;

  if (parsed.data.couponCode?.trim()) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: parsed.data.couponCode.trim().toUpperCase() },
      include: { products: true, categories: true, usages: true },
    });

    if (!coupon) {
      return { success: false, error: "کد تخفیف یافت نشد." };
    }

    const expandedCategoryIds = new Set<string>();
    for (const cc of coupon.categories) {
      const ids = await getCategoryIdsIncludingChildren(cc.categoryId);
      ids.forEach((id) => expandedCategoryIds.add(id));
    }

    const cartLines: CartLineForPricing[] = cartItems.map((item) => ({
      productId: item.variant.productId,
      categoryId: item.variant.product.categoryId,
      unitPrice: effectivePriceByVariantId.get(item.variantId) ?? item.variant.price,
      quantity: item.quantity,
    }));

    const userUsageCount = coupon.usages.filter((u) => u.userId === identity.userId).length;

    const priced = priceCoupon(
      {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        maxDiscountAmount: coupon.maxDiscountAmount,
        scope: coupon.scope,
        productIds: coupon.products.map((p) => p.productId),
        categoryIds: Array.from(expandedCategoryIds),
        minOrderAmount: coupon.minOrderAmount,
        maxUsesPerUser: coupon.maxUsesPerUser,
        maxTotalUsage: coupon.maxTotalUsage,
        assignedUserId: coupon.assignedUserId,
        expiresAt: coupon.expiresAt,
        isDeleted: coupon.isDeleted,
      },
      cartLines,
      { userId: identity.userId, totalUsageCount: coupon.usages.length, userUsageCount }
    );

    if (!priced.valid) {
      return { success: false, error: priced.error };
    }

    couponId = coupon.id;
    discountAmount = priced.discountAmount;
    couponCodeForNotify = coupon.code;
    couponMaxTotalUsage = coupon.maxTotalUsage;
    couponUsageCountBefore = coupon.usages.length;
  }

  const {
    subtotal,
    discountAmount: finalDiscount,
    totalAmount,
  } = computeOrderTotals(
    cartItems.map((i) => ({
      unitPrice: effectivePriceByVariantId.get(i.variantId) ?? i.variant.price,
      quantity: i.quantity,
    })),
    discountAmount
  );

  const courierType = resolveCourierType(address.city);

  // Create the order + snapshot line items + (if a coupon was used) its
  // usage row, all in one transaction so we never end up with a half-
  // written order.
  // const order = await prisma.$transaction(async (tx) => {
  const order = await prisma
    .$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: identity.userId,
          status: "PENDING",
          receiverFullName: address.receiverFullName,
          receiverPhone: address.receiverPhone,
          province: address.province,
          city: address.city,
          fullAddress: address.fullAddress,
          postalCode: address.postalCode,
          courierType,
          subtotal,
          discountAmount: finalDiscount,
          totalAmount,
          couponId,
          items: {
            create: cartItems.map((item) => {
              const optionSummary = item.variant.optionValues
                .map((link) => `${link.optionValue.option.name}: ${link.optionValue.value}`)
                .join(" / ");
              return {
                variantId: item.variantId,
                productTitle: item.variant.product.title,
                optionSummary: optionSummary || null,
                unitPrice: effectivePriceByVariantId.get(item.variantId) ?? item.variant.price,
                quantity: item.quantity,
              };
            }),
          },
        },
      });

      // if (couponId) {
      //   await tx.couponUsage.create({
      //     data: { couponId, userId: identity.userId, orderId: created.id },
      //   });
      // }

      // return created;

      if (couponId) {
        await tx.couponUsage.create({
          data: { couponId, userId: identity.userId, orderId: created.id },
        });
      }

      // Double-submit guard: only the request that actually deletes the cart rows
      // may create an order. A concurrent duplicate deletes 0 rows and rolls back.
      const cleared = await tx.cartItem.deleteMany({ where: { userId: identity.userId } });
      if (cleared.count !== cartItems.length) throw new Error("CART_CHANGED");

      return created;
    })
    .catch((err) => {
      if (err instanceof Error && err.message === "CART_CHANGED") return null;
      throw err;
    });

  if (!order) return { success: false, error: "سبد خرید تغییر کرد. لطفاً دوباره تلاش کنید." };

  // Heads-up to admin if this order's coupon use just exhausted its total
  // usage limit (your "first N people" case) — informational only, doesn't
  // block anything, the limit itself was already enforced by priceCoupon().
  if (couponCodeForNotify && couponMaxTotalUsage !== null) {
    const usageCountNow = couponUsageCountBefore + 1;
    if (usageCountNow >= couponMaxTotalUsage) {
      await notifyCouponLimitReached(couponCodeForNotify);
    }
  }

  // Request the ZarinPal payment session.
  const paymentResult = await requestZarinpalPayment({
    amountToman: totalAmount,
    description: `پرداخت سفارش ${order.id}`,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/payment/callback?orderId=${order.id}`,
  });

  // if (!paymentResult.success) {
  //   // Order stays PENDING with no Payment row — user can retry from
  //   // /dashboard/orders (see repayOrderAction).
  //   return { success: false, error: paymentResult.error };
  // }

  if (!paymentResult.success) {
    // Undo it all: drop the orphan order (cascades items + coupon usage) and restore the cart.
    await prisma.$transaction([
      prisma.cartItem.createMany({
        data: cartItems.map((i) => ({ userId: identity.userId, variantId: i.variantId, quantity: i.quantity })),
        skipDuplicates: true,
      }),
      prisma.order.delete({ where: { id: order.id } }),
    ]);
    return { success: false, error: paymentResult.error };
  }

  await prisma.payment.create({
    data: {
      orderId: order.id,
      status: "PENDING",
      amount: totalAmount,
      authority: paymentResult.authority,
    },
  });

  // Cart is cleared now, not after payment confirms — matches standard
  // e-commerce UX (the items are "spoken for" by this order attempt). If
  // payment fails, the order itself (not the cart) is where the user retries.
  // await prisma.cartItem.deleteMany({ where: { userId: identity.userId } });

  return { success: true, data: { orderId: order.id, paymentUrl: paymentResult.paymentUrl } };
}
