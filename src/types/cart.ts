/**
 * Cart DTOs.
 */

/** Row shape for a single cart line — includes enough product/variant info
 *  to render the cart page without extra fetches.
 *
 *  Pricing (Module 9): `price` is always the EFFECTIVE price actually
 *  charged (after any active discount) — this is what totalPrice sums
 *  and what checkout/orders use. `originalPrice` is only for display
 *  (strikethrough) when `hasDiscount` is true; when false they're equal. */
export type CartItemDTO = {
  id: string; // CartItem row id (empty string "" for guest/local-only items, see GuestCartItem)
  variantId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  mainImageUrl: string | null;
  optionValues: Record<string, string>; // e.g. { Size: "SM", Color: "Red" }
  price: number; // Toman, EFFECTIVE price (after discount) — this is what's charged
  originalPrice: number; // Toman, for strikethrough display when hasDiscount is true
  hasDiscount: boolean;
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
