"use server";

import { prisma } from "@/lib/prisma";
import { toCartItemDTO, fullCartItemInclude } from "./cart-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { CartItemDTO } from "@/types/cart";

/**
 * Given the raw {variantId, quantity}[] from a guest's browser-stored cart
 * (src/store/guest-cart-store.ts), fetches full product/variant display
 * data for each — same shape as a logged-in user's CartItemDTO, so the
 * cart page can render both with one component. No auth required (this is
 * how a guest's cart gets displayed at all).
 *
 * Note: `id` on the returned CartItemDTO is set to "" for guest items since
 * there's no CartItem DB row — use `variantId` as the React key / identity
 * instead when rendering.
 */
export async function hydrateGuestCartAction(
  guestItems: { variantId: string; quantity: number }[]
): Promise<ActionResult<CartItemDTO[]>> {
  if (guestItems.length === 0) return { success: true, data: [] };

  const variantIds = guestItems.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: fullCartItemInclude.variant.include,
  });

  const quantityByVariantId = new Map(guestItems.map((i) => [i.variantId, i.quantity]));

  const items = variants.map((variant) => {
    // Reuse the same mapper by faking the CartItem wrapper shape it expects.
    const fakeCartItem = {
      id: "",
      userId: "",
      variantId: variant.id,
      quantity: quantityByVariantId.get(variant.id) ?? 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      variant,
    };
    return toCartItemDTO(fakeCartItem);
  });

  return { success: true, data: items };
}
