import { Clock3, CheckCircle2, XCircle, Truck } from "lucide-react";
import type { OrderStatus } from "@/types/order";

export const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "در انتظار پرداخت",
    CONFIRMED: "پرداخت شده",
    COMPLETED: "تکمیل شده",
    CANCELLED: "لغو شده",
};

const STATUS_CONFIG: Record<
    OrderStatus,
    {
        icon: typeof Clock3;
        className: string;
    }
> = {
    PENDING: {
        icon: Clock3,
        className: "bg-orange-50 text-orange-600",
    },
    CONFIRMED: {
        icon: Truck,
        className: "bg-blue-50 text-blue-600",
    },
    COMPLETED: {
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-600",
    },
    CANCELLED: {
        icon: XCircle,
        className: "bg-red-50 text-red-500",
    },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium ${config.className}`}
        >
            <Icon className="size-3.5" />
            {STATUS_LABELS[status]}
        </div>
    );
}