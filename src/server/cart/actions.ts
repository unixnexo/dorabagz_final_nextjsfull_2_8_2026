"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import {
  addToCartSchema,
  updateCartItemQuantitySchema,
  mergeGuestCartSchema,
} from "@/lib/validations/cart";
import { toCartItemDTO, toCartSummaryDTO, fullCartItemInclude } from "./cart-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { CartSummaryDTO } from "@/types/cart";

async function getCartSummaryForUser(userId: string): Promise<CartSummaryDTO> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: fullCartItemInclude,
    orderBy: { createdAt: "desc" },
  });
  return toCartSummaryDTO(items.map(toCartItemDTO));
}

// ---------------------------------------------------------------------------
// Get the current user's cart (for /cart page). Logged-out visitors get
// an error — their cart lives in the browser (see src/store/guest-cart-store.ts)
// and is rendered client-side without hitting this action.
// ---------------------------------------------------------------------------
export async function getCartAction(): Promise<ActionResult<CartSummaryDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  return { success: true, data: await getCartSummaryForUser(identity.userId) };
}

// ---------------------------------------------------------------------------
// Add a variant to the cart (or increase quantity if already present).
// Quantity is capped at the variant's current stock — cart never reserves
// stock, this is just to avoid an obviously-impossible cart line.
// ---------------------------------------------------------------------------
export async function addToCartAction(input: unknown): Promise<ActionResult<CartSummaryDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const variant = await prisma.productVariant.findUnique({ where: { id: parsed.data.variantId } });
  if (!variant) return { success: false, error: "نوع محصول یافت نشد." };

  const existing = await prisma.cartItem.findUnique({
    where: { userId_variantId: { userId: identity.userId, variantId: variant.id } },
  });

  const desiredQuantity = (existing?.quantity ?? 0) + parsed.data.quantity;
  const cappedQuantity = Math.min(desiredQuantity, variant.stock);

  if (cappedQuantity <= 0) {
    return { success: false, error: "این کالا موجود نیست." };
  }

  await prisma.cartItem.upsert({
    where: { userId_variantId: { userId: identity.userId, variantId: variant.id } },
    update: { quantity: cappedQuantity },
    create: { userId: identity.userId, variantId: variant.id, quantity: cappedQuantity },
  });

  return { success: true, data: await getCartSummaryForUser(identity.userId) };
}

// ---------------------------------------------------------------------------
// Set a cart line's quantity directly (used by +/- buttons in the UI).
// Capped at available stock, per your spec ("go with what's typical").
// ---------------------------------------------------------------------------
export async function updateCartItemQuantityAction(
  input: unknown
): Promise<ActionResult<CartSummaryDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = updateCartItemQuantitySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const variant = await prisma.productVariant.findUnique({ where: { id: parsed.data.variantId } });
  if (!variant) return { success: false, error: "نوع محصول یافت نشد." };

  const cappedQuantity = Math.min(parsed.data.quantity, variant.stock);
  if (cappedQuantity <= 0) {
    return { success: false, error: "این کالا موجود نیست." };
  }

  await prisma.cartItem.update({
    where: { userId_variantId: { userId: identity.userId, variantId: variant.id } },
    data: { quantity: cappedQuantity },
  });

  return { success: true, data: await getCartSummaryForUser(identity.userId) };
}

// ---------------------------------------------------------------------------
// Remove a single cart line.
// ---------------------------------------------------------------------------
export async function removeCartItemAction(
  variantId: string
): Promise<ActionResult<CartSummaryDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  await prisma.cartItem.deleteMany({ where: { userId: identity.userId, variantId } });
  return { success: true, data: await getCartSummaryForUser(identity.userId) };
}

// ---------------------------------------------------------------------------
// Clear the entire cart.
// ---------------------------------------------------------------------------
export async function clearCartAction(): Promise<ActionResult<CartSummaryDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  await prisma.cartItem.deleteMany({ where: { userId: identity.userId } });
  return { success: true, data: await getCartSummaryForUser(identity.userId) };
}

// ---------------------------------------------------------------------------
// Merge a guest (browser-stored) cart into the DB cart right after login.
// Quantities for the same variant are ADDED TOGETHER, capped at available
// stock — per your confirmed spec. Call this once, right after verifyOtpAction
// succeeds, passing whatever was in the guest cart store.
// ---------------------------------------------------------------------------
export async function mergeGuestCartAction(
  input: unknown
): Promise<ActionResult<CartSummaryDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = mergeGuestCartSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  for (const guestItem of parsed.data.items) {
    const variant = await prisma.productVariant.findUnique({ where: { id: guestItem.variantId } });
    if (!variant) continue; // variant may have been deleted since — skip silently

    const existing = await prisma.cartItem.findUnique({
      where: { userId_variantId: { userId: identity.userId, variantId: variant.id } },
    });

    const desiredQuantity = (existing?.quantity ?? 0) + guestItem.quantity;
    const cappedQuantity = Math.min(desiredQuantity, variant.stock);
    if (cappedQuantity <= 0) continue;

    await prisma.cartItem.upsert({
      where: { userId_variantId: { userId: identity.userId, variantId: variant.id } },
      update: { quantity: cappedQuantity },
      create: { userId: identity.userId, variantId: variant.id, quantity: cappedQuantity },
    });
  }

  return { success: true, data: await getCartSummaryForUser(identity.userId) };
}
