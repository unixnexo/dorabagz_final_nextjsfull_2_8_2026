"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    CheckCheck,
    ChevronLeft,
    ShoppingBag,
    Tag,
    Truck,
    Wallet,
    Heart,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/bottom-nav";
import { SearchCommand } from "@/components/search-command";
import BackButton from "@/components/BackButton";

type Notification = {
    id: number;
    type: "order" | "discount" | "shipping" | "wallet" | "favorite";
    title: string;
    description: string;
    date: string;
    time: string;
    unread: boolean;
};

const initialNotifications: Notification[] = [
    {
        id: 1,
        type: "shipping",
        title: "سفارش شما ارسال شد",
        description: "سفارش شماره ۱۲۸۴۵۶ تحویل پست داده شد.",
        date: "امروز",
        time: "۱۲:۴۰",
        unread: true,
    },
    {
        id: 2,
        type: "discount",
        title: "یک تخفیف جذاب برای شما",
        description: "تا ۳۰٪ تخفیف روی محصولات منتخب فروشگاه.",
        date: "امروز",
        time: "۱۰:۱۵",
        unread: true,
    },
    {
        id: 3,
        type: "order",
        title: "سفارش شما با موفقیت ثبت شد",
        description: "سفارش شماره ۱۲۸۴۳۲ با موفقیت ثبت و پرداخت شد.",
        date: "دیروز",
        time: "۱۸:۲۲",
        unread: false,
    },
    {
        id: 4,
        type: "wallet",
        title: "پرداخت شما انجام شد",
        description: "مبلغ ۲,۵۰۰,۰۰۰ تومان با موفقیت پرداخت شد.",
        date: "۲۶ مرداد",
        time: "۱۴:۰۸",
        unread: false,
    },
    {
        id: 5,
        type: "favorite",
        title: "محصول مورد علاقه شما موجود شد",
        description: "تیشرت لوگو دار دوباره موجود شده است.",
        date: "۲۵ مرداد",
        time: "۱۱:۳۵",
        unread: false,
    },
];

const iconConfig = {
    order: {
        icon: ShoppingBag,
        className: "bg-black text-white",
    },
    discount: {
        icon: Tag,
        className: "bg-[#f1f2f3] text-black",
    },
    shipping: {
        icon: Truck,
        className: "bg-[#282E30] text-white",
    },
    wallet: {
        icon: Wallet,
        className: "bg-[#f1f2f3] text-black",
    },
    favorite: {
        icon: Heart,
        className: "bg-[#f1f2f3] text-black",
    },
};

export default function NotificationsPage() {
    const [notifications, setNotifications] =
        useState<Notification[]>(initialNotifications);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);

    const unreadCount = notifications.filter(
        (notification) => notification.unread
    ).length;

    function markAsRead(id: number) {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? { ...notification, unread: false }
                    : notification
            )
        );
    }

    function markAllAsRead() {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false,
            }))
        );
    }

    return (
        <main
            className="min-h-screen bg-white text-[#171717] pb-20"
        >
            <div className="mx-auto min-h-screen w-full max-w-[500px]">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 30,
                    }}
                    className="sticky top-0 z-40 flex h-[88px] items-center justify-between bg-white px-4 pb-5 pt-4"
                >
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee] disabled:opacity-40"
                    >
                        <CheckCheck className="!size-6 text-black/70" />
                    </Button>

                    <div className="flex flex-col items-center">
                        <h1 className="text-[19px] font-bold">
                            اعلان‌ها
                        </h1>

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

                    <BackButton fixed={false} />
                </motion.header>

                <div className="rounded-t-[32px] bg-[#f1f2f3] px-4 pb-10 pt-5">
                    {/* Notification permission */}
                    <NotificationPermission
                        enabled={notificationsEnabled}
                        onChange={setNotificationsEnabled}
                    />

                    {/* Notifications */}
                    <section className="mt-6">
                        <div className="mb-3 flex items-center justify-between px-1">
                            <h2 className="text-[15px] font-bold">
                                اعلان‌های اخیر
                            </h2>

                            {unreadCount > 0 && (
                                <motion.button
                                    whileTap={{ scale: 0.94 }}
                                    onClick={markAllAsRead}
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
                                        onRead={() =>
                                            markAsRead(notification.id)
                                        }
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* Empty state */}
                    {notifications.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex min-h-[50vh] flex-col items-center justify-center text-center"
                        >
                            <div className="flex size-20 items-center justify-center rounded-[28px] bg-white">
                                <Bell className="size-8 text-black/40" />
                            </div>

                            <h3 className="mt-5 text-[17px] font-bold">
                                هنوز اعلانی ندارید
                            </h3>

                            <p className="mt-2 max-w-[260px] text-[13px] leading-6 text-muted-foreground">
                                وقتی اتفاق جدیدی برای سفارش‌ها یا حساب شما
                                بیفتد، اینجا به شما اطلاع می‌دهیم.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            <SearchCommand
                open={searchOpen}
                onOpenChange={setSearchOpen}
            />

            <BottomNav
                searchOpen={searchOpen}
                onSearchClick={() => setSearchOpen(true)}
            />
        </main>
    );
}


