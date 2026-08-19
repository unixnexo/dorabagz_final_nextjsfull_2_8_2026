import { describe, it, expect } from "vitest";
import { toOrderDetailDTO, fullOrderInclude } from "@/server/order/order-mapper";

// Not a DB test — builds a fake Prisma-shaped object matching exactly
// what `fullOrderInclude` would produce, and checks the mapper attaches
// productSlug/productImage from the real product relation (not derived
// from productTitle), and handles a deleted-variant item (null chain)
// without throwing.
function baseOrder(itemsOverride: Record<string, unknown>[]) {
  return {
    id: "order-1",
    status: "COMPLETED",
    receiverFullName: "علی",
    receiverPhone: "09123456789",
    province: "فارس",
    city: "شیراز",
    fullAddress: "خیابان زند",
    postalCode: "7134567890",
    courierType: "SNAPP_BOX",
    subtotal: 100000,
    discountAmount: 0,
    totalAmount: 100000,
    couponId: null,
    coupon: null,
    payment: { status: "SUCCESS", refId: "ref-1" },
    review: null,
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-02"),
    items: itemsOverride,
  } as Parameters<typeof toOrderDetailDTO>[0];
}

describe("toOrderDetailDTO — item productSlug/productImage", () => {
  it("attaches the real product's slug and main image, not derived from productTitle", () => {
    const order = baseOrder([
      {
        id: "item-1",
        variantId: "variant-1",
        productTitle: "کفش ورزشی",
        optionSummary: null,
        unitPrice: 100000,
        quantity: 1,
        variant: {
          product: {
            slug: "totally-different-slug-xyz",
            images: [
              { url: "/uploads/products/main.webp", isMain: true, sortOrder: 0 },
              { url: "/uploads/products/other.webp", isMain: false, sortOrder: 1 },
            ],
          },
        },
      },
    ]);

    const dto = toOrderDetailDTO(order);
    expect(dto.items[0].productSlug).toBe("totally-different-slug-xyz");
    expect(dto.items[0].productImage).toBe("/uploads/products/main.webp");
  });

  it("falls back to the first image when no image is marked main", () => {
    const order = baseOrder([
      {
        id: "item-1",
        variantId: "variant-1",
        productTitle: "محصول",
        optionSummary: null,
        unitPrice: 100000,
        quantity: 1,
        variant: {
          product: {
            slug: "some-slug",
            images: [
              { url: "/uploads/products/first.webp", isMain: false, sortOrder: 0 },
              { url: "/uploads/products/second.webp", isMain: false, sortOrder: 1 },
            ],
          },
        },
      },
    ]);

    const dto = toOrderDetailDTO(order);
    expect(dto.items[0].productImage).toBe("/uploads/products/first.webp");
  });

  it("returns null productSlug/productImage when the variant was deleted (variant is null)", () => {
    const order = baseOrder([
      {
        id: "item-1",
        variantId: null,
        productTitle: "محصول حذف‌شده",
        optionSummary: null,
        unitPrice: 50000,
        quantity: 1,
        variant: null,
      },
    ]);

    const dto = toOrderDetailDTO(order);
    expect(dto.items[0].productSlug).toBeNull();
    expect(dto.items[0].productImage).toBeNull();
    expect(dto.items[0].productTitle).toBe("محصول حذف‌شده");
  });

  it("returns null productImage when the product has no images at all", () => {
    const order = baseOrder([
      {
        id: "item-1",
        variantId: "variant-1",
        productTitle: "محصول بدون عکس",
        optionSummary: null,
        unitPrice: 30000,
        quantity: 1,
        variant: { product: { slug: "no-image-product", images: [] } },
      },
    ]);

    const dto = toOrderDetailDTO(order);
    expect(dto.items[0].productSlug).toBe("no-image-product");
    expect(dto.items[0].productImage).toBeNull();
  });
});

describe("fullOrderInclude", () => {
  it("nests the variant -> product -> images chain for items", () => {
    expect(fullOrderInclude.items).toEqual({
      include: { variant: { include: { product: { include: { images: true } } } } },
    });
  });
});
