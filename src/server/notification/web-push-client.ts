import "server-only";
import webpush from "web-push";

/**
 * Web Push sender, using the `web-push` npm package for the VAPID signing
 * crypto (hand-rolling that would be pure risk for zero benefit — but the
 * service worker, subscription UI, and all app logic around it are custom,
 * no framework). Requires VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY in .env —
 * see .env.example. A fresh real keypair was generated for you; you can
 * regenerate your own anytime with:
 *   npx web-push generate-vapid-keys
 */
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? "mailto:admin@example.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export type PushSubscriptionKeys = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type PushPayload = {
  title: string;
  body: string;
  linkUrl?: string | null;
};

/** Sends one push notification to one subscription. Returns whether the
 *  subscription is still valid — a 410/404 response means the browser
 *  unsubscribed and we should delete that PushSubscription row. */
export async function sendPushNotification(
  subscription: PushSubscriptionKeys,
  payload: PushPayload
): Promise<{ delivered: boolean; shouldRemoveSubscription: boolean }> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log("⚠️  VAPID keys not configured — skipping push send. See .env.example.");
    return { delivered: false, shouldRemoveSubscription: false };
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      },
      JSON.stringify(payload)
    );
    return { delivered: true, shouldRemoveSubscription: false };
  } catch (err) {
    const statusCode = (err as { statusCode?: number })?.statusCode;
    const isGone = statusCode === 404 || statusCode === 410;
    if (!isGone) {
      console.error("Push send failed:", err);
    }
    return { delivered: false, shouldRemoveSubscription: isGone };
  }
}
