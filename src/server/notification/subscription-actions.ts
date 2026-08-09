"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { pushSubscriptionSchema } from "@/lib/validations/notification";
import type { ActionResult } from "@/server/auth/actions";

/**
 * Called from the client right after the browser grants push permission
 * and creates a PushSubscription object (see src/hooks/use-push-notifications.ts).
 * Upserts on `endpoint` since the same browser/device re-subscribing
 * should just update its keys, not create a duplicate row.
 */
export async function saveSubscriptionAction(input: unknown): Promise<ActionResult<{ saved: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = pushSubscriptionSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  await prisma.pushSubscription.upsert({
    where: { endpoint: parsed.data.endpoint },
    update: { userId: identity.userId, p256dh: parsed.data.keys.p256dh, auth: parsed.data.keys.auth },
    create: {
      userId: identity.userId,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
    },
  });

  return { success: true, data: { saved: true } };
}

/** Called when the user disables push notifications from the browser. */
export async function removeSubscriptionAction(endpoint: string): Promise<ActionResult<{ removed: true }>> {
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  return { success: true, data: { removed: true } };
}