/* -------------------------------------------------------------------------- */
/* Notification permission                                                   */
/* -------------------------------------------------------------------------- */

function NotificationPermission({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (value: boolean) => void;
}) {
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
                        animate={{
                            scale: enabled ? [1, 1.06, 1] : 1,
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: enabled ? Infinity : 0,
                            repeatDelay: 2.5,
                        }}
                        className="flex size-11 shrink-0 items-center justify-center rounded-[17px] bg-[#282E30]"
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
                    onCheckedChange={onChange}
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
}: {
    notification: Notification;
    index: number;
    onRead: () => void;
}) {
    const config = iconConfig[notification.type];
    const Icon = config.icon;

    return (
        <motion.div
            layout
            initial={{
                opacity: 0,
                y: 18,
                scale: 0.97,
            }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
            }}
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
            drag="x"
            dragDirectionLock
            dragConstraints={{
                left: -90,
                right: 90,
            }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 55) {
                    onRead();
                }
            }}
            whileTap={{
                scale: 0.985,
            }}
            onClick={onRead}
            className="relative touch-pan-y"
        >
            <motion.div
                animate={{
                    x: notification.unread ? [0, -1.5, 0] : 0,
                }}
                transition={{
                    duration: 2.5,
                    repeat: notification.unread ? Infinity : 0,
                    repeatDelay: 4,
                    ease: "easeInOut",
                }}
                className={[
                    "relative overflow-hidden rounded-[25px] bg-white",
                    "cursor-pointer select-none",
                    notification.unread
                        ? "border border-black/[0.08] shadow-[0_4px_18px_rgba(0,0,0,0.055)]"
                        : "border border-transparent",
                ].join(" ")}
            >
                {/* Unread indicator */}
                <AnimatePresence>
                    {notification.unread && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0,
                            }}
                            className="absolute right-0 top-0 h-full w-[3px] rounded-full bg-black"
                        />
                    )}
                </AnimatePresence>

                <div className="flex gap-3.5 p-4">
                    {/* Icon */}
                    <motion.div
                        animate={{
                            scale: notification.unread
                                ? [1, 1.04, 1]
                                : 1,
                        }}
                        transition={{
                            duration: 2,
                            repeat: notification.unread ? Infinity : 0,
                            repeatDelay: 5,
                        }}
                        className={`flex size-11 shrink-0 items-center justify-center rounded-[16px] ${config.className}`}
                    >
                        <Icon
                            className="size-[20px]"
                            strokeWidth={1.8}
                        />
                    </motion.div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3
                                className={`text-[14px] leading-6 ${notification.unread
                                        ? "font-bold"
                                        : "font-medium"
                                    }`}
                            >
                                {notification.title}
                            </h3>

                            {notification.unread && (
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
                            {notification.description}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-black/35">
                            <span>{notification.date}</span>
                            <span className="size-1 rounded-full bg-black/20" />
                            <span>{notification.time}</span>
                        </div>
                    </div>
                </div>

                {/* Swipe hint area */}
                <AnimatePresence>
                    {notification.unread && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.35 }}
                            transition={{ delay: 1 }}
                            className="pointer-events-none absolute bottom-2 left-4 text-[9px] text-black/30"
                        >
                            برای خواندن بکشید
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}