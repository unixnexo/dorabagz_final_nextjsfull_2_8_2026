"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLiveNotifications } from "@/hooks/use-live-notifications";

/**
 * Mounted once, globally (see layout.tsx, next to ServiceWorkerRegistration).
 * Renders nothing — pure side effect. Whenever a push notification is
 * relayed by the service worker (see public/sw.js + use-live-notifications.ts)
 * while a tab is open:
 *   1. Shows a react-hot-toast with the notification's title/body and a
 *      button that navigates to /notifications.
 *   2. Invalidates ["unread-notifications"] so every badge on screen
 *      (header bell, bottom nav, etc. — see useUnreadNotificationsCount)
 *      updates instantly, the same instant the toast appears.
 *
 * Does NOT track/display the running unread count itself — that's what
 * useUnreadNotificationsCount is for, wherever a badge needs to render
 * one. This component only needs the "a push just arrived" callback.
 */
export function LiveNotificationListener() {
    const router = useRouter();
    const queryClient = useQueryClient();

    useLiveNotifications(0, (payload) => {
        queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });

        toast.custom(
            (t) => (
                <div
                    dir="rtl"
                    className={`flex w-[320px] items-start gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5 transition-opacity ${t.visible ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-black">{payload.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-[13px] text-black/60">{payload.body}</p>

                        <button
                            type="button"
                            onClick={() => {
                                toast.dismiss(t.id);
                                router.push(payload.linkUrl || "/notifications");
                            }}
                            className="mt-2 text-[13px] font-medium text-blue-600"
                        >
                            مشاهده اعلان
                        </button>
                    </div>
                </div>
            ),
            { duration: 6000 }
        );
    });

    return null;
}