import { describe, it, expect } from "vitest";
import { discountGroupFormSchema } from "@/lib/validations/discount";

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
const laterDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();

const validGroup = {
  title: "تخفیف نوروزی",
  type: "PERCENT" as const,
  value: 20,
  productIds: ["p1"],
  categoryIds: [],
};

describe("discountGroupFormSchema", () => {
  it("accepts a minimal valid group targeting one product", () => {
    expect(discountGroupFormSchema.safeParse(validGroup).success).toBe(true);
  });

  it("accepts a group targeting only a category, no products", () => {
    const result = discountGroupFormSchema.safeParse({
      ...validGroup,
      productIds: [],
      categoryIds: ["c1"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a group with neither products nor categories", () => {
    const result = discountGroupFormSchema.safeParse({
      ...validGroup,
      productIds: [],
      categoryIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a group targeting BOTH products and categories together", () => {
    const result = discountGroupFormSchema.safeParse({
      ...validGroup,
      productIds: ["p1"],
      categoryIds: ["c1"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a PERCENT value over 100", () => {
    const result = discountGroupFormSchema.safeParse({ ...validGroup, value: 150 });
    expect(result.success).toBe(false);
  });

  it("allows a FIXED value over 100 (not a percent)", () => {
    const result = discountGroupFormSchema.safeParse({ ...validGroup, type: "FIXED", value: 500000 });
    expect(result.success).toBe(true);
  });

  it("accepts no startAt/endAt at all (always-on discount)", () => {
    const result = discountGroupFormSchema.safeParse(validGroup);
    expect(result.success).toBe(true);
  });

  it("accepts a valid startAt/endAt window", () => {
    const result = discountGroupFormSchema.safeParse({
      ...validGroup,
      startAt: futureDate,
      endAt: laterDate,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when startAt is after endAt", () => {
    const result = discountGroupFormSchema.safeParse({
      ...validGroup,
      startAt: laterDate,
      endAt: futureDate,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty title", () => {
    const result = discountGroupFormSchema.safeParse({ ...validGroup, title: "" });
    expect(result.success).toBe(false);
  });
});
