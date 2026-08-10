"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { dismissPopupSchema } from "@/lib/validations/review";
import type { ActionResult } from "@/server/auth/actions";

/**
 * Permanently dismisses a popup type for the current user (per your
 * confirmed spec: dismiss once, never shown again, tracked separately
 * per popup type — dismissing the order-review prompt doesn't silence
 * the site-satisfaction popup and vice versa).
 */
export async function dismissPopupAction(input: unknown): Promise<ActionResult<{ dismissed: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = dismissPopupSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  await prisma.popupDismissal.upsert({
    where: { userId_popupType: { userId: identity.userId, popupType: parsed.data.popupType } },
    update: {},
    create: { userId: identity.userId, popupType: parsed.data.popupType },
  });

  return { success: true, data: { dismissed: true } };
}

/**
 * Checks whether the site-satisfaction popup should be shown right now.
 * Per your spec, the ONE trigger point is: user just returned from the
 * payment gateway with a successful payment. This action doesn't know
 * anything about "when" to call it — the checkout/order success page is
 * responsible for calling this once, at that moment.
 *
 * Returns false if: not logged in, already dismissed/responded before,
 * or (per your "make it removable after 2 months" ask) the popup feature
 * itself has been sunset — see SITE_SATISFACTION_POPUP_ENABLED below.
 */
const SITE_SATISFACTION_POPUP_ENABLED = true; // flip to false to retire the popup entirely, no other code changes needed

export async function shouldShowSiteSatisfactionPopupAction(): Promise<ActionResult<boolean>> {
  if (!SITE_SATISFACTION_POPUP_ENABLED) return { success: true, data: false };

  const identity = await getEffectiveIdentity();
  if (!identity) return { success: true, data: false };

  const dismissal = await prisma.popupDismissal.findUnique({
    where: { userId_popupType: { userId: identity.userId, popupType: "SITE_SATISFACTION" } },
  });

  return { success: true, data: !dismissal };
}
