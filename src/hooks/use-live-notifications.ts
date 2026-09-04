"use client";

/**
 * ============================================================================
 * HOOK: useLiveNotifications
 * ============================================================================
 * Listens for the "PUSH_RECEIVED" message the service worker (public/sw.js)
 * posts to every open tab the instant a Web Push notification arrives --
 * NOT polling, this fires immediately when the push event lands, because
 * it's literally the same event the browser used to show the native OS
 * notification, just also relayed into the page.
 *
 * REQUIRES: the user must have already granted push permission and be
 * subscribed (see src/hooks/use-push-notifications.ts / the toggle on
 * /notifications) -- if they never subscribed, no push ever arrives, so
 * this hook never fires. This is expected: it's a LIVE UPDATE mechanism
 * for users who opted into push, not a replacement for push opt-in.
 *
 * WHAT IT DOES on each relayed push:
 *   1. Calls onNotification(payload) -- payload = { title, body, linkUrl }
 *      -- the caller decides what to do with it (e.g. show a toast).
 *   2. Increments an internal unreadCount state by 1 (optimistic -- the
 *      real source of truth is always getUnreadNotificationCountAction,
 *      see the initial-load note below).
 *
 * INITIAL COUNT: on mount, this hook does NOT fetch the current unread
 * count itself -- pass initialUnreadCount (e.g. from
 * getUnreadNotificationCountAction, called server-side or once on page
 * load) so the badge starts correct even for notifications that arrived
 * while the tab was closed. After mount, only NEW pushes (relayed live)
 * change the count further -- this hook never re-polls.
 *
 * IMPORTANT FOR OTHER AGENTS INTEGRATING THIS: this hook does not create,
 * mark-read, or fetch notifications -- it only reacts to the LIVE push
 * relay. Use the existing src/server/notification/actions.ts
 * (listNotificationsAction, markNotificationReadAction,
 * markAllNotificationsReadAction, getUnreadNotificationCountAction) for
 * everything else, exactly as before. This hook is purely additive.
 * ============================================================================
 */
import { useCallback, useEffect, useState } from "react";

export type LivePushPayload = {
  title: string;
  body: string;
  linkUrl: string;
};

export function useLiveNotifications(
  initialUnreadCount: number,
  onNotification?: (payload: LivePushPayload) => void
) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data?.type !== "PUSH_RECEIVED") return;

      const payload: LivePushPayload = {
        title: event.data.title,
        body: event.data.body,
        linkUrl: event.data.linkUrl,
      };

      setUnreadCount((prev) => prev + 1);
      onNotification?.(payload);
    },
    [onNotification]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return { unreadCount, setUnreadCount };
}
