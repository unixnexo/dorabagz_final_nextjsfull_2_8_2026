import type {
  Product,
  ProductImage,
  ProductSpecification,
  ProductOption,
  ProductOptionValue,
  ProductVariant,
  VariantOptionValue,
  Category,
} from "@prisma/client";
import type {
  ProductListItemDTO,
  ProductDetailDTO,
  ProductOptionDTO,
  ProductVariantDTO,
} from "@/types/product";
import { computeVariantDiscount, type DiscountGroupForPricing } from "@/lib/discount-pricing";

type FullProduct = Product & {
  category: Category | null;
  images: ProductImage[];
  specifications: ProductSpecification[];
  options: (ProductOption & { values: ProductOptionValue[] })[];
  variants: (ProductVariant & {
    optionValues: (VariantOptionValue & { optionValue: ProductOptionValue & { option: ProductOption } })[];
  })[];
};

/**
 * `discountGroups` (Module 9) is optional — pass [] or omit it entirely
 * in call sites that don't care about pricing (e.g. an internal query
 * that only needs titles). Every call site that shows prices to a buyer
 * MUST pass the real active groups (see getActiveDiscountGroupsForPricing
 * in src/server/discount/pricing-service.ts) or discounts silently won't
 * show up.
 */
export function toProductListItemDTO(
  product: FullProduct,
  discountGroups: DiscountGroupForPricing[] = []
): ProductListItemDTO {
  const mainImage = product.images.find((i) => i.isMain) ?? product.images[0] ?? null;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const pricedVariants = product.variants.map((v) =>
    computeVariantDiscount(discountGroups, {
      price: v.price,
      productId: product.id,
      categoryId: product.categoryId,
    })
  );

  const originalPrices = pricedVariants.map((p) => p.originalPrice);
  const discountedPrices = pricedVariants.map((p) => p.discountedPrice);

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    productCode: product.productCode,
    mainImageUrl: mainImage?.url ?? null,
    categoryId: product.categoryId,
    categoryTitle: product.category?.title ?? null,
    isDeleted: product.isDeleted,
    createdAt: product.createdAt.toISOString(),
    minPrice: originalPrices.length ? Math.min(...originalPrices) : 0,
    maxPrice: originalPrices.length ? Math.max(...originalPrices) : 0,
    minDiscountedPrice: discountedPrices.length ? Math.min(...discountedPrices) : 0,
    maxDiscountedPrice: discountedPrices.length ? Math.max(...discountedPrices) : 0,
    hasDiscount: pricedVariants.some((p) => p.hasDiscount),
    totalStock,
  };
}

export function toProductDetailDTO(
  product: FullProduct,
  discountGroups: DiscountGroupForPricing[] = []
): ProductDetailDTO {
  const options: ProductOptionDTO[] = product.options
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((opt) => ({
      id: opt.id,
      name: opt.name,
      values: opt.values
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((v) => ({ id: v.id, value: v.value })),
    }));

  const variants: ProductVariantDTO[] = product.variants.map((variant) => {
    const optionValues: Record<string, string> = {};
    for (const link of variant.optionValues) {
      optionValues[link.optionValue.option.name] = link.optionValue.value;
    }

    const pricing = computeVariantDiscount(discountGroups, {
      price: variant.price,
      productId: product.id,
      categoryId: product.categoryId,
    });

    return {
      id: variant.id,
      price: pricing.originalPrice,
      discountedPrice: pricing.discountedPrice,
      hasDiscount: pricing.hasDiscount,
      stock: variant.stock,
      optionValues,
    };
  });

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    slug: product.slug,
    productCode: product.productCode,
    videoUrl: product.videoUrl,
    categoryId: product.categoryId,
    categoryTitle: product.category?.title ?? null,
    images: product.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({ id: img.id, url: img.url, isMain: img.isMain, sortOrder: img.sortOrder })),
    specifications: product.specifications
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ id: s.id, key: s.key, value: s.value, sortOrder: s.sortOrder })),
    options,
    variants,
    isDeleted: product.isDeleted,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

/** Standard `include` clause used everywhere we need the full product tree. */
export const fullProductInclude = {
  category: true,
  images: true,
  specifications: true,
  options: { include: { values: true } },
  variants: { include: { optionValues: { include: { optionValue: { include: { option: true } } } } } },
} as const;
