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

type FullProduct = Product & {
  category: Category | null;
  images: ProductImage[];
  specifications: ProductSpecification[];
  options: (ProductOption & { values: ProductOptionValue[] })[];
  variants: (ProductVariant & {
    optionValues: (VariantOptionValue & { optionValue: ProductOptionValue & { option: ProductOption } })[];
  })[];
};

export function toProductListItemDTO(product: FullProduct): ProductListItemDTO {
  const mainImage = product.images.find((i) => i.isMain) ?? product.images[0] ?? null;
  const prices = product.variants.map((v) => v.price);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

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
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    totalStock,
  };
}

export function toProductDetailDTO(product: FullProduct): ProductDetailDTO {
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
    return {
      id: variant.id,
      price: variant.price,
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
