"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GuestCartItem } from "@/types/cart";

/**
 * Holds cart items for a visitor who is NOT logged in yet, persisted to
 * localStorage so it survives page reloads. This is the ONLY module in the
 * app that needs Zustand — everything else (server-backed data) goes
 * through TanStack Query + server actions instead.
 *
 * Flow: guest adds items -> stored here -> guest logs in -> call
 * mergeGuestCartAction(items) with `items`, then `clear()` this store.
 * After login, the real cart page reads from the DB via getCartAction(),
 * NOT from this store.
 */
type GuestCartState = {
  items: GuestCartItem[];
  addItem: (variantId: string, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

export const useGuestCartStore = create<GuestCartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (variantId, quantity) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === variantId ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { variantId, quantity }] };
        }),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        })),

      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

      clear: () => set({ items: [] }),
    }),
    { name: "guest-cart" } // localStorage key
  )
);
