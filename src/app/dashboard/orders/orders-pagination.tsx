"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type OrdersPaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function OrdersPagination({ page, totalPages, onPageChange }: OrdersPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-5 flex items-center justify-between rounded-[22px] bg-white px-3 py-2">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="flex size-10 items-center justify-center rounded-full transition-colors active:scale-95 disabled:opacity-25"
            >
                <ChevronRight className="size-5" />
            </button>

            <span className="text-[13px] font-medium text-black/55">
                صفحه {page} از {totalPages}
            </span>

            <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="flex size-10 items-center justify-center rounded-full transition-colors active:scale-95 disabled:opacity-25"
            >
                <ChevronLeft className="size-5" />
            </button>
        </div>
    );
}