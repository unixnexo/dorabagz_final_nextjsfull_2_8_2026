"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

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
            {/* <div className="flex items-center justify-between text-[14px]">
                <span className="text-black/50">جمع محصولات</span>
                <span className="font-medium">{totalPrice.toLocaleString("fa-IR")} تومن</span>
            </div> */}

            <div className="flex items-center justify-between text-[14px]">
                <span className="text-black/50">جمع محصولات</span>
                <span className="relative inline-block overflow-hidden font-medium">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={totalPrice}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                            className="inline-block"
                        >
                            {totalPrice.toLocaleString("fa-IR")} تومن
                        </motion.span>
                    </AnimatePresence>
                </span>
            </div>

            <div className="my-4 h-px bg-black/[0.06]" />

            {/* <div className="flex items-end justify-between">
                <span className="text-[15px] font-semibold">جمع کل</span>
                <div className="text-left">
                    <span className="text-[21px] font-bold tracking-tight">
                        {totalPrice.toLocaleString("fa-IR")}
                    </span>
                    <span className="mr-1 text-[12px] text-black/45">تومن</span>
                </div>
            </div> */}

            <div className="flex items-end justify-between">
                <span className="text-[15px] font-semibold">جمع کل</span>
                <div className="flex items-baseline text-left">
                    <span className="relative inline-block overflow-hidden text-[21px] font-bold tracking-tight">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={totalPrice}
                                initial={{ y: 14, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -14, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                className="inline-block"
                            >
                                {totalPrice.toLocaleString("fa-IR")}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                    <span className="mr-1 text-[12px] text-black/45">تومن</span>
                </div>
            </div>

            {!isLoggedIn && (
                <p className="mt-3 text-center text-[12px] leading-5 text-black/45">
                    برای ادامه فرآیند خرید ابتدا وارد حساب کاربری خود شوید
                </p>
            )}

            <Button
                type="button"
                onClick={() => {
                    if (!isLoggedIn) {
                        router.push("/login");
                        return;
                    }

                    handleContinue();
                }}
                className="mt-5 w-full"
            >
                {isLoggedIn ? "ادامه فرآیند خرید" : "ورود"}
            </Button>
        </section>
    );
}