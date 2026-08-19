"use client";

import { Pencil, Trash2, ImageOff } from "lucide-react";
import type { CategoryDTO } from "@/types/category";

export function CategoryRow({
    category,
    isChild,
    isLast,
    onEdit,
    onDelete,
}: {
    category: CategoryDTO;
    isChild?: boolean;
    isLast?: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div
            className={
                "flex items-center gap-3 py-3 " +
                (isChild ? "pr-4 pl-4" : "px-4") +
                (isLast ? "" : " border-b border-[#E5E5EA]")
            }
        >
            {isChild && (
                <span className="h-4 w-3 shrink-0 self-stretch border-r-2 border-b-2 border-[#D1D1D6] rounded-bl-md" />
            )}

            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-2xl bg-black/[0.05]">
                {category.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={category.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-4 w-4 text-[#C7C7CC]" strokeWidth={2} />
                    </div>
                )}
            </div>

            <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#1C1C1E]">
                {category.title}
            </p>

            <div className="flex shrink-0 items-center gap-1.5">
                <button
                    type="button"
                    onClick={onEdit}
                    aria-label="ویرایش"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] active:bg-black/[0.08]"
                >
                    <Pencil className="h-3.5 w-3.5 text-[#636366]" strokeWidth={2.25} />
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label="حذف"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF3B30]/10 active:bg-[#FF3B30]/15"
                >
                    <Trash2 className="h-3.5 w-3.5 text-[#FF3B30]" strokeWidth={2.25} />
                </button>
            </div>
        </div>
    );
}