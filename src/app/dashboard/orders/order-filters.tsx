"use client";

import { Search } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { STATUS_LABELS } from "./order-status-badge";

type OrderFiltersProps = {
    search: string;
    onSearchChange: (value: string) => void;
    status: OrderStatus | "";
    onStatusChange: (value: OrderStatus | "") => void;
};

export function OrderFilters({ search, onSearchChange, status, onStatusChange }: OrderFiltersProps) {
    return (
        <>
            {/* Search */}
            <div className="relative mb-3">
                <Search className="absolute right-4 top-1/2 size-[18px] -translate-y-1/2 text-black/35" />

                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="جستجوی شماره سفارش"
                    className="h-[52px] w-full rounded-[19px] border-0 bg-white pr-11 pl-4 text-[14px] outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/10"
                />
            </div>

            {/* Status filters */}
            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 scrollbar-none" dir="rtl">
                <StatusFilterPill active={status === ""} onClick={() => onStatusChange("")}>
                    همه
                </StatusFilterPill>

                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((item) => (
                    <StatusFilterPill
                        key={item}
                        active={status === item}
                        onClick={() => onStatusChange(item)}
                    >
                        {STATUS_LABELS[item]}
                    </StatusFilterPill>
                ))}
            </div>
        </>
    );
}

function StatusFilterPill({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all active:scale-95 ${active ? "bg-[#171717] text-white" : "bg-white text-black/50"
                }`}
        >
            {children}
        </button>
    );
}