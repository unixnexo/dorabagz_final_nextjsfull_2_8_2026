"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, Plus, Share } from "lucide-react";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/bottom-nav";
import { SearchCommand } from "@/components/search-command";
import BackButton from "@/components/BackButton";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import {
    listNotificationsAction,
    markNotificationReadAction,
    markAllNotificationsReadAction,
} from "@/server/notification/actions";
import type { NotificationDTO } from "@/types/notification";

export default function NotificationsContent() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchOpen, setSearchOpen] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notifications", page],
        queryFn: async () => {
            const result = await listNotificationsAction({ page, pageSize: 20 });
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
    });

    const notifications = data?.items ?? [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    async function handleMarkAllRead() {
        const result = await markAllNotificationsReadAction();
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    }

    async function handleRead(notification: NotificationDTO) {
        if (!notification.isRead) {
            const result = await markNotificationReadAction(notification.id);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
        }
    }

    function handleClick(notification: NotificationDTO) {
        handleRead(notification);
        if (notification.linkUrl) {
            router.push(notification.linkUrl);
        }
    }

    return (
        <main className="min-h-screen bg-white text-[#171717] pb-20">
            <div className="mx-auto min-h-screen w-full max-w-[500px]">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className="sticky top-0 z-40 flex h-[88px] items-center justify-between bg-white px-4 pb-5 pt-4"
                >
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0}
                        className="size-14 rounded-3xl bg-brand-secondary disabled:opacity-40"
                    >
                        <CheckCheck className="!size-6 text-black/70" />
                    </Button>

                    <div className="flex flex-col items-center">
                        <h1 className="text-[19px] font-bold">اعلان‌ها</h1>

                        {unreadCount > 0 && (
                            <motion.span
                                key={unreadCount}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-0.5 text-[12px] text-muted-foreground"
                            >
                                {unreadCount} اعلان خوانده نشده
                            </motion.span>
                        )}
                    </div>

                    <BackButton fixed={false} size="big" />
                </motion.header>

                <div className="rounded-t-[32px] bg-[#f1f2f3] px-4 pb-10 pt-5 h-dvh">
                    {/* Notification permission */}
                    <NotificationPermission />

                    {/* Loading / error */}
                    {isLoading && (
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            در حال بارگذاری...
                        </p>
                    )}

                    {isError && (
                        <p className="mt-6 text-center text-sm text-red-500">
                            خطا در دریافت اطلاعات
                        </p>
                    )}

                    {/* Notifications */}
                    {!isLoading && !isError && notifications.length > 0 && (
                        <section className="mt-6">
                            <div className="mb-3 flex items-center justify-between px-1">
                                <h2 className="text-[15px] font-bold">اعلان‌های اخیر</h2>

                                {unreadCount > 0 && (
                                    <motion.button
                                        whileTap={{ scale: 0.94 }}
                                        onClick={handleMarkAllRead}
                                        className="text-[13px] font-medium text-black/55"
                                    >
                                        خواندن همه
                                    </motion.button>
                                )}
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {notifications.map((notification, index) => (
                                        <NotificationCard
                                            key={notification.id}
                                            notification={notification}
                                            index={index}
                                            onRead={() => handleRead(notification)}
                                            onClick={() => handleClick(notification)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {data && data.totalPages > 1 && (
                                <div className="mt-5 flex items-center justify-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => p - 1)}
                                    >
                                        قبلی
                                    </Button>
                                    <span className="text-[12px] text-muted-foreground">
                                        صفحه {data.page} از {data.totalPages}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={page >= data.totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        بعدی
                                    </Button>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Empty state */}
                    {!isLoading && !isError && notifications.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex min-h-[50vh] flex-col items-center justify-center text-center"
                        >
                            <div className="flex size-20 items-center justify-center rounded-[28px] bg-brand-secondary">
                                <Bell className="size-8 text-black/40" />
                            </div>

                            <h3 className="mt-5 text-[17px] font-bold">هنوز اعلانی ندارید</h3>

                            <p className="mt-2 max-w-[260px] text-[13px] leading-6 text-muted-foreground">
                                وقتی اتفاق جدیدی برای سفارش‌ها یا حساب شما بیفتد، اینجا به شما اطلاع می‌دهیم.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

            <BottomNav searchOpen={searchOpen} onSearchClick={() => setSearchOpen(true)} />
        </main>
    );
}

/* -------------------------------------------------------------------------- */
/* Notification permission                                                   */
/* -------------------------------------------------------------------------- */
function NotificationPermission() {
    const {
        permission,
        isSubscribed,
        isLoading,
        subscribe,
        unsubscribe,
    } = usePushNotifications();

    const [isIPhone, setIsIPhone] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || "";

        setIsIPhone(/iPhone/i.test(userAgent));

        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            // @ts-expect-error iOS Safari
            window.navigator.standalone === true;

        setIsStandalone(standalone);
    }, []);

    // iPhone but not installed as a Home Screen web app
    if (isIPhone && !isStandalone) {
        return (
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                }}
                className="rounded-[25px] bg-white p-4"
            >
                <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-[17px] bg-brand-primary">
                        <Bell className="size-5 text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-semibold">
                            فعال‌سازی اعلان‌ها
                        </h3>

                        <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                            برای فعال کردن اعلان‌ها، ابتدا سایت را به صفحه اصلی آیفون
                            اضافه کنید.
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="mt-3 text-[12px] font-semibold text-brand-primary underline underline-offset-4"
                                >
                                    آموزش افزودن به صفحه اصلی
                                </button>
                            </DialogTrigger>

                            <DialogContent
                                dir="rtl"
                                className="w-[calc(100%-32px)] max-w-[420px] rounded-[25px]"
                            >
                                <DialogHeader>
                                    <DialogTitle className="text-right text-[16px]">
                                        افزودن سایت به صفحه اصلی
                                    </DialogTitle>

                                    <DialogDescription className="text-right text-[13px] leading-6">
                                        برای دریافت اعلان‌ها در آیفون، سایت باید به
                                        صفحه اصلی اضافه شود.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-3 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                                            <Share className="size-4" />
                                        </div>

                                        <div>
                                            <p className="text-[13px] font-semibold">
                                                ۱. روی دکمه Share بزنید
                                            </p>

                                            <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                                                در Safari، دکمه اشتراک‌گذاری را باز
                                                کنید.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                                            <Plus className="size-4" />
                                        </div>

                                        <div>
                                            <p className="text-[13px] font-semibold">
                                                ۲. گزینه «افزودن به صفحه اصلی» را
                                                انتخاب کنید
                                            </p>

                                            <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                                                اگر این گزینه را نمی‌بینید، پایین
                                                لیست Share گزینه Edit Actions را
                                                بزنید و آن را اضافه کنید.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-[12px] font-bold">
                                            ۳
                                        </div>

                                        <div>
                                            <p className="text-[13px] font-semibold">
                                                ۳. روی «افزودن» بزنید
                                            </p>

                                            <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                                                سپس سایت را از آیکون آن در صفحه
                                                اصلی باز کنید.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </motion.section>
        );
    }

    if (permission === "unsupported") {
        return (
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[25px] bg-white p-4"
            >
                <p className="text-[12.5px] text-muted-foreground">
                    مرورگر شما از اعلان‌های وب پشتیبانی نمی‌کند.
                </p>
            </motion.section>
        );
    }

    if (permission === "denied") {
        return (
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[25px] bg-white p-4"
            >
                <p className="text-[12.5px] text-muted-foreground">
                    اعلان‌ها مسدود شده‌اند. برای فعال‌سازی، دسترسی اعلان را از
                    تنظیمات مرورگر تغییر دهید.
                </p>
            </motion.section>
        );
    }

    const enabled = isSubscribed;

    return (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: 0.05,
            }}
            className="rounded-[25px] bg-white p-4"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <motion.div
                        animate={{ scale: enabled ? [1, 1.06, 1] : 1 }}
                        transition={{
                            duration: 1.8,
                            repeat: enabled ? Infinity : 0,
                            repeatDelay: 2.5,
                        }}
                        className="flex size-11 shrink-0 items-center justify-center rounded-[17px] bg-brand-primary"
                    >
                        <Bell className="size-5 text-white" />
                    </motion.div>

                    <div className="min-w-0">
                        <h3 className="text-[14px] font-semibold">
                            اعلان‌ها
                        </h3>

                        <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                            {enabled
                                ? "اعلان‌ها برای شما فعال هستند"
                                : "اعلان‌ها برای شما غیرفعال هستند"}
                        </p>
                    </div>
                </div>

                <Switch
                    checked={enabled}
                    disabled={isLoading}
                    onCheckedChange={(value) => {
                        if (value) {
                            subscribe();
                        } else {
                            unsubscribe();
                        }
                    }}
                    className="shrink-0"
                />
            </div>
        </motion.section>
    );
}


/* -------------------------------------------------------------------------- */
/* Notification card                                                          */
/* -------------------------------------------------------------------------- */

function NotificationCard({
    notification,
    index,
    onRead,
    onClick,
}: {
    notification: NotificationDTO;
    index: number;
    onRead: () => void;
    onClick: () => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
                opacity: 0,
                scale: 0.94,
                height: 0,
                marginBottom: 0,
            }}
            transition={{
                type: "spring",
                stiffness: 420,
                damping: 30,
                delay: Math.min(index * 0.035, 0.2),
            }}
            whileTap={{ scale: 0.985 }}
            onClick={onClick}
            className="relative touch-pan-y"
        >
            <motion.div
                animate={{
                    x: !notification.isRead ? [0, -1.5, 0] : 0,
                }}
                transition={{
                    duration: 2.5,
                    repeat: !notification.isRead ? Infinity : 0,
                    repeatDelay: 4,
                    ease: "easeInOut",
                }}
                className={[
                    "relative overflow-hidden rounded-[25px] bg-white",
                    "cursor-pointer select-none",
                    !notification.isRead
                        ? "border border-black/[0.08] shadow-[0_4px_18px_rgba(0,0,0,0.055)]"
                        : "border border-transparent",
                ].join(" ")}
            >
                {/* Unread indicator */}
                <AnimatePresence>
                    {!notification.isRead && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute right-0 top-0 h-full w-[3px] rounded-full bg-brand-primary"
                        />
                    )}
                </AnimatePresence>

                <div className="flex gap-3.5 p-4">
                    {/* Icon */}
                    <motion.div
                        animate={{
                            scale: !notification.isRead
                                ? [1, 1.04, 1]
                                : 1,
                        }}
                        transition={{
                            duration: 2,
                            repeat: !notification.isRead ? Infinity : 0,
                            repeatDelay: 5,
                        }}
                        className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-[#f1f2f3] text-black"
                    >
                        <Bell
                            className="size-[20px]"
                            strokeWidth={1.8}
                        />
                    </motion.div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3
                                className={`text-[14px] leading-6 ${!notification.isRead
                                        ? "font-bold"
                                        : "font-medium"
                                    }`}
                            >
                                {notification.title}
                            </h3>

                            {!notification.isRead && (
                                <motion.span
                                    initial={{
                                        opacity: 0,
                                        scale: 0.7,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    className="mt-1.5 size-2 shrink-0 rounded-full bg-black"
                                />
                            )}
                        </div>

                        <p className="mt-1 text-[12.5px] leading-6 text-muted-foreground">
                            {notification.body}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-black/35">
                            <span>
                                {new Date(
                                    notification.createdAt
                                ).toLocaleString("fa-IR")}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}