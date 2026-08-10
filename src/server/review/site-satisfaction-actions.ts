"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity, getSession } from "@/server/auth/session";
import { submitSiteSatisfactionSchema } from "@/lib/validations/review";
import type { ActionResult } from "@/server/auth/actions";

/**
 * Submits a site-satisfaction rating (rating + optional text, per your
 * final spec). Admin-only visibility — never shown publicly anywhere.
 * Submitting counts as "responded," which also permanently dismisses the
 * popup for this user (same effect as explicitly dismissing it — see
 * dismissPopupAction).
 */
export async function submitSiteSatisfactionAction(
  input: unknown
): Promise<ActionResult<{ submitted: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = submitSiteSatisfactionSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  await prisma.siteSatisfactionRating.create({
    data: { userId: identity.userId, rating: parsed.data.rating, text: parsed.data.text?.trim() || null },
  });

  await prisma.popupDismissal.upsert({
    where: { userId_popupType: { userId: identity.userId, popupType: "SITE_SATISFACTION" } },
    update: {},
    create: { userId: identity.userId, popupType: "SITE_SATISFACTION" },
  });

  return { success: true, data: { submitted: true } };
}

/**
 * Admin-only: paginated list of all site-satisfaction ratings, for
 * admin's own review — never exposed to any public/user-facing endpoint.
 */
export async function listSiteSatisfactionRatingsAction(): Promise<
  ActionResult<{ id: string; rating: number; text: string | null; phoneNumber: string; createdAt: string }[]>
> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { success: false, error: "دسترسی غیرمجاز." };

  const ratings = await prisma.siteSatisfactionRating.findMany({
    include: { user: { select: { phoneNumber: true } } },
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    data: ratings.map((r) => ({
      id: r.id,
      rating: r.rating,
      text: r.text,
      phoneNumber: r.user.phoneNumber,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}
