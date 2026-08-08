/**
 * Favorite DTOs.
 */

/** Row shape for the /favorite page — includes enough product info to
 *  render a card without a second fetch per item. */
export type FavoriteItemDTO = {
  id: string; // Favorite row id
  productId: string;
  productTitle: string;
  productSlug: string;
  mainImageUrl: string | null;
  minPrice: number; // Toman, lowest variant price
  maxPrice: number; // Toman, highest variant price
  totalStock: number;
  createdAt: string;
};
