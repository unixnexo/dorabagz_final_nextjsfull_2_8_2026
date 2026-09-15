"use client";

import { Check } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import type { OrderStatus } from "@/types/order";
import { STATUS_LABELS, STATUS_STYLES } from "./order-status-config";

const STATUS_ORDER: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
];

export function StatusPickerSheet({
    open,
    currentStatus,
    onOpenChange,
    onSelect,
}: {
    open: boolean;
    currentStatus: OrderStatus;
    onOpenChange: (open: boolean) => void;
    onSelect: (status: OrderStatus) => void;
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="rounded-t-3xl border-0 bg-[#F2F2F7] px-4 pb-8"
            >
                <SheetHeader className="pb-5 pt-3 text-right">
                    <SheetTitle className="absolute top-3 text-right text-[17px] font-bold text-[#1C1C1E]">
                        تغییر وضعیت سفارش
                    </SheetTitle>
                </SheetHeader>

                <ul className="mt-2 overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {STATUS_ORDER.map((status, index) => {
                        const isActive = status === currentStatus;
                        return (
                            <li key={status}>
                                <button
                                    type="button"
                                    onClick={() => onSelect(status)}
                                    className={
                                        "flex w-full items-center gap-3 px-4 py-3.5 active:bg-black/[0.03] " +
                                        (index !== STATUS_ORDER.length - 1
                                            ? "border-b border-[#E5E5EA]"
                                            : "")
                                    }
                                >
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${STATUS_STYLES[status]}`}
                                    >
                                        {STATUS_LABELS[status]}
                                    </span>
                                    {isActive && (
                                        <Check className="mr-auto h-4 w-4 text-brand-primary" strokeWidth={2.5} />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </SheetContent>
        </Sheet>
    );
}