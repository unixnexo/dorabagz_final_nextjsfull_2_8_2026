"use client";

import { create } from "zustand";

/**
 * Holds ONLY the logged-in user's cart item count (sum of quantities),
 * so any component (bottom nav badge, header, etc.) can read it without
 * prop-drilling or each mounting its own useQuery(["cart"]).
 *
 * This is intentionally separate from useGuestCartStore — guests never
 * touch this store, their count is derived directly from their own
 * local items (see useCartCount below). This store only ever holds the
 * DB-backed count for a logged-in user, refreshed by calling
 * refreshCartCount() at the two points you asked for:
 *   1. Right after login, once redirected to "/".
 *   2. On mount of the /cart page.
 * Any cart mutation (add/update/remove/clear) should also call
 * refreshCartCount() afterwards so the badge never goes stale — see
 * useCartCount's wrappers below for the standard way to do that.
 */
type CartCountState = {
    count: number;
    /** true once we've fetched at least once for the current logged-in
     *  session — lets the UI avoid flashing "0" before the first fetch
     *  resolves. Reset to false on logout. */
    hasFetched: boolean;
    setCount: (count: number) => void;
    reset: () => void;
};

export const useCartCountStore = create<CartCountState>((set) => ({
    count: 0,
    hasFetched: false,
    setCount: (count) => set({ count, hasFetched: true }),
    reset: () => set({ count: 0, hasFetched: false }),
}));