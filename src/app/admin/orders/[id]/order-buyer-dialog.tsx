"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";

import { getUserDetailAction } from "@/server/user/admin-actions";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type OrderBuyerDialogProps = {
    userId: string;
};

export function OrderBuyerDialog({ userId }: OrderBuyerDialogProps) {
    const [open, setOpen] = useState(false);

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["admin-user-detail", userId],
        queryFn: async () => {
            const result = await getUserDetailAction(userId);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled: open,
    });

    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(true)}
                className="h-10 gap-1.5 w-full rounded-2xl border-[#E5E5EA] bg-white text-[12.5px] font-medium text-[#1C1C1E] shadow-none hover:bg-[#F2F2F7]"
            >
                <User className="size-3.5 text-[#8E8E93]" />
                اطلاعات خریدار
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    dir="rtl"
                    className="max-h-[85vh] max-w-md overflow-y-auto rounded-3xl border-0 bg-white p-0"
                >
                    <DialogHeader className="border-b border-[#E5E5EA] px-4 py-3.5">
                        <DialogTitle className="text-[15px] font-bold text-[#1C1C1E]">
                            جزئیات کاربر
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-4 pb-4 pt-3.5">
                        {isLoading && <BuyerDialogSkeleton />}

                        {isError && (
                            <p className="rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-center text-[12.5px] font-medium text-[#FF3B30]">
                                خطا در دریافت اطلاعات کاربر
                            </p>
                        )}

                        {user && (
                            <div className="space-y-4">
                                {/* Identity */}
                                <section className="overflow-hidden rounded-2xl bg-[#F2F2F7]">
                                    <Row label="نام" value={user.fullName ?? "-"} first />
                                    <Row label="شماره موبایل" value={user.phoneNumber} />
                                    <Row label="ایمیل" value={user.email ?? "-"} />
                                    <Row label="کد ملی" value={user.nationalCode ?? "-"} />
                                    <Row
                                        label="وضعیت حساب"
                                        value={user.isActive ? "فعال" : "غیرفعال"}
                                        valueClassName={
                                            user.isActive ? "text-brand-primary" : "text-[#FF3B30]"
                                        }
                                        last
                                    />
                                </section>

                                {/* Stats */}
                                <section>
                                    <AdminSectionHeading title="خلاصه خرید" />

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="rounded-2xl bg-[#F2F2F7] p-3 text-center">
                                            <p className="text-[17px] font-bold tabular-nums text-[#1C1C1E]">
                                                {user.stats.totalOrders.toLocaleString("fa-IR")}
                                            </p>
                                            <p className="mt-1 text-[11px] text-[#8E8E93]">
                                                تعداد سفارشات
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-[#F2F2F7] p-3 text-center">
                                            <p className="text-[17px] font-bold tabular-nums text-[#1C1C1E]">
                                                {user.stats.totalSpent.toLocaleString("fa-IR")}
                                            </p>
                                            <p className="mt-1 text-[11px] text-[#8E8E93]">
                                                مجموع خرید (تومن)
                                            </p>
                                        </div>
                                    </div>

                                </section>

                                {/* Security / audit */}
                                <section className="overflow-hidden rounded-2xl bg-[#F2F2F7]">
                                    <Row label="آی‌پی آخرین ورود" value={user.ipAddress ?? "-"} first />
                                    <Row
                                        label="تلاش‌های ناموفق OTP"
                                        value={user.failedOtpAttempts.toLocaleString("fa-IR")}
                                    />
                                    <Row label="قفل تا" value={user.lockedUntil ?? "قفل نیست"} last />
                                </section>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Row({
    label,
    value,
    valueClassName,
    first,
    last,
}: {
    label: string;
    value: string;
    valueClassName?: string;
    first?: boolean;
    last?: boolean;
}) {
    return (
        <div
            className={
                "flex items-center justify-between px-3.5 py-2.5 " +
                (!first ? "border-t border-white" : "") +
                (last ? "" : "")
            }
        >
            <span className="text-[12.5px] text-[#8E8E93]">{label}</span>
            <span
                className={
                    "text-[12.5px] font-medium tabular-nums text-[#1C1C1E] " + (valueClassName ?? "")
                }
            >
                {value}
            </span>
        </div>
    );
}

function AdminSectionHeading({ title }: { title: string }) {
    return (
        <div className="mb-1 flex items-baseline justify-between px-1">
            <h2 className="text-[13px] font-bold text-[#1C1C1E]">{title}</h2>
        </div>
    );
}

function BuyerDialogSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-0.5 overflow-hidden rounded-2xl bg-[#F2F2F7] p-3.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between py-1">
                        <Skeleton className="h-3 w-14 rounded-full bg-[#E5E5EA]" />
                        <Skeleton className="h-3 w-20 rounded-full bg-[#E5E5EA]" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
                <Skeleton className="h-16 rounded-2xl bg-[#E5E5EA]" />
                <Skeleton className="h-16 rounded-2xl bg-[#E5E5EA]" />
            </div>
        </div>
    );
}