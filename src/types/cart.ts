/**
 * Cart DTOs.
 */

/** Row shape for a single cart line — includes enough product/variant info
 *  to render the cart page without extra fetches. */
export type CartItemDTO = {
  id: string; // CartItem row id (empty string "" for guest/local-only items, see GuestCartItem)
  variantId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  mainImageUrl: string | null;
  optionValues: Record<string, string>; // e.g. { Size: "SM", Color: "Red" }
  price: number; // Toman, this variant's price
  stock: number; // this variant's available stock, for capping quantity in UI
  quantity: number;
};

export type CartSummaryDTO = {
  items: CartItemDTO[];
  totalItems: number; // sum of quantities
  totalPrice: number; // Toman, sum of price * quantity
};

/**
 * Shape of a cart line stored in the browser (localStorage) for guests who
 * aren't logged in yet. Deliberately minimal — just enough to re-fetch full
 * product/variant details when rendering, and to merge into the DB cart on
 * login. See src/store/guest-cart-store.ts.
 */
export type GuestCartItem = {
  variantId: string;
  quantity: number;
};
