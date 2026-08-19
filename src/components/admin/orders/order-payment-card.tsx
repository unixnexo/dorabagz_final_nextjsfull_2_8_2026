import type { OrderDetailDTO } from "@/types/order";

export function OrderPaymentCard({ order }: { order: OrderDetailDTO }) {
    return (
        <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div>
                <p className="text-[12.5px] text-[#8E8E93]">وضعیت پرداخت</p>
                <p className="mt-0.5 text-[13.5px] font-semibold text-[#1C1C1E]">
                    {order.paymentStatus ?? "-"}
                </p>
            </div>
            {order.paymentRefId && (
                <div className="text-left">
                    <p className="text-[12.5px] text-[#8E8E93]">کد پیگیری</p>
                    <p dir="ltr" className="mt-0.5 text-[12.5px] font-medium tabular-nums text-[#1C1C1E]">
                        {order.paymentRefId}
                    </p>
                </div>
            )}
        </div>
    );
}