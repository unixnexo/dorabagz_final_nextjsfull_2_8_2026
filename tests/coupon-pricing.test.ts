import { describe, it, expect } from "vitest";
import { priceCoupon, type CouponForPricing, type CartLineForPricing } from "@/server/coupon/coupon-pricing";

const FIXED_NOW = new Date("2026-08-01T00:00:00Z");
const FUTURE = new Date("2026-12-01T00:00:00Z");
const PAST = new Date("2026-01-01T00:00:00Z");

function baseCoupon(overrides: Partial<CouponForPricing> = {}): CouponForPricing {
  return {
    id: "coupon-1",
    code: "TEST10",
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
    expiresAt: FUTURE,
    isDeleted: false,
    ...overrides,
  };
}

function baseCart(overrides: Partial<CartLineForPricing>[] = []): CartLineForPricing[] {
  if (overrides.length > 0) {
    return overrides.map((o) => ({
      productId: "p1",
      categoryId: "c1",
      unitPrice: 100000,
      quantity: 1,
      ...o,
    }));
  }
  return [{ productId: "p1", categoryId: "c1", unitPrice: 100000, quantity: 2 }]; // 200,000 total
}

function baseContext(
  overrides: Partial<{ userId: string; totalUsageCount: number; userUsageCount: number }> = {}
) {
  return { userId: "user-1", totalUsageCount: 0, userUsageCount: 0, now: FIXED_NOW, ...overrides };
}

describe("priceCoupon — rejection reasons", () => {
  it("rejects a deleted coupon", () => {
    const result = priceCoupon(baseCoupon({ isDeleted: true }), baseCart(), baseContext());
    expect(result.valid).toBe(false);
  });

  it("rejects an expired coupon", () => {
    const result = priceCoupon(baseCoupon({ expiresAt: PAST }), baseCart(), baseContext());
    expect(result.valid).toBe(false);
  });

  it("rejects when assigned to a different user", () => {
    const result = priceCoupon(
      baseCoupon({ assignedUserId: "someone-else" }),
      baseCart(),
      baseContext({ userId: "user-1" })
    );
    expect(result.valid).toBe(false);
  });

  it("allows the assigned user", () => {
    const result = priceCoupon(
      baseCoupon({ assignedUserId: "user-1" }),
      baseCart(),
      baseContext({ userId: "user-1" })
    );
    expect(result.valid).toBe(true);
  });

  it("rejects when the user already used it up to their per-user limit", () => {
    const result = priceCoupon(
      baseCoupon({ maxUsesPerUser: 1 }),
      baseCart(),
      baseContext({ userUsageCount: 1 })
    );
    expect(result.valid).toBe(false);
  });

  it("rejects when total usage limit is reached (the 'first N people' case)", () => {
    const result = priceCoupon(
      baseCoupon({ maxTotalUsage: 10 }),
      baseCart(),
      baseContext({ totalUsageCount: 10 })
    );
    expect(result.valid).toBe(false);
  });

  it("allows when total usage is just under the limit", () => {
    const result = priceCoupon(
      baseCoupon({ maxTotalUsage: 10 }),
      baseCart(),
      baseContext({ totalUsageCount: 9 })
    );
    expect(result.valid).toBe(true);
  });

  it("rejects when cart total is below minOrderAmount", () => {
    const result = priceCoupon(
      baseCoupon({ minOrderAmount: 500000 }),
      baseCart(), // 200,000 total
      baseContext()
    );
    expect(result.valid).toBe(false);
  });

  it("allows when cart total meets minOrderAmount exactly", () => {
    const result = priceCoupon(
      baseCoupon({ minOrderAmount: 200000 }),
      baseCart(), // exactly 200,000
      baseContext()
    );
    expect(result.valid).toBe(true);
  });
});

