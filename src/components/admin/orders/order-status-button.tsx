"use client";

import { ChevronDown } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { STATUS_LABELS, STATUS_STYLES } from "./order-status-config";

export function OrderStatusButton({
    status,
    disabled,
    onClick,
}: {
    status: OrderStatus;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex w-full items-center justify-between rounded-3xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] disabled:opacity-60"
        >
            <span className="text-[12.5px] font-medium text-[#8E8E93]">
                وضعیت سفارش
            </span>
            <span className="flex items-center gap-2">
                <span
                    className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${STATUS_STYLES[status]}`}
                >
                    {STATUS_LABELS[status]}
                </span>
                <ChevronDown className="h-4 w-4 text-[#C7C7CC]" strokeWidth={2.25} />
            </span>
        </button>
    );
}