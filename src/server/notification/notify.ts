import "server-only";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "./web-push-client";
import { getSmsProvider } from "@/server/sms/sms-provider";
import type { NotificationChannel } from "@prisma/client";

export type NotifyParams = {
  userId: string;
  title: string;
  body: string;
  linkUrl?: string;
  /** PUSH = browser push only, SMS = SMS only, BOTH = push + SMS.
   *  Per your spec: order status changes -> BOTH (push, per default set,
   *  PLUS sms for status changes/payment outcomes), admin new-order -> BOTH. */
  channel: NotificationChannel;
};

/**
 * The single entry point every other module calls to notify someone
 * (a user OR an admin — both are just a `userId` here). Always:
 *   1. Writes a `Notification` row (this is what powers /notifications
 *      and read/unread state — NOT just a log, the actual source of truth).
 *   2. If channel includes PUSH: sends to every one of that user's
 *      registered browser push subscriptions, cleaning up any that have
 *      expired (410/404 response).
 *   3. If channel includes SMS: sends via the swappable SmsProvider
 *      (console-log for now, per Module 1's setup).
 *
 * This function never throws on delivery failure (push/SMS problems
 * shouldn't break the calling code's main flow, e.g. an order shouldn't
 * fail to create just because a push notification couldn't be delivered)
 * — it always writes the Notification row regardless, and logs delivery
 * problems to the console.
 */
export async function notify(params: NotifyParams): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: params.userId,
      title: params.title,
      body: params.body,
      linkUrl: params.linkUrl ?? null,
      channel: params.channel,
    },
  });

  if (params.channel === "PUSH" || params.channel === "BOTH") {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: params.userId },
    });

    for (const sub of subscriptions) {
      const result = await sendPushNotification(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        { title: params.title, body: params.body, linkUrl: params.linkUrl }
      );
      if (result.shouldRemoveSubscription) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {
          // already gone, ignore
        });
      }
    }
  }

  if (params.channel === "SMS" || params.channel === "BOTH") {
    const user = await prisma.user.findUnique({ where: { id: params.userId } });
    if (user) {
      await getSmsProvider().send(user.phoneNumber, params.body);
    }
  }
}
