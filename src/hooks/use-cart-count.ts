"use client";

import { useCallback, useEffect } from "react";
import { getCartAction } from "@/server/cart/actions";
import { useGuestCartStore } from "@/store/guest-cart-store";
import { useCartCountStore } from "@/store/cart-count-store";

/**
 * Single source of truth for "how many items are in the cart right now",
 * for any component that just wants a number to render (bottom nav badge,
 * header icon, etc.) — no server round-trip needed to just READ it.
 *
 * - Guest (not logged in): count is derived directly, synchronously, from
 *   useGuestCartStore — it's already local state, no server call needed,
 *   and it updates instantly whenever the guest store changes anywhere
 *   in the app (Zustand subscription).
 *
 * - Logged in: count comes from useCartCountStore, which is only ever
 *   populated by calling refreshCartCount() — this hook does NOT fetch
 *   automatically on every mount, on purpose (per your spec: only two
 *   trigger points — right after login/redirect to "/", and on /cart
 *   mount — plus after any cart mutation). Call refreshCartCount()
 *   from those specific places.
 *
 * @param isLoggedIn - pass the current auth state (from getCurrentUser()
 *   server-side, threaded down as a prop) so this hook knows which
 *   source of truth to read from.
 * @param initialCount - optional, for server components that already
 *   fetched the cart (e.g. the home page calling getCartAction() next to
 *   its other Promise.all() calls) — seeds the store immediately so the
 *   badge doesn't flash 0 before the client-side refresh would otherwise
 *   run. Only applied once, on first mount with a logged-in user.
 */
export function useCartCount(isLoggedIn: boolean, initialCount?: number) {
    const guestItems = useGuestCartStore((s) => s.items);
    const guestCount = guestItems.reduce((sum, i) => sum + i.quantity, 0);

    const dbCount = useCartCountStore((s) => s.count);
    const hasFetched = useCartCountStore((s) => s.hasFetched);
    const setCount = useCartCountStore((s) => s.setCount);
    const resetCount = useCartCountStore((s) => s.reset);

    const refreshCartCount = useCallback(async () => {
        if (!isLoggedIn) return; // guests never hit the server for this
        const result = await getCartAction();
        if (result.success) {
            setCount(result.data.totalItems);
        }
    }, [isLoggedIn, setCount]);

    // Logging out should drop any stale logged-in count immediately so a
    // fresh guest session doesn't briefly show the previous user's number.
    useEffect(() => {
        if (!isLoggedIn) resetCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    // Seed from server-fetched data once, if provided and nothing's been
    // fetched client-side yet — avoids a 0 -> real-number flash on a fresh
    // page load where the server component already had the number handy.
    useEffect(() => {
        if (isLoggedIn && initialCount !== undefined && !hasFetched) {
            setCount(initialCount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, initialCount]);

    return {
        count: isLoggedIn ? (hasFetched ? dbCount : (initialCount ?? 0)) : guestCount,
        refreshCartCount,
    };
}