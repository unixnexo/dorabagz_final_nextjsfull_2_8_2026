"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { toggleFavoriteSchema } from "@/lib/validations/favorite";
import { toFavoriteItemDTO } from "./favorite-mapper";
import { getActiveDiscountGroupsForPricing } from "@/server/discount/pricing-service";
import type { ActionResult } from "@/server/auth/actions";
import type { FavoriteItemDTO } from "@/types/favorite";

const favoriteInclude = {
  product: { include: { images: true, variants: true } },
} as const;

// ---------------------------------------------------------------------------
// List the current user's favorites (for /favorite page).
// ---------------------------------------------------------------------------
export async function listFavoritesAction(): Promise<ActionResult<FavoriteItemDTO[]>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const [favorites, discountGroups] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: identity.userId },
      include: favoriteInclude,
      orderBy: { createdAt: "desc" },
    }),
    getActiveDiscountGroupsForPricing(),
  ]);

  return { success: true, data: favorites.map((f) => toFavoriteItemDTO(f, discountGroups)) };
}

// ---------------------------------------------------------------------------
// Toggle: add if not favorited, remove if already favorited. Returns the
// new state so the UI can update a heart icon etc. without a second fetch.
// ---------------------------------------------------------------------------
export async function toggleFavoriteAction(
  input: unknown
): Promise<ActionResult<{ isFavorited: boolean }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = toggleFavoriteSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: identity.userId, productId: parsed.data.productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { success: true, data: { isFavorited: false } };
  }

  await prisma.favorite.create({
    data: { userId: identity.userId, productId: parsed.data.productId },
  });
  return { success: true, data: { isFavorited: true } };
}

// ---------------------------------------------------------------------------
// Remove a single favorite by its row id (used by the "remove" button on
// the /favorite page itself).
// ---------------------------------------------------------------------------
export async function removeFavoriteAction(
  favoriteId: string
): Promise<ActionResult<{ removed: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  // Scope the delete to the current user so one user can't delete another's
  // favorite row by guessing an id.
  await prisma.favorite.deleteMany({ where: { id: favoriteId, userId: identity.userId } });
  return { success: true, data: { removed: true } };
}

// ---------------------------------------------------------------------------
// Clear all favorites for the current user.
// ---------------------------------------------------------------------------
export async function clearFavoritesAction(): Promise<ActionResult<{ cleared: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  await prisma.favorite.deleteMany({ where: { userId: identity.userId } });
  return { success: true, data: { cleared: true } };
}

// ---------------------------------------------------------------------------
// Which of the given productIds are favorited by the current user — used
// by the product grid/detail page to show filled/empty heart icons without
// an N+1 query per card. Returns [] for logged-out visitors (no error —
// this is a "decoration" query, not a hard requirement).
// ---------------------------------------------------------------------------
export async function getFavoritedProductIdsAction(
  productIds: string[]
): Promise<ActionResult<string[]>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: true, data: [] };
  if (productIds.length === 0) return { success: true, data: [] };

  const favorites = await prisma.favorite.findMany({
    where: { userId: identity.userId, productId: { in: productIds } },
    select: { productId: true },
  });

  return { success: true, data: favorites.map((f) => f.productId) };
}
