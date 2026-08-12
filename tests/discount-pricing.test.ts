import { describe, it, expect } from "vitest";
import {
  computeVariantDiscount,
  type DiscountGroupForPricing,
  type VariantForDiscountPricing,
} from "@/lib/discount-pricing";

const NOW = new Date("2026-08-12T00:00:00Z");
const PAST = new Date("2026-01-01T00:00:00Z");
const FUTURE = new Date("2026-12-01T00:00:00Z");

function group(overrides: Partial<DiscountGroupForPricing> = {}): DiscountGroupForPricing {
  return {
    id: "group-1",
    type: "PERCENT",
    value: 10,
    startAt: null,
    endAt: null,
    isDeleted: false,
    productIds: [],
    categoryIds: [],
    ...overrides,
  };
}

function variant(overrides: Partial<VariantForDiscountPricing> = {}): VariantForDiscountPricing {
  return { price: 100000, productId: "p1", categoryId: "c1", ...overrides };
}

describe("computeVariantDiscount — no applicable groups", () => {
  it("returns no discount when no group targets this variant", () => {
    const result = computeVariantDiscount(
      [group({ productIds: ["other-product"] })],
      variant({ productId: "p1" })
    );
    expect(result.hasDiscount).toBe(false);
    expect(result.discountedPrice).toBe(100000);
  });

  it("returns no discount when there are no groups at all", () => {
    const result = computeVariantDiscount([], variant());
    expect(result.hasDiscount).toBe(false);
  });
});

describe("computeVariantDiscount — always-on groups (no time window)", () => {
  it("applies a PERCENT discount targeted by product", () => {
    const result = computeVariantDiscount(
      [group({ type: "PERCENT", value: 20, productIds: ["p1"] })],
      variant({ productId: "p1", price: 100000 })
    );
    expect(result).toEqual({
      hasDiscount: true,
      originalPrice: 100000,
      discountedPrice: 80000,
      discountGroupId: "group-1",
    });
  });

  it("applies a FIXED discount targeted by category", () => {
    const result = computeVariantDiscount(
      [group({ type: "FIXED", value: 15000, categoryIds: ["c1"] })],
      variant({ categoryId: "c1", price: 100000 })
    );
    expect(result.discountedPrice).toBe(85000);
  });

  it("never discounts below zero (FIXED larger than price)", () => {
    const result = computeVariantDiscount(
      [group({ type: "FIXED", value: 999999 })],
      variant({ productId: "p1", price: 50000 })
    );
    // group targets nothing by default (empty productIds/categoryIds) —
    // add explicit targeting for this test
    const targeted = computeVariantDiscount(
      [group({ type: "FIXED", value: 999999, productIds: ["p1"] })],
      variant({ productId: "p1", price: 50000 })
    );
    expect(targeted.discountedPrice).toBe(0);
    void result;
  });

  it("does not discount a variant with no category when group targets a category", () => {
    const result = computeVariantDiscount(
      [group({ categoryIds: ["c1"] })],
      variant({ categoryId: null })
    );
    expect(result.hasDiscount).toBe(false);
  });
});

describe("computeVariantDiscount — time-windowed groups", () => {
  it("applies when now is within [startAt, endAt]", () => {
    const result = computeVariantDiscount(
      [group({ productIds: ["p1"], startAt: PAST, endAt: FUTURE })],
      variant({ productId: "p1" }),
      NOW
    );
    expect(result.hasDiscount).toBe(true);
  });

  it("does not apply before startAt", () => {
    const result = computeVariantDiscount(
      [group({ productIds: ["p1"], startAt: FUTURE, endAt: null })],
      variant({ productId: "p1" }),
      NOW
    );
    expect(result.hasDiscount).toBe(false);
  });

  it("does not apply after endAt", () => {
    const result = computeVariantDiscount(
      [group({ productIds: ["p1"], startAt: null, endAt: PAST })],
      variant({ productId: "p1" }),
      NOW
    );
    expect(result.hasDiscount).toBe(false);
  });

  it("applies with only startAt set (no end) once started", () => {
    const result = computeVariantDiscount(
      [group({ productIds: ["p1"], startAt: PAST, endAt: null })],
      variant({ productId: "p1" }),
      NOW
    );
    expect(result.hasDiscount).toBe(true);
  });
});

describe("computeVariantDiscount — deleted groups", () => {
  it("ignores a deleted group even if it would otherwise target the variant", () => {
    const result = computeVariantDiscount(
      [group({ productIds: ["p1"], isDeleted: true })],
      variant({ productId: "p1" })
    );
    expect(result.hasDiscount).toBe(false);
  });
});

describe("computeVariantDiscount — overlapping groups, best-wins", () => {
  it("picks the larger discount when two groups both target the same variant", () => {
    const smallDiscount = group({ id: "small", type: "FIXED", value: 5000, productIds: ["p1"] });
    const bigDiscount = group({ id: "big", type: "PERCENT", value: 30, productIds: ["p1"] });

    const result = computeVariantDiscount([smallDiscount, bigDiscount], variant({ productId: "p1", price: 100000 }));

    // small = 5000 flat, big = 30% of 100000 = 30000 -> big wins
    expect(result.discountGroupId).toBe("big");
    expect(result.discountedPrice).toBe(70000);
  });

  it("picks the FIXED discount when it happens to be larger than the PERCENT one", () => {
    const bigFixed = group({ id: "big-fixed", type: "FIXED", value: 50000, productIds: ["p1"] });
    const smallPercent = group({ id: "small-percent", type: "PERCENT", value: 5, productIds: ["p1"] });

    const result = computeVariantDiscount([bigFixed, smallPercent], variant({ productId: "p1", price: 100000 }));

    expect(result.discountGroupId).toBe("big-fixed");
    expect(result.discountedPrice).toBe(50000);
  });

  it("ignores an inactive (expired) group even if its discount would be bigger", () => {
    const expiredBig = group({ id: "expired", type: "PERCENT", value: 90, productIds: ["p1"], endAt: PAST });
    const activeSmall = group({ id: "active", type: "PERCENT", value: 10, productIds: ["p1"] });

    const result = computeVariantDiscount([expiredBig, activeSmall], variant({ productId: "p1", price: 100000 }), NOW);

    expect(result.discountGroupId).toBe("active");
    expect(result.discountedPrice).toBe(90000);
  });
});