describe("priceCoupon — discount calculation, ENTIRE_CART scope", () => {
  it("computes a flat percentage discount with no cap", () => {
    const result = priceCoupon(baseCoupon({ type: "PERCENT", value: 10 }), baseCart(), baseContext());
    expect(result).toEqual({ valid: true, discountAmount: 20000 }); // 10% of 200,000
  });

  it("caps a percentage discount at maxDiscountAmount", () => {
    const result = priceCoupon(
      baseCoupon({ type: "PERCENT", value: 50, maxDiscountAmount: 30000 }),
      baseCart(), // 200,000 * 50% = 100,000, but capped
      baseContext()
    );
    expect(result).toEqual({ valid: true, discountAmount: 30000 });
  });

  it("applies a fixed discount as-is when it's less than the cart total", () => {
    const result = priceCoupon(baseCoupon({ type: "FIXED", value: 15000 }), baseCart(), baseContext());
    expect(result).toEqual({ valid: true, discountAmount: 15000 });
  });

  it("caps a fixed discount at the cart total so it never goes negative", () => {
    const result = priceCoupon(
      baseCoupon({ type: "FIXED", value: 999999999 }),
      baseCart(), // 200,000 total
      baseContext()
    );
    expect(result).toEqual({ valid: true, discountAmount: 200000 });
  });
});

describe("priceCoupon — SPECIFIC_PRODUCTS scope", () => {
  it("only discounts the matching product's subtotal, not the whole cart", () => {
    const cart = baseCart([
      { productId: "shoes", unitPrice: 100000, quantity: 1 }, // matches
      { productId: "hat", unitPrice: 50000, quantity: 1 }, // doesn't match
    ]);
    const coupon = baseCoupon({ scope: "SPECIFIC_PRODUCTS", productIds: ["shoes"], type: "PERCENT", value: 10 });

    const result = priceCoupon(coupon, cart, baseContext());
    expect(result).toEqual({ valid: true, discountAmount: 10000 }); // 10% of 100,000 only
  });

  it("rejects when no cart items match the coupon's products", () => {
    const cart = baseCart([{ productId: "hat", unitPrice: 50000, quantity: 1 }]);
    const coupon = baseCoupon({ scope: "SPECIFIC_PRODUCTS", productIds: ["shoes"] });

    const result = priceCoupon(coupon, cart, baseContext());
    expect(result.valid).toBe(false);
  });

  it("still respects minOrderAmount against the WHOLE cart, not just eligible items", () => {
    const cart = baseCart([
      { productId: "shoes", unitPrice: 100000, quantity: 1 },
      { productId: "hat", unitPrice: 50000, quantity: 1 },
    ]);
    const coupon = baseCoupon({
      scope: "SPECIFIC_PRODUCTS",
      productIds: ["shoes"],
      minOrderAmount: 200000, // whole cart is only 150,000
    });

    const result = priceCoupon(coupon, cart, baseContext());
    expect(result.valid).toBe(false);
  });
});

describe("priceCoupon — SPECIFIC_CATEGORIES scope", () => {
  it("only discounts items in the matching category", () => {
    const cart = baseCart([
      { productId: "p1", categoryId: "shoes-category", unitPrice: 100000, quantity: 1 },
      { productId: "p2", categoryId: "hats-category", unitPrice: 50000, quantity: 1 },
    ]);
    const coupon = baseCoupon({
      scope: "SPECIFIC_CATEGORIES",
      categoryIds: ["shoes-category"],
      type: "FIXED",
      value: 20000,
    });

    const result = priceCoupon(coupon, cart, baseContext());
    expect(result).toEqual({ valid: true, discountAmount: 20000 });
  });

  it("rejects when a cart item has no category (null) and coupon is category-scoped", () => {
    const cart = baseCart([{ productId: "p1", categoryId: null, unitPrice: 100000, quantity: 1 }]);
    const coupon = baseCoupon({ scope: "SPECIFIC_CATEGORIES", categoryIds: ["shoes-category"] });

    const result = priceCoupon(coupon, cart, baseContext());
    expect(result.valid).toBe(false);
  });

  it("caps a FIXED discount at the eligible (matching) subtotal, not the whole cart", () => {
    const cart = baseCart([
      { productId: "p1", categoryId: "shoes-category", unitPrice: 10000, quantity: 1 }, // eligible: 10,000
      { productId: "p2", categoryId: "hats-category", unitPrice: 100000, quantity: 1 }, // not eligible
    ]);
    const coupon = baseCoupon({
      scope: "SPECIFIC_CATEGORIES",
      categoryIds: ["shoes-category"],
      type: "FIXED",
      value: 50000, // way more than the eligible 10,000
    });

    const result = priceCoupon(coupon, cart, baseContext());
    expect(result).toEqual({ valid: true, discountAmount: 10000 });
  });
});
