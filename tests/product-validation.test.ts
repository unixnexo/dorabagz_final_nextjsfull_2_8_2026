import { describe, it, expect } from "vitest";
import { productFormSchema } from "@/lib/validations/product";

const baseValidProduct = {
  title: "کفش ورزشی",
  images: [{ url: "/uploads/products/a.webp", isMain: true, sortOrder: 0 }],
  specifications: [],
  options: [],
  variants: [{ price: 100000, stock: 5, optionValues: {} }],
};

describe("productFormSchema", () => {
  it("accepts a minimal valid product with a single no-option variant", () => {
    const result = productFormSchema.safeParse(baseValidProduct);
    expect(result.success).toBe(true);
  });

  it("rejects a product with an empty title", () => {
    const result = productFormSchema.safeParse({ ...baseValidProduct, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a product with zero variants", () => {
    const result = productFormSchema.safeParse({ ...baseValidProduct, variants: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a negative variant price", () => {
    const result = productFormSchema.safeParse({
      ...baseValidProduct,
      variants: [{ price: -1, stock: 5, optionValues: {} }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than one main image", () => {
    const result = productFormSchema.safeParse({
      ...baseValidProduct,
      images: [
        { url: "/a.webp", isMain: true, sortOrder: 0 },
        { url: "/b.webp", isMain: true, sortOrder: 1 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 6 images total", () => {
    const images = Array.from({ length: 7 }, (_, i) => ({
      url: `/img${i}.webp`,
      isMain: i === 0,
      sortOrder: i,
    }));
    const result = productFormSchema.safeParse({ ...baseValidProduct, images });
    expect(result.success).toBe(false);
  });

  it("accepts a product with options and matching variants", () => {
    const result = productFormSchema.safeParse({
      ...baseValidProduct,
      options: [{ name: "Size", values: ["SM", "M"] }],
      variants: [
        { price: 100000, stock: 5, optionValues: { Size: "SM" } },
        { price: 100000, stock: 3, optionValues: { Size: "M" } },
      ],
    });
    expect(result.success).toBe(true);
  });
});
