"use client";

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
import { STATUS_LABELS } from "./order-status-config";

const STATUS_ORDER: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
];

export function OrderStatusFilter({
    value,
    onChange,
}: {
    value: OrderStatus | "";
    onChange: (status: OrderStatus | "") => void;
}) {
    return (
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Pill label="همه" active={value === ""} onClick={() => onChange("")} />
            {STATUS_ORDER.map((status) => (
                <Pill
                    key={status}
                    label={STATUS_LABELS[status]}
                    active={value === status}
                    onClick={() => onChange(status)}
                />
            ))}
        </div>
    );
}

function Pill({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-colors",
                active
                    ? "bg-brand-primary text-white"
                    : "bg-black/[0.05] text-[#1C1C1E] active:bg-black/[0.08]"
            )}
        >
            {label}
        </button>
    );
}