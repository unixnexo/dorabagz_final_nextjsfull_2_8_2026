import { describe, it, expect } from "vitest";
import { addressFormSchema } from "@/lib/validations/address";
import { couponFormSchema, applyCouponSchema } from "@/lib/validations/coupon";

const validAddress = {
  receiverFullName: "علی رضایی",
  receiverPhone: "09123456789",
  province: "فارس",
  city: "شیراز",
  fullAddress: "خیابان زند، کوچه ۱۲، پلاک ۵",
  postalCode: "7134567890",
};

describe("addressFormSchema", () => {
  it("accepts a fully valid address", () => {
    expect(addressFormSchema.safeParse(validAddress).success).toBe(true);
  });

  it("rejects an invalid postal code", () => {
    const result = addressFormSchema.safeParse({ ...validAddress, postalCode: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid receiver phone", () => {
    const result = addressFormSchema.safeParse({ ...validAddress, receiverPhone: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short full address", () => {
    const result = addressFormSchema.safeParse({ ...validAddress, fullAddress: "کوتاه" });
    expect(result.success).toBe(false);
  });
});

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();

const validCoupon = {
  type: "PERCENT" as const,
  value: 20,
  scope: "ENTIRE_CART" as const,
  productIds: [],
  categoryIds: [],
  maxUsesPerUser: 1,
  expiresAt: futureDate,
};

describe("couponFormSchema", () => {
  it("accepts a minimal valid ENTIRE_CART percent coupon", () => {
    expect(couponFormSchema.safeParse(validCoupon).success).toBe(true);
  });

  it("rejects a percent value over 100", () => {
    const result = couponFormSchema.safeParse({ ...validCoupon, value: 150 });
    expect(result.success).toBe(false);
  });

  it("rejects an expiry date in the past", () => {
    const result = couponFormSchema.safeParse({ ...validCoupon, expiresAt: pastDate });
    expect(result.success).toBe(false);
  });

  it("rejects SPECIFIC_PRODUCTS scope with an empty productIds array", () => {
    const result = couponFormSchema.safeParse({
      ...validCoupon,
      scope: "SPECIFIC_PRODUCTS",
      productIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts SPECIFIC_PRODUCTS scope with at least one product", () => {
    const result = couponFormSchema.safeParse({
      ...validCoupon,
      scope: "SPECIFIC_PRODUCTS",
      productIds: ["prod-1"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects SPECIFIC_CATEGORIES scope with an empty categoryIds array", () => {
    const result = couponFormSchema.safeParse({
      ...validCoupon,
      scope: "SPECIFIC_CATEGORIES",
      categoryIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("allows a FIXED coupon with a value over 100 (not a percent)", () => {
    const result = couponFormSchema.safeParse({ ...validCoupon, type: "FIXED", value: 500000 });
    expect(result.success).toBe(true);
  });
});

describe("applyCouponSchema", () => {
  it("accepts a non-empty code", () => {
    expect(applyCouponSchema.safeParse({ code: "SUMMER20" }).success).toBe(true);
  });

  it("rejects an empty code", () => {
    expect(applyCouponSchema.safeParse({ code: "" }).success).toBe(false);
  });
});
