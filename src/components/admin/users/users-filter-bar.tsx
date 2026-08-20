"use client";

import { cn } from "@/lib/utils";

type ActiveFilter = "all" | "active" | "inactive";

export function UsersFilterBar({
    role,
    activeFilter,
    onRoleChange,
    onActiveFilterChange,
}: {
    role: string;
    activeFilter: ActiveFilter;
    onRoleChange: (value: string) => void;
    onActiveFilterChange: (value: ActiveFilter) => void;
}) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <FilterPill
                active={role === ""}
                label="همه نقش‌ها"
                onClick={() => onRoleChange("")}
            />

            <FilterPill
                active={role === "USER"}
                label="کاربران"
                onClick={() => onRoleChange("USER")}
            />

            <FilterPill
                active={role === "ADMIN"}
                label="مدیران"
                onClick={() => onRoleChange("ADMIN")}
            />

            <div className="h-8 w-px shrink-0 bg-[#E5E5EA]" />

            <FilterPill
                active={activeFilter === "all"}
                label="همه"
                onClick={() => onActiveFilterChange("all")}
            />

            <FilterPill
                active={activeFilter === "active"}
                label="فعال"
                onClick={() => onActiveFilterChange("active")}
            />

            <FilterPill
                active={activeFilter === "inactive"}
                label="غیرفعال"
                onClick={() => onActiveFilterChange("inactive")}
            />
        </div>
    );
}

function FilterPill({
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
                "shrink-0 rounded-full px-3.5 py-2 text-[12px] font-medium transition-colors",
                active
                    ? "bg-[#0A7D5C] text-white"
                    : "bg-black/[0.05] text-[#636366] active:bg-black/[0.08]"
            )}
        >
            {label}
        </button>
    );
}