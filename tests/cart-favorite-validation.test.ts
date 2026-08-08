import { describe, it, expect } from "vitest";
import { addToCartSchema, updateCartItemQuantitySchema, mergeGuestCartSchema } from "@/lib/validations/cart";
import { toggleFavoriteSchema } from "@/lib/validations/favorite";

describe("addToCartSchema", () => {
  it("defaults quantity to 1 when omitted", () => {
    const result = addToCartSchema.parse({ variantId: "v1" });
    expect(result.quantity).toBe(1);
  });

  it("rejects quantity 0", () => {
    const result = addToCartSchema.safeParse({ variantId: "v1", quantity: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a missing variantId", () => {
    const result = addToCartSchema.safeParse({ quantity: 1 });
    expect(result.success).toBe(false);
  });
});

describe("updateCartItemQuantitySchema", () => {
  it("accepts a valid update", () => {
    const result = updateCartItemQuantitySchema.safeParse({ variantId: "v1", quantity: 3 });
    expect(result.success).toBe(true);
  });

  it("rejects negative quantity", () => {
    const result = updateCartItemQuantitySchema.safeParse({ variantId: "v1", quantity: -1 });
    expect(result.success).toBe(false);
  });
});

describe("mergeGuestCartSchema", () => {
  it("accepts an empty items array", () => {
    const result = mergeGuestCartSchema.safeParse({ items: [] });
    expect(result.success).toBe(true);
  });

  it("accepts multiple valid items", () => {
    const result = mergeGuestCartSchema.safeParse({
      items: [
        { variantId: "v1", quantity: 2 },
        { variantId: "v2", quantity: 1 },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("toggleFavoriteSchema", () => {
  it("accepts a valid productId", () => {
    expect(toggleFavoriteSchema.safeParse({ productId: "p1" }).success).toBe(true);
  });

  it("rejects an empty productId", () => {
    expect(toggleFavoriteSchema.safeParse({ productId: "" }).success).toBe(false);
  });
});
