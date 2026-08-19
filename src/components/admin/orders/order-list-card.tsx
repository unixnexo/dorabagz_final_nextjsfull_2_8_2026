import Link from "next/link";
import { ChevronLeft, Truck } from "lucide-react";
import type { OrderListItemDTO } from "@/types/order";
import { OrderStatusBadge } from "./order-status-badge";
import { COURIER_LABELS } from "./order-status-config";

export function OrderListCard({ order }: { order: OrderListItemDTO }) {
    return (
        <Link
            href={`/admin/orders/${order.id}`}
            className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:bg-black/[0.02]"
        >
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span dir="ltr" className="text-[12.5px] font-semibold text-[#8E8E93]">
                        #{order.id.slice(0, 8)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                </div>

                <p className="mt-1.5 text-[15px] font-bold tabular-nums text-[#1C1C1E]">
                    {order.totalAmount.toLocaleString("fa-IR")} تومان
                </p>

                <div className="mt-1.5 flex items-center gap-3 text-[11.5px] text-[#8E8E93]">
                    <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" strokeWidth={2.25} />
                        {COURIER_LABELS[order.courierType] ?? order.courierType}
                    </span>
                    <span>{order.itemCount} قلم</span>
                    <span>{new Date(order.createdAt).toLocaleDateString("fa-IR")}</span>
                </div>
            </div>

            <ChevronLeft className="h-4 w-4 shrink-0 text-[#C7C7CC]" strokeWidth={2.25} />
        </Link>
    );
}