import type { OrderDetailDTO } from "@/types/order";

export function OrderItemsCard({ order }: { order: OrderDetailDTO }) {
    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <ul>
                {order.items.map((item, index) => (
                    <li
                        key={item.id}
                        className={
                            "flex items-center gap-3 px-4 py-3 " +
                            (index !== order.items.length - 1
                                ? "border-b border-[#E5E5EA]"
                                : "")
                        }
                    >
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[13.5px] font-medium text-[#1C1C1E]">
                                {item.productTitle}
                            </p>
                            {item.optionSummary && (
                                <p className="text-[11px] text-[#8E8E93]">
                                    {item.optionSummary}
                                </p>
                            )}
                        </div>
                        <span className="shrink-0 text-[11.5px] text-[#8E8E93]">
                            {item.quantity.toLocaleString("fa-IR")}×
                        </span>
                        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[#1C1C1E]">
                            {(item.unitPrice * item.quantity).toLocaleString("fa-IR")} تومان
                        </span>
                    </li>
                ))}
            </ul>

            <div className="space-y-1.5 border-t border-[#E5E5EA] px-4 py-3.5">
                <TotalsRow label="جمع جزء" value={`${order.subtotal.toLocaleString("fa-IR")} تومان`} />
                {order.discountAmount > 0 && (
                    <TotalsRow
                        label={`تخفیف${order.couponCode ? ` (${order.couponCode})` : ""}`}
                        value={`${order.discountAmount.toLocaleString("fa-IR")}- تومان`}
                        muted
                    />
                )}
                <div className="flex items-center justify-between pt-1">
                    <span className="text-[14px] font-bold text-[#1C1C1E]">مبلغ کل</span>
                    <span className="text-[15px] font-bold tabular-nums text-[#0A7D5C]">
                        {order.totalAmount.toLocaleString("fa-IR")} تومان
                    </span>
                </div>
            </div>
        </div>
    );
}

function TotalsRow({
    label,
    value,
    muted,
}: {
    label: string;
    value: string;
    muted?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-[#8E8E93]">{label}</span>
            <span
                className={
                    "text-[12.5px] font-medium tabular-nums " +
                    (muted ? "text-[#FF3B30]" : "text-[#1C1C1E]")
                }
            >
                {value}
            </span>
        </div>
    );
}