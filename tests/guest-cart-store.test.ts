import { describe, it, expect, beforeEach } from "vitest";
import { useGuestCartStore } from "@/store/guest-cart-store";

// Zustand stores are just plain state containers — testing them is simple:
// reset before each test, call actions, assert on getState().
describe("useGuestCartStore", () => {
  beforeEach(() => {
    useGuestCartStore.getState().clear();
  });

  it("starts empty", () => {
    expect(useGuestCartStore.getState().items).toEqual([]);
  });

  it("adds a new item", () => {
    useGuestCartStore.getState().addItem("variant-1", 2);
    expect(useGuestCartStore.getState().items).toEqual([{ variantId: "variant-1", quantity: 2 }]);
  });

  it("increases quantity when adding the same variant again", () => {
    useGuestCartStore.getState().addItem("variant-1", 2);
    useGuestCartStore.getState().addItem("variant-1", 3);
    expect(useGuestCartStore.getState().items).toEqual([{ variantId: "variant-1", quantity: 5 }]);
  });

  it("tracks multiple different variants separately", () => {
    useGuestCartStore.getState().addItem("variant-1", 1);
    useGuestCartStore.getState().addItem("variant-2", 1);
    expect(useGuestCartStore.getState().items).toHaveLength(2);
  });

  it("updates quantity directly", () => {
    useGuestCartStore.getState().addItem("variant-1", 1);
    useGuestCartStore.getState().updateQuantity("variant-1", 10);
    expect(useGuestCartStore.getState().items[0].quantity).toBe(10);
  });

  it("removes an item", () => {
    useGuestCartStore.getState().addItem("variant-1", 1);
    useGuestCartStore.getState().removeItem("variant-1");
    expect(useGuestCartStore.getState().items).toEqual([]);
  });

  it("clears all items", () => {
    useGuestCartStore.getState().addItem("variant-1", 1);
    useGuestCartStore.getState().addItem("variant-2", 1);
    useGuestCartStore.getState().clear();
    expect(useGuestCartStore.getState().items).toEqual([]);
  });
});
