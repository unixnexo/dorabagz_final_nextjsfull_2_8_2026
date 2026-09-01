"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function PaymentSuccessBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 flex items-center gap-3 rounded-[22px] bg-emerald-50 px-4 py-3.5"
        >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="size-5 text-emerald-600" />
            </div>
            <p className="text-[13.5px] font-medium leading-6 text-emerald-700">
                پرداخت با موفقیت انجام شد.
            </p>
        </motion.div>
    );
}

/**
 * Rare-but-real edge case: payment succeeded but stock ran out in the
 * race window. Money is owed back to the user, so this stays visually
 * heavier and more persistent than the plain success banner — no
 * implication it can be dismissed or missed.
 */
export function StockIssueBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="mb-4 overflow-hidden rounded-[22px] border-2 border-red-200 bg-red-50"
        >
            <div className="flex items-start gap-3 px-4 py-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="size-5 text-red-600" />
                </div>
                <div>
                    <p className="text-[13.5px] font-bold leading-6 text-red-700">
                        سفارش شما لغو شد — مبلغ پرداختی بازگردانده می‌شود
                    </p>
                    <p className="mt-1 text-[12.5px] leading-6 text-red-600/90">
                        پرداخت شما با موفقیت انجام شد، اما متأسفانه موجودی یکی از کالاها در همین فاصله تمام
                        شد. این سفارش لغو شده و مبلغ پرداختی توسط پشتیبانی به شما بازگردانده خواهد شد.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}