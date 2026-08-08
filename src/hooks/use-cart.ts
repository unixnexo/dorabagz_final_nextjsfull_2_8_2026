"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addToCartAction } from "@/server/cart/actions";
import { useGuestCartStore } from "@/store/guest-cart-store";
import type { UserDTO } from "@/types/user";

/**
 * Single "add to cart" entry point for any client component (product page,
 * product card, etc.) that doesn't need to know whether the visitor is
 * logged in or not — it just calls addToCart(variantId, quantity).
 *
 * - Logged in  -> writes straight to the DB via addToCartAction, then
 *                 invalidates the ["cart"] query so the cart page/badge refetch.
 * - Logged out -> writes to the Zustand guest-cart store (localStorage).
 *                 Gets merged into the DB automatically on next login
 *                 (see src/app/logic/page.tsx).
 */
export function useCart(currentUser: UserDTO | null) {
  const queryClient = useQueryClient();
  const guestAddItem = useGuestCartStore((s) => s.addItem);

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!currentUser) {
        guestAddItem(variantId, quantity);
        return { success: true as const };
      }

      const result = await addToCartAction({ variantId, quantity });
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      return result;
    },
    [currentUser, guestAddItem, queryClient]
  );

  return { addToCart };
}
