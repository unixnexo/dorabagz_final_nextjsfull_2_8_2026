"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { getCategoryTreeAction } from "@/server/category/actions";

export function DiscountCategoryPicker({
    selectedIds,
    onChange,
}: {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const [pickerOpen, setPickerOpen] = useState(false);

    const { data: categories, isLoading, isError } = useQuery({
        queryKey: ["category-tree-for-discount"],
        queryFn: async () => {
            const result = await getCategoryTreeAction();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        enabled: pickerOpen,
    });

    const flatById = useMemo(() => {
        const map = new Map<string, { id: string; title: string }>();
        (categories ?? []).forEach((cat) => {
            map.set(cat.id, { id: cat.id, title: cat.title });
            cat.children.forEach((child) => map.set(child.id, { id: child.id, title: child.title }));
        });
        return map;
    }, [categories]);

    const selectedCategories = useMemo(
        () => selectedIds.map((id) => flatById.get(id)).filter((c): c is { id: string; title: string } => !!c),
        [selectedIds, flatById]
    );

    function toggle(id: string) {
        onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
    }

    return (
        <div>
            <label className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]">
                دسته‌بندی‌های مشمول (شامل زیردسته‌ها)
            </label>

            <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-right text-[13px] text-[#1C1C1E]"
            >
                {selectedIds.length === 0 ? (
                    <span className="text-[#C7C7CC]">انتخاب دسته‌بندی...</span>
                ) : (
                    `${selectedIds.length.toLocaleString("fa-IR")} دسته‌بندی انتخاب شده`
                )}
            </button>

            {selectedCategories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedCategories.map((c) => (
                        <span
                            key={c.id}
                            className="flex items-center gap-1 rounded-full bg-black/[0.05] py-1 pl-1 pr-2.5 text-[11.5px] text-[#1C1C1E]"
                        >
                            {c.title}
                            <button
                                type="button"
                                onClick={() => toggle(c.id)}
                                aria-label="حذف"
                                className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10"
                            >
                                <X className="h-2.5 w-2.5" strokeWidth={2.5} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
                <SheetContent side="bottom" className="max-h-[80dvh] rounded-t-3xl px-4 pb-6 pt-4">
                    <SheetHeader className="mb-3 text-right">
                        <SheetTitle className="text-[15px] font-semibold text-[#1C1C1E]">
                            انتخاب دسته‌بندی‌ها
                        </SheetTitle>
                    </SheetHeader>

                    <div className="max-h-[60dvh] space-y-3 overflow-y-auto">
                        {isLoading && (
                            <div className="space-y-1.5">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="h-[42px] animate-pulse rounded-2xl bg-black/[0.04]" />
                                ))}
                            </div>
                        )}

                        {isError && (
                            <p className="py-6 text-center text-[12.5px] font-medium text-[#FF3B30]">
                                خطا در دریافت دسته‌بندی‌ها
                            </p>
                        )}

                        {!isLoading && !isError && categories?.map((cat) => {
                            const isParentSelected = selectedIds.includes(cat.id);
                            return (
                                <div key={cat.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(cat.id)}
                                        className={
                                            "flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-right text-[13px] font-medium " +
                                            (isParentSelected ? "bg-black text-white" : "bg-black/[0.04] text-[#1C1C1E]")
                                        }
                                    >
                                        <span className="truncate">{cat.title}</span>
                                        {isParentSelected && <span className="shrink-0 text-[11px]">انتخاب شد</span>}
                                    </button>

                                    {cat.children.length > 0 && (
                                        <div className="mt-1.5 space-y-1.5 pr-3">
                                            {cat.children.map((child) => {
                                                const isChildSelected = selectedIds.includes(child.id);
                                                return (
                                                    <button
                                                        key={child.id}
                                                        type="button"
                                                        onClick={() => toggle(child.id)}
                                                        className={
                                                            "flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-right text-[12.5px] " +
                                                            (isChildSelected ? "bg-black text-white" : "bg-black/[0.03] text-[#1C1C1E]")
                                                        }
                                                    >
                                                        <span className="truncate">{child.title}</span>
                                                        {isChildSelected && <span className="shrink-0 text-[10.5px]">انتخاب شد</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {!isLoading && !isError && categories && categories.length === 0 && (
                            <p className="py-6 text-center text-[12.5px] text-[#8E8E93]">
                                دسته‌بندی‌ای پیدا نشد
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setPickerOpen(false)}
                        className="mt-4 w-full rounded-2xl bg-black py-3 text-[13.5px] font-semibold text-white"
                    >
                        تایید
                    </button>
                </SheetContent>
            </Sheet>
        </div>
    );
}
