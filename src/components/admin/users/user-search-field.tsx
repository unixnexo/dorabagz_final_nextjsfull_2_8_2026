"use client";

import { Search, X } from "lucide-react";

export function UserSearchField({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex items-center gap-2 rounded-2xl bg-black/[0.05] px-3.5 py-2.5">
            <Search
                className="h-4 w-4 shrink-0 text-[#8E8E93]"
                strokeWidth={2.25}
            />

            <input
                dir="rtl"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="جستجو بر اساس شماره یا نام..."
                className="flex-1 bg-transparent text-[14px] text-[#1C1C1E] outline-none placeholder:text-[#8E8E93]"
            />

            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    aria-label="پاک کردن جستجو"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C7C7CC]"
                >
                    <X
                        className="h-3 w-3 text-white"
                        strokeWidth={2.5}
                    />
                </button>
            )}
        </div>
    );
}