import type { Favorite, Product, ProductImage, ProductVariant } from "@prisma/client";
import type { FavoriteItemDTO } from "@/types/favorite";
import { computeVariantDiscount, type DiscountGroupForPricing } from "@/lib/discount-pricing";

type FullFavorite = Favorite & {
  product: Product & { images: ProductImage[]; variants: ProductVariant[] };
};

/** `discountGroups` defaults to [] — but every real call site (the
 *  /favorite page) MUST pass the active groups (see
 *  getActiveDiscountGroupsForPricing) or favorited products on sale will
 *  show their stale original price. Same class of bug Module 9 found and
 *  fixed in Cart/Checkout — fixed here too. */
export function toFavoriteItemDTO(
  favorite: FullFavorite,
  discountGroups: DiscountGroupForPricing[] = []
): FavoriteItemDTO {
  const mainImage = favorite.product.images.find((i) => i.isMain) ?? favorite.product.images[0] ?? null;
  const totalStock = favorite.product.variants.reduce((sum, v) => sum + v.stock, 0);

  const pricedVariants = favorite.product.variants.map((v) =>
    computeVariantDiscount(discountGroups, {
      price: v.price,
      productId: favorite.productId,
      categoryId: favorite.product.categoryId,
    })
  );
  const originalPrices = pricedVariants.map((p) => p.originalPrice);
  const discountedPrices = pricedVariants.map((p) => p.discountedPrice);

  return {
    id: favorite.id,
    productId: favorite.productId,
    productTitle: favorite.product.title,
    productSlug: favorite.product.slug,
    mainImageUrl: mainImage?.url ?? null,
    minPrice: originalPrices.length ? Math.min(...originalPrices) : 0,
    maxPrice: originalPrices.length ? Math.max(...originalPrices) : 0,
    minDiscountedPrice: discountedPrices.length ? Math.min(...discountedPrices) : 0,
    maxDiscountedPrice: discountedPrices.length ? Math.max(...discountedPrices) : 0,
    hasDiscount: pricedVariants.some((p) => p.hasDiscount),
    totalStock,
    createdAt: favorite.createdAt.toISOString(),
  };
}
