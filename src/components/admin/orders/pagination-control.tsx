import { ChevronRight, ChevronLeft } from "lucide-react";

export function PaginationControl({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-4 flex items-center justify-center gap-3">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                aria-label="صفحه قبلی"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] disabled:opacity-35"
            >
                <ChevronRight className="h-4 w-4 text-[#1C1C1E]" strokeWidth={2.25} />
            </button>

            <span className="text-[12.5px] font-medium tabular-nums text-[#8E8E93]">
                صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
            </span>

            <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                aria-label="صفحه بعدی"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] disabled:opacity-35"
            >
                <ChevronLeft className="h-4 w-4 text-[#1C1C1E]" strokeWidth={2.25} />
            </button>
        </div>
    );
}