/**
 * ============================================================================
 * PAGE: /cart
 * ============================================================================
 * RENDERING: Server Component shell fetches current-user + (if logged in)
 * the DB cart. Rendering itself is a client component because guests need
 * to read their cart from the Zustand/localStorage store, and quantity
 * +/- buttons need interactivity either way.
 *
 * ACCESS: works for BOTH guests and logged-in users (per your spec — guest
 * cart is allowed, merges into DB on login).
 *
 * DATA SOURCE (logged in): getCartAction() (see src/server/cart/actions.ts)
 *   output: CartSummaryDTO (see src/types/cart.ts)
 *     {
 *       items: CartItemDTO[],   // { id, variantId, productId, productTitle,
 *                                //   productSlug, mainImageUrl, optionValues,
 *                                //   price, stock, quantity }
 *       totalItems, totalPrice  // Toman
 *     }
 *
 * DATA SOURCE (guest): useGuestCartStore (src/store/guest-cart-store.ts)
 *   holds { variantId, quantity }[] only — the client component fetches
 *   full variant/product details for display via a small API route
 *   (see /api/cart/guest-details) since server actions can't be called
 *   with data that only exists in the browser at request time... actually
 *   they CAN (server actions accept any serializable input) — see the
 *   client component for how this is done directly via a server action call.
 *
 * ACTIONS: updateCartItemQuantityAction, removeCartItemAction, clearCartAction
 *   (logged in) — guest versions are local Zustand store methods.
 *
 * UI NOTE FOR DESIGN AGENT: line-item list (image, title, selected options,
 * price, qty +/- capped at stock, remove button), "clear all" button, and
 * a total price footer. Link to /checkout (future module) for "proceed."
 * ============================================================================
 */
import { getCurrentUser } from "@/server/user/get-current-user";
import { CartView } from "./cart-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "سبد خرید",
    description: "سبد خرید شما در فروشگاه اینترنتی درا بگز.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function CartPage() {
  const user = await getCurrentUser();

  return (
    <main dir="rtl" style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>سبد خرید</h1>
      <CartView isLoggedIn={!!user} />
    </main>
  );
}
