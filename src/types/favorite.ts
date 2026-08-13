/**
 * Favorite DTOs.
 */

/** Row shape for the /favorite page — includes enough product info to
 *  render a card without a second fetch per item.
 *
 *  Pricing (Module 9): min/maxPrice are ORIGINAL prices; min/maxDiscountedPrice
 *  reflect any active discount group — show strikethrough original next
 *  to the discounted price when hasDiscount is true, same as the product
 *  grid and product detail page. */
export type FavoriteItemDTO = {
  id: string; // Favorite row id
  productId: string;
  productTitle: string;
  productSlug: string;
  mainImageUrl: string | null;
  minPrice: number; // Toman, lowest ORIGINAL variant price
  maxPrice: number; // Toman, highest ORIGINAL variant price
  minDiscountedPrice: number;
  maxDiscountedPrice: number;
  hasDiscount: boolean;
  totalStock: number;
  createdAt: string;
};
