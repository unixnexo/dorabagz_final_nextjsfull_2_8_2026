/**
 * Pure coupon-pricing logic, deliberately separated from any DB access so
 * it's trivial to unit test (see tests/coupon-pricing.test.ts). The server
 * action (validateAndPriceCouponAction) fetches the data and passes it in
 * here — this function itself never touches Prisma.
 */

export type CouponForPricing = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountAmount: number | null;
  scope: "ENTIRE_CART" | "SPECIFIC_PRODUCTS" | "SPECIFIC_CATEGORIES";
  productIds: string[]; // relevant when scope = SPECIFIC_PRODUCTS
  categoryIds: string[]; // relevant when scope = SPECIFIC_CATEGORIES (already expanded to include child categories)
  minOrderAmount: number | null;
  maxUsesPerUser: number;
  maxTotalUsage: number | null;
  assignedUserId: string | null;
  expiresAt: Date;
  isDeleted: boolean;
};

export type CartLineForPricing = {
  productId: string;
  categoryId: string | null;
  unitPrice: number;
  quantity: number;
};

export type PricingContext = {
  userId: string;
  totalUsageCount: number; // how many times this coupon has been used, across all users
  userUsageCount: number; // how many times THIS user has used this coupon
  now?: Date; // injectable for tests; defaults to `new Date()`
};

export type CouponPricingResult =
  | { valid: true; discountAmount: number }
  | { valid: false; error: string };

/**
 * Validates a coupon against a cart + usage context, and computes the
 * discount amount if valid. Every rejection reason from your spec is
 * checked here: deleted, expired, wrong assigned user, per-user limit,
 * total-usage limit, minimum order amount, and scope matching (only
 * matching items' subtotal gets discounted for SPECIFIC_PRODUCTS/CATEGORIES).
 */
export function priceCoupon(
  coupon: CouponForPricing,
  cartLines: CartLineForPricing[],
  context: PricingContext
): CouponPricingResult {
  const now = context.now ?? new Date();

  if (coupon.isDeleted) {
    return { valid: false, error: "این کد تخفیف دیگر معتبر نیست." };
  }
  if (coupon.expiresAt.getTime() < now.getTime()) {
    return { valid: false, error: "این کد تخفیف منقضی شده است." };
  }
  if (coupon.assignedUserId && coupon.assignedUserId !== context.userId) {
    return { valid: false, error: "این کد تخفیف برای شما قابل استفاده نیست." };
  }
  if (context.userUsageCount >= coupon.maxUsesPerUser) {
    return { valid: false, error: "شما قبلاً از این کد تخفیف استفاده کرده‌اید." };
  }
  if (coupon.maxTotalUsage !== null && context.totalUsageCount >= coupon.maxTotalUsage) {
    return { valid: false, error: "ظرفیت استفاده از این کد تخفیف تمام شده است." };
  }

  const cartTotal = cartLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  if (coupon.minOrderAmount !== null && cartTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `حداقل مبلغ سفارش برای این کد تخفیف ${coupon.minOrderAmount.toLocaleString("fa-IR")} تومان است.`,
    };
  }

  // Determine which cart lines the coupon actually applies to.
  let eligibleLines: CartLineForPricing[];
  if (coupon.scope === "ENTIRE_CART") {
    eligibleLines = cartLines;
  } else if (coupon.scope === "SPECIFIC_PRODUCTS") {
    eligibleLines = cartLines.filter((line) => coupon.productIds.includes(line.productId));
  } else {
    eligibleLines = cartLines.filter(
      (line) => line.categoryId !== null && coupon.categoryIds.includes(line.categoryId)
    );
  }

  const eligibleSubtotal = eligibleLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  if (eligibleSubtotal === 0) {
    return { valid: false, error: "این کد تخفیف برای محصولات موجود در سبد شما قابل استفاده نیست." };
  }

  let discountAmount: number;
  if (coupon.type === "FIXED") {
    discountAmount = coupon.value;
  } else {
    discountAmount = Math.floor((eligibleSubtotal * coupon.value) / 100);
    if (coupon.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  }

  // Discount can never exceed what it's actually applying to (guards
  // against a huge FIXED discount on a tiny matching subtotal), and never
  // exceed the whole cart total either.
  discountAmount = Math.min(discountAmount, eligibleSubtotal, cartTotal);

  return { valid: true, discountAmount };
}
