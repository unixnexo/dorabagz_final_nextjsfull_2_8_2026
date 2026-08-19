import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { OrderDetailDTO } from "@/types/order";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";

export function OrderDetailHeader({ order }: { order: OrderDetailDTO }) {
    return (
        <div className="flex items-center gap-3 pt-4">
            <Link
                href="/admin/orders"
                aria-label="بازگشت به سفارش‌ها"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] active:bg-black/[0.08]"
            >
                <ChevronRight className="h-4.5 w-4.5 text-[#1C1C1E]" strokeWidth={2.25} />
            </Link>

            <div className="min-w-0 flex-1">
                <p dir="ltr" className="text-left text-[13px] font-semibold text-[#8E8E93]">
                    #{order.id.slice(0, 8)}
                </p>
            </div>

            <OrderStatusBadge status={order.status} />
        </div>
    );
}