import { Receipt } from "lucide-react";
import type { PaymentStatus } from "@/types/order";

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    PENDING: "در انتظار پرداخت",
    SUCCESS: "پرداخت موفق",
    FAILED: "پرداخت ناموفق",
};

const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
    PENDING: "bg-orange-50 text-orange-600",
    SUCCESS: "bg-emerald-50 text-emerald-600",
    FAILED: "bg-red-50 text-red-500",
};

export function OrderPaymentCard({
    paymentStatus,
    paymentRefId,
}: {
    paymentStatus: PaymentStatus | null;
    paymentRefId: string | null;
}) {
    return (
        <div className="flex items-center gap-3 rounded-[25px] bg-brand-secondary p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f1f2f3]">
                <Receipt className="size-4 text-black/60" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[13px] text-black/40">وضعیت پرداخت</p>

                {paymentStatus ? (
                    <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[12px] font-medium ${PAYMENT_STATUS_CLASS[paymentStatus]}`}
                    >
                        {PAYMENT_STATUS_LABELS[paymentStatus]}
                    </span>
                ) : (
                    <p className="mt-1 text-[13px] text-black/50">-</p>
                )}
            </div>

            {paymentRefId && (
                <div className="shrink-0 text-left">
                    <p className="text-[11px] text-black/35">کد پیگیری</p>
                    <p className="text-[12px] font-medium tabular-nums text-black/60">{paymentRefId}</p>
                </div>
            )}
        </div>
    );
}