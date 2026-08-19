import type { OrderStatus } from "@/types/order";
import { STATUS_LABELS, STATUS_STYLES } from "./order-status-config";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[status]}`}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}