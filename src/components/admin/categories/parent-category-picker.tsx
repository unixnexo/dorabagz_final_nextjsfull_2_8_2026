"use client";

import { cn } from "@/lib/utils";
import type { CategoryDTO } from "@/types/category";

export function ParentCategoryPicker({
    options,
    value,
    onChange,
    excludeId,
}: {
    options: CategoryDTO[];
    value: string;
    onChange: (id: string) => void;
    excludeId?: string;
}) {
    const selectable = options.filter((o) => o.id !== excludeId);

    return (
        <div>
            <p className="mb-1.5 px-1 text-[12.5px] font-medium text-[#8E8E93]">
                دسته والد (اختیاری)
            </p>
            <div className="flex flex-wrap gap-1.5">
                <Pill
                    label="بدون والد (سطح اول)"
                    active={value === ""}
                    onClick={() => onChange("")}
                />
                {selectable.map((option) => (
                    <Pill
                        key={option.id}
                        label={option.title}
                        active={value === option.id}
                        onClick={() => onChange(option.id)}
                    />
                ))}
            </div>
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
                "rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-colors",
                active
                    ? "bg-[#0A7D5C] text-white"
                    : "bg-black/[0.05] text-[#1C1C1E] active:bg-black/[0.08]"
            )}
        >
            {label}
        </button>
    );
}