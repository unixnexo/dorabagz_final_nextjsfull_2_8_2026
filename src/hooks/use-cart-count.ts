// "use client";

// import { useCallback, useEffect } from "react";
// import { getCartAction } from "@/server/cart/actions";
// import { useGuestCartStore } from "@/store/guest-cart-store";
// import { useCartCountStore } from "@/store/cart-count-store";

// /**
//  * Single source of truth for "how many items are in the cart right now",
//  * for any component that just wants a number to render (bottom nav badge,
//  * header icon, etc.) — no server round-trip needed to just READ it.
//  *
//  * - Guest (not logged in): count is derived directly, synchronously, from
//  *   useGuestCartStore — it's already local state, no server call needed,
//  *   and it updates instantly whenever the guest store changes anywhere
//  *   in the app (Zustand subscription).
//  *
//  * - Logged in: count comes from useCartCountStore, which is only ever
//  *   populated by calling refreshCartCount() — this hook does NOT fetch
//  *   automatically on every mount, on purpose (per your spec: only two
//  *   trigger points — right after login/redirect to "/", and on /cart
//  *   mount — plus after any cart mutation). Call refreshCartCount()
//  *   from those specific places.
//  *
//  * @param isLoggedIn - pass the current auth state (from getCurrentUser()
//  *   server-side, threaded down as a prop) so this hook knows which
//  *   source of truth to read from.
//  * @param initialCount - optional, for server components that already
//  *   fetched the cart (e.g. the home page calling getCartAction() next to
//  *   its other Promise.all() calls) — seeds the store immediately so the
//  *   badge doesn't flash 0 before the client-side refresh would otherwise
//  *   run. Only applied once, on first mount with a logged-in user.
//  */
// export function useCartCount(isLoggedIn: boolean, initialCount?: number) {
//     const guestItems = useGuestCartStore((s) => s.items);
//     const guestCount = guestItems.reduce((sum, i) => sum + i.quantity, 0);

//     const dbCount = useCartCountStore((s) => s.count);
//     const hasFetched = useCartCountStore((s) => s.hasFetched);
//     const setCount = useCartCountStore((s) => s.setCount);
//     const resetCount = useCartCountStore((s) => s.reset);

//     const refreshCartCount = useCallback(async () => {
//         if (!isLoggedIn) return; // guests never hit the server for this
//         const result = await getCartAction();
//         if (result.success) {
//             setCount(result.data.totalItems);
//         }
//     }, [isLoggedIn, setCount]);

//     // Logging out should drop any stale logged-in count immediately so a
//     // fresh guest session doesn't briefly show the previous user's number.
//     useEffect(() => {
//         if (!isLoggedIn) resetCount();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [isLoggedIn]);

//     // Seed from server-fetched data once, if provided and nothing's been
//     // fetched client-side yet — avoids a 0 -> real-number flash on a fresh
//     // page load where the server component already had the number handy.
//     useEffect(() => {
//         if (isLoggedIn && initialCount !== undefined && !hasFetched) {
//             setCount(initialCount);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [isLoggedIn, initialCount]);

//     return {
//         count: isLoggedIn ? (hasFetched ? dbCount : (initialCount ?? 0)) : guestCount,
//         refreshCartCount,
//     };
// }









"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartAction } from "@/server/cart/actions";
import { useGuestCartStore } from "@/store/guest-cart-store";
import type { CartSummaryDTO } from "@/types/cart";

/**
 * Single source of truth for "how many items are in the cart right now",
 * for any component that just wants a number to render (bottom nav badge,
 * header icon, etc.).
 *
 * - Guest (not logged in): count is derived directly, synchronously, from
 *   useGuestCartStore — already local state, no server call, updates
 *   instantly whenever the guest store changes anywhere in the app.
 *
 * - Logged in: this hook itself subscribes to the SAME TanStack Query
 *   cache key ("cart") that /cart's LoggedInCart uses. That's the whole
 *   trick: addToCartAction/updateCartItemQuantityAction/etc. all call
 *   queryClient.invalidateQueries({ queryKey: ["cart"] }) after a
 *   mutation (see useCart / cart-view.tsx) — because this hook has an
 *   active useQuery(["cart"]) mounted (e.g. inside BottomNav, which is
 *   present on nearly every page), that invalidation refetches HERE too,
 *   live, no matter where the add-to-cart happened. No manual store
 *   syncing needed, and no extra network calls beyond what TanStack
 *   Query already dedupes (same key = same in-flight request shared).
 *
 * @param isLoggedIn - pass the current auth state (from getCurrentUser()
 *   server-side, threaded down as a prop) so this hook knows which
 *   source of truth to read from.
 * @param initialCount - optional, for server components that already
 *   fetched the cart (e.g. the home page calling getCartAction() next to
 *   its other Promise.all() calls) — seeds the query cache so there's no
 *   flash of "0" before the first client fetch resolves.
 */
export function useCartCount(isLoggedIn: boolean, initialCount?: number) {
    const queryClient = useQueryClient();
    const guestItems = useGuestCartStore((s) => s.items);
    const guestCount = guestItems.reduce((sum, i) => sum + i.quantity, 0);

    const { data } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const result = await getCartAction();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled: isLoggedIn,
        initialData:
            isLoggedIn && initialCount !== undefined
                ? ({ items: [], totalItems: initialCount, totalPrice: 0 } as CartSummaryDTO)
                : undefined,
        // The seeded initialData above is just a count placeholder (empty
        // items/price) — mark it as already-stale so the first real mount
        // still fetches full, accurate data in the background instead of
        // trusting the placeholder indefinitely.
        initialDataUpdatedAt: 0,
    });

    /** Manually trigger a refetch — rarely needed now that mutations
     *  invalidate ["cart"] automatically, but kept for any call site
     *  (e.g. right after login) that wants to force it explicitly. */
    const refreshCartCount = async () => {
        if (!isLoggedIn) return;
        await queryClient.invalidateQueries({ queryKey: ["cart"] });
    };

    return {
        count: isLoggedIn ? (data?.totalItems ?? 0) : guestCount,
        refreshCartCount,
    };
}
