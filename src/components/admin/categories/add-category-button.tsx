"use client";

import { Plus } from "lucide-react";

export function AddCategoryButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A7D5C] shadow-[0_8px_20px_-8px_rgba(10,125,92,0.6)] active:scale-95 transition-transform"
            aria-label="دسته جدید"
        >
            <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
        </button>
    );
}