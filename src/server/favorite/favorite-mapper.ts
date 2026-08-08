import type { Favorite, Product, ProductImage, ProductVariant } from "@prisma/client";
import type { FavoriteItemDTO } from "@/types/favorite";

type FullFavorite = Favorite & {
  product: Product & { images: ProductImage[]; variants: ProductVariant[] };
};

export function toFavoriteItemDTO(favorite: FullFavorite): FavoriteItemDTO {
  const mainImage = favorite.product.images.find((i) => i.isMain) ?? favorite.product.images[0] ?? null;
  const prices = favorite.product.variants.map((v) => v.price);
  const totalStock = favorite.product.variants.reduce((sum, v) => sum + v.stock, 0);

  return {
    id: favorite.id,
    productId: favorite.productId,
    productTitle: favorite.product.title,
    productSlug: favorite.product.slug,
    mainImageUrl: mainImage?.url ?? null,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    totalStock,
    createdAt: favorite.createdAt.toISOString(),
  };
}
