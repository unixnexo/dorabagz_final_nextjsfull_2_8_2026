"use client";

import { useCallback, useEffect, useState } from "react";
import { saveSubscriptionAction, removeSubscriptionAction } from "@/server/notification/subscription-actions";

/** Converts the VAPID public key (base64url string) into the Uint8Array
 *  format the browser's PushManager API requires. Standard boilerplate
 *  for the Web Push API — no library needed for this one function. */
// function urlBase64ToUint8Array(base64String: string): Uint8Array {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
//   const rawData = atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//   for (let i = 0; i < rawData.length; i++) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


export type PushPermissionState = "unsupported" | "default" | "granted" | "denied";

/**
 * Manages the browser's push subscription lifecycle: checks current
 * permission/subscription state, and exposes subscribe()/unsubscribe()
 * for a settings toggle or an in-app prompt to call.
 *
 * NEXT_PUBLIC_VAPID_PUBLIC_KEY must be set (see .env.example) — it's the
 * public half of the VAPID keypair used in web-push-client.ts server-side.
 */
export function usePushNotifications() {
  const [permission, setPermission] = useState<PushPermissionState>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission as PushPermissionState);

    navigator.serviceWorker.ready.then(async (registration) => {
      const existing = await registration.pushManager.getSubscription();
      setIsSubscribed(!!existing);
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (permission === "unsupported") return { success: false as const, error: "مرورگر شما از اعلان‌ها پشتیبانی نمی‌کند." };

    setIsLoading(true);
    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult as PushPermissionState);
      if (permissionResult !== "granted") {
        return { success: false as const, error: "اجازه ارسال اعلان داده نشد." };
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        return { success: false as const, error: "کلید VAPID تنظیم نشده است." };
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const result = await saveSubscriptionAction(subscription.toJSON());
      if (!result.success) {
        return { success: false as const, error: result.error };
      }

      setIsSubscribed(true);
      return { success: true as const };
    } finally {
      setIsLoading(false);
    }
  }, [permission]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await removeSubscriptionAction(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
      return { success: true as const };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { permission, isSubscribed, isLoading, subscribe, unsubscribe };
}
