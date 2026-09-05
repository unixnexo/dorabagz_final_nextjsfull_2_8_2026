"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnreadNotificationCountAction } from "@/server/notification/actions";

/**
 * Single source of truth for "how many unread notifications does the
 * current user have", for any component that just wants a number to
 * render (header bell badge, bottom nav, etc.) — same pattern as
 * useCartCount for the cart badge.
 *
 * Subscribes to the shared ["unread-notifications"] TanStack Query key.
 * Whenever ANYTHING invalidates that key — markNotificationReadAction,
 * markAllNotificationsReadAction, or the live push listener (see
 * LiveNotificationListener) — every mounted useUnreadNotificationsCount
 * refetches together, live, no matter where the mutation happened.
 *
 * @param isLoggedIn - pass the current auth state so this hook knows
 *   whether to fetch at all (logged-out users have no notifications).
 * @param initialCount - optional, for server components that already
 *   fetched the count (e.g. a page calling getUnreadNotificationCountAction()
 *   alongside its other data) — seeds the cache to avoid a flash of "0".
 */
export function useUnreadNotificationsCount(isLoggedIn: boolean, initialCount?: number) {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["unread-notifications"],
        queryFn: async () => {
            const result = await getUnreadNotificationCountAction();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled: isLoggedIn,
        initialData: isLoggedIn && initialCount !== undefined ? initialCount : undefined,
        // Treat the seeded count as stale immediately so the first real mount
        // still fetches in the background rather than trusting it forever.
        initialDataUpdatedAt: 0,
    });

    const refresh = async () => {
        if (!isLoggedIn) return;
        await queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    };

    return {
        count: isLoggedIn ? (data ?? 0) : 0,
        refresh,
    };
}