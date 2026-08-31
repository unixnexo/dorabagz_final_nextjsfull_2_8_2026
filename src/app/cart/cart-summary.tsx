"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type CartSummaryProps = {
    totalPrice: number;
    isLoggedIn: boolean;
    hasOutOfStockItems: boolean;
    onRemoveOutOfStockItems: () => Promise<void> | void;
};

export function CartSummary({
    totalPrice,
    isLoggedIn,
    hasOutOfStockItems,
    onRemoveOutOfStockItems,
}: CartSummaryProps) {
    const router = useRouter();

    async function handleContinue() {
        if (!isLoggedIn) return; // guarded by disabled state too, but double-safe
        if (hasOutOfStockItems) {
            await onRemoveOutOfStockItems();
        }
        router.push("/checkout");
    }

    return (
        <section className="mt-5 rounded-[28px] bg-white p-5">
            <div className="flex items-center justify-between text-[14px]">
                <span className="text-black/50">جمع محصولات</span>
                <span className="font-medium">{totalPrice.toLocaleString("fa-IR")} تومان</span>
            </div>

            <div className="my-4 h-px bg-black/[0.06]" />

            <div className="flex items-end justify-between">
                <span className="text-[15px] font-semibold">جمع کل</span>
                <div className="text-left">
                    <span className="text-[21px] font-bold tracking-tight">
                        {totalPrice.toLocaleString("fa-IR")}
                    </span>
                    <span className="mr-1 text-[12px] text-black/45">تومان</span>
                </div>
            </div>

            {!isLoggedIn && (
                <p className="mt-3 text-center text-[12px] leading-5 text-black/45">
                    برای ادامه فرآیند خرید ابتدا وارد حساب کاربری خود شوید
                </p>
            )}

            <Button
                type="button"
                onClick={handleContinue}
                disabled={!isLoggedIn}
                className="mt-5 h-13 w-full rounded-[18px] text-[15px] font-semibold disabled:opacity-40"
            >
                ادامه فرآیند خرید
            </Button>
        </section>
    );
}