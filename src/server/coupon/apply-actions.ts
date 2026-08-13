"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { applyCouponSchema } from "@/lib/validations/coupon";
import { getCategoryIdsIncludingChildren } from "@/server/category/category-tree";
import { priceCoupon, type CartLineForPricing } from "./coupon-pricing";
import { getActiveDiscountGroupsForPricing } from "@/server/discount/pricing-service";
import { computeVariantDiscount } from "@/lib/discount-pricing";
import type { ActionResult } from "@/server/auth/actions";
import type { CouponPreviewDTO } from "@/types/coupon";

/**
 * Validates a coupon code against the current user's DB cart and returns
 * the discount it would produce, WITHOUT creating an order yet. Used by
 * the checkout page's "apply coupon" button before the user confirms
 * payment. The same pricing function runs again (server-side, non-
 * skippable) inside createOrderAction — this preview is just for UX, but
 * MUST match createOrderAction's math exactly (same effective/discounted
 * prices) or the preview shown to the user would lie about what they'll
 * actually be charged. (This mismatch was a real bug, found and fixed
 * during the Module 9 audit — see README "Module 9" section.)
 */
export async function previewCouponAction(input: unknown): Promise<ActionResult<CouponPreviewDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = applyCouponSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: identity.userId },
    include: { variant: { include: { product: true } } },
  });

  if (cartItems.length === 0) {
    return { success: true, data: { valid: false, error: "سبد خرید شما خالی است." } };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: parsed.data.code.trim().toUpperCase() },
    include: { products: true, categories: true, usages: true },
  });

  if (!coupon) {
    return { success: true, data: { valid: false, error: "کد تخفیف یافت نشد." } };
  }

  // Expand each coupon-linked category to include its children, so a
  // coupon scoped to a PARENT category also matches products filed under
  // its children — same "belongs to parent too" rule as product browsing.
  const expandedCategoryIds = new Set<string>();
  for (const cc of coupon.categories) {
    const ids = await getCategoryIdsIncludingChildren(cc.categoryId);
    ids.forEach((id) => expandedCategoryIds.add(id));
  }

  // Product discounts apply BEFORE coupons — same rule as createOrderAction.
  const discountGroups = await getActiveDiscountGroupsForPricing();
  const cartLines: CartLineForPricing[] = cartItems.map((item) => ({
    productId: item.variant.productId,
    categoryId: item.variant.product.categoryId,
    unitPrice: computeVariantDiscount(discountGroups, {
      price: item.variant.price,
      productId: item.variant.productId,
      categoryId: item.variant.product.categoryId,
    }).discountedPrice,
    quantity: item.quantity,
  }));

  const userUsageCount = coupon.usages.filter((u) => u.userId === identity.userId).length;

  const result = priceCoupon(
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

  if (!result.valid) {
    return { success: true, data: { valid: false, error: result.error } };
  }

  return {
    success: true,
    data: { valid: true, couponId: coupon.id, code: coupon.code, discountAmount: result.discountAmount },
  };
}
