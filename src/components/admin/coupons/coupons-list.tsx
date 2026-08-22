import { Ticket } from "lucide-react";
import type { CouponDTO } from "@/types/coupon";
import { CouponCard } from "./coupon-card";

export function CouponsList({
    coupons,
    isLoading,
    isError,
    onEdit,
    onDelete,
}: {
    coupons: CouponDTO[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onEdit: (coupon: CouponDTO) => void;
    onDelete: (coupon: CouponDTO) => void;
}) {
    if (isError) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] font-medium text-[#FF3B30]">
                    خطا در دریافت اطلاعات
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-2.5">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[72px] animate-pulse rounded-3xl bg-white/70" />
                ))}
            </div>
        );
    }

    if (!coupons || coupons.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Ticket className="mx-auto h-7 w-7 text-[#C7C7CC]" strokeWidth={1.75} />
                <p className="mt-2 text-[13.5px] text-[#8E8E93]">
                    هنوز کد تخفیفی ثبت نشده
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {coupons.map((coupon) => (
                <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onEdit={() => onEdit(coupon)}
                    onDelete={() => onDelete(coupon)}
                />
            ))}
        </div>
    );
}
