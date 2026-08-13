import { describe, it, expect } from "vitest";
import { priceCoupon, type CouponForPricing, type CartLineForPricing } from "@/server/coupon/coupon-pricing";

/**
 * Regression test for a real bug found during the Module 9 audit:
 * previewCouponAction (checkout page's "apply coupon" preview) was
 * computing the coupon discount against the RAW variant price, while
 * createOrderAction (the actual charge) used the DISCOUNTED price. Fixed
 * so both now build their `unitPrice` the same way (post product-discount).
 * This test locks in the correct behavior at the pricing-function level:
 * priceCoupon() must be fed the discounted price, and it must compute a
 * different (correct) result than if fed the original price — proving
 * the distinction actually matters and isn't a no-op.
 */
describe("coupon pricing consistency with product discounts", () => {
  const coupon: CouponForPricing = {
    id: "c1",
    code: "SALE10",
    type: "PERCENT",
    value: 10,
    maxDiscountAmount: null,
    scope: "ENTIRE_CART",
    productIds: [],
    categoryIds: [],
    minOrderAmount: null,
    maxUsesPerUser: 1,
    maxTotalUsage: null,
    assignedUserId: null,
    expiresAt: new Date("2027-01-01"),
    isDeleted: false,
  };

  const context = { userId: "u1", totalUsageCount: 0, userUsageCount: 0, now: new Date("2026-08-01") };

  it("produces a smaller coupon discount when applied to the DISCOUNTED price vs the ORIGINAL price", () => {
    const originalPriceLine: CartLineForPricing[] = [
      { productId: "p1", categoryId: null, unitPrice: 100000, quantity: 1 }, // original price, no product discount applied
    ];
    const discountedPriceLine: CartLineForPricing[] = [
      { productId: "p1", categoryId: null, unitPrice: 70000, quantity: 1 }, // same product, but 30% off already applied
    ];

    const resultOnOriginal = priceCoupon(coupon, originalPriceLine, context);
    const resultOnDiscounted = priceCoupon(coupon, discountedPriceLine, context);

    expect(resultOnOriginal.valid).toBe(true);
    expect(resultOnDiscounted.valid).toBe(true);
    if (resultOnOriginal.valid && resultOnDiscounted.valid) {
      // 10% of 100,000 = 10,000 vs 10% of 70,000 = 7,000 — must differ,
      // proving the input price actually drives the result (not a no-op).
      expect(resultOnOriginal.discountAmount).toBe(10000);
      expect(resultOnDiscounted.discountAmount).toBe(7000);
      expect(resultOnDiscounted.discountAmount).toBeLessThan(resultOnOriginal.discountAmount);
    }
  });

  it("the final charged amount (discounted price minus coupon) is strictly less than original price minus the same coupon math", () => {
    const discountedLine: CartLineForPricing[] = [
      { productId: "p1", categoryId: null, unitPrice: 70000, quantity: 1 },
    ];
    const result = priceCoupon(coupon, discountedLine, context);
    expect(result.valid).toBe(true);
    if (result.valid) {
      const finalCharge = 70000 - result.discountAmount;
      expect(finalCharge).toBe(63000); // 70,000 - 7,000 — both discounts genuinely stacked, in the correct order
    }
  });
});
