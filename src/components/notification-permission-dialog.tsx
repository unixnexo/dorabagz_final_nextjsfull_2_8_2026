"use client";

import { useEffect, useState } from "react";
import { Bell, Check, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/use-push-notifications";

const STORAGE_KEY = "notification-permission-prompted";

export default function NotificationPermissionDialog() {
    const {
        permission,
        isSubscribed,
        isLoading,
        subscribe,
    } = usePushNotifications();

    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Browser doesn't support notifications
        if (permission === "unsupported") return;

        // User has already blocked notifications
        if (permission === "denied") return;

        // Already subscribed
        if (isSubscribed) return;

        // We already asked them before
        const alreadyPrompted = localStorage.getItem(STORAGE_KEY);

        if (alreadyPrompted) return;

        // Small delay so the home page loads naturally first
        const timer = setTimeout(() => {
            setOpen(true);
        }, 900);

        return () => clearTimeout(timer);
    }, [mounted, permission, isSubscribed]);

    function handleLater() {
        localStorage.setItem(STORAGE_KEY, "true");
        setOpen(false);
    }

    async function handleEnable() {
        localStorage.setItem(STORAGE_KEY, "true");
        setOpen(false);

        // Let the dialog close immediately.
        // Permission/subscription happens in the background.
        subscribe().catch(() => {
            // The hook can handle/display the error itself if needed.
        });
    }

    if (!mounted) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                dir="rtl"
                className="w-[calc(100%-32px)] max-w-[390px] overflow-hidden rounded-[32px] border-0 bg-white p-0 shadow-2xl"
            >
                <div className="p-6">
                    <DialogHeader className="items-center text-center">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 22,
                            }}
                            className="mb-5 flex size-[72px] items-center justify-center rounded-[26px] bg-[#282E30]"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, -8, 8, -5, 0],
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.25,
                                }}
                            >
                                <Bell
                                    className="size-8 text-white"
                                    strokeWidth={1.8}
                                />
                            </motion.div>
                        </motion.div>

                        <DialogTitle className="text-[19px] font-bold">
                            اعلان‌ها را از دست ندهید
                        </DialogTitle>

                        <DialogDescription className="mt-2 text-center text-[13px] leading-6 text-muted-foreground">
                            از وضعیت سفارش‌ها، تخفیف‌ها و اتفاقات مهم
                            باخبر شوید و هیچ اطلاعیه‌ای را از دست ندهید.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Benefits */}
                    <div className="mt-6 space-y-2.5">
                        <Benefit text="اطلاع از وضعیت سفارش‌ها" />
                        <Benefit text="باخبر شدن از تخفیف‌ها و پیشنهادها" />
                        <Benefit text="دریافت اطلاعیه‌های مهم حساب کاربری" />
                    </div>

                    {/* Browser explanation */}
                    <div className="mt-5 rounded-[20px] bg-[#f1f2f3] p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-[13px] bg-white">
                                <ShieldCheck
                                    className="size-[19px] text-black/65"
                                    strokeWidth={1.8}
                                />
                            </div>

                            <p className="text-[11.5px] leading-5 text-black/55">
                                بعد از انتخاب «فعال کردن اعلان‌ها»، مرورگر
                                شما یک پیام نمایش می‌دهد. برای دریافت اعلان‌ها،
                                روی <span className="font-bold text-black/70">Allow</span>{" "}
                                یا «اجازه دادن» بزنید.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 space-y-2.5">
                        <Button
                            onClick={handleEnable}
                            disabled={isLoading}
                            className="h-14 w-full rounded-full bg-[#282E30] text-[14px] font-semibold text-white hover:bg-[#1f2426]"
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                    }}
                                >
                                    در حال فعال‌سازی...
                                </motion.div>
                            ) : (
                                "فعال کردن اعلان‌ها"
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleLater}
                            disabled={isLoading}
                            className="h-12 w-full rounded-full text-[13px] text-black/50 hover:bg-transparent hover:text-black"
                        >
                            فعلاً نه
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Benefit({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 rounded-[18px] bg-[#f8f8f8] px-3.5 py-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white">
                <Check
                    className="size-4 text-black/65"
                    strokeWidth={2.2}
                />
            </div>

            <span className="text-[12.5px] font-medium text-black/65">
                {text}
            </span>
        </div>
    );
}