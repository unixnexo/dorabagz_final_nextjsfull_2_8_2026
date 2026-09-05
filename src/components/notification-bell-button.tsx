"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnreadNotificationsCount } from "@/hooks/use-unread-notifications-count";

/**
 * The notification bell icon + unread badge, used identically across
 * several headers (home, dashboard/profile, dashboard/orders, ...).
 * Extracted here so those pages stop copy-pasting the same Button+Link+
 * badge markup — just drop <NotificationBellButton /> in instead.
 *
 * Every page this appears on already requires login server-side (except
 * "/", which is guest-accessible) — so isLoggedIn defaults to true and
 * only "/" needs to pass it explicitly. Same convention as BottomNav's
 * isLoggedIn prop.
 *
 * className lets each call site keep its own visual variant (the home
 * header uses a flat bg-muted style, the dashboard pages use a frosted-
 * glass style) — pass the exact className you were using on the Button
 * before.
 */
export function NotificationBellButton({
    isLoggedIn = true,
    initialUnreadCount,
    className,
}: {
    isLoggedIn?: boolean;
    initialUnreadCount?: number;
    className?: string;
}) {
    const { count: unreadCount } = useUnreadNotificationsCount(isLoggedIn, initialUnreadCount);

    return (
        <Button
            asChild
            variant="ghost"
            size="icon"
            className={`relative ${className ?? "size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"}`}
        >
            <Link href="/notifications">
                <Bell className="!size-6 text-black/70" />

                {unreadCount > 0 && (
                    <span className="absolute right-2.5 top-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-neutral-300 px-1 text-[10px] font-bold leading-none text-neutral-800">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </Link>
        </Button>
    );
}