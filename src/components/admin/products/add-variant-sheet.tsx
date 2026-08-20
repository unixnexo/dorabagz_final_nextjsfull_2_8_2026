"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { OptionItem } from "./product-form-types";
import { combinationKey } from "@/app/admin/products/variant-utils";

export function AddVariantSheet({
    open,
    onOpenChange,
    definedOptions,
    existingVariantKeys,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    definedOptions: OptionItem[];
    existingVariantKeys: Set<string>;
    onConfirm: (optionValues: Record<string, string>) => void;
}) {
    const [selected, setSelected] = useState<Record<string, string>>({});

    // Reset the picker every time the sheet opens so a previous selection
    // doesn't linger and get confused for "editing" an existing variant.
    useEffect(() => {
        if (open) setSelected({});
    }, [open]);

    const isComplete = definedOptions.every((o) => !!selected[o.name]);
    const isDuplicate = isComplete && existingVariantKeys.has(combinationKey(selected));

    function pick(optionName: string, value: string) {
        setSelected((prev) => ({ ...prev, [optionName]: value }));
    }

    function handleConfirm() {
        if (!isComplete || isDuplicate) return;
        onConfirm(selected);
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-3xl px-4 pb-6 pt-4">
                <SheetHeader className="mb-3 text-right">
                    <SheetTitle className="text-[15px] font-semibold text-[#1C1C1E]">
                        ساخت ترکیب جدید
                    </SheetTitle>
                </SheetHeader>

                <div className="max-h-[55vh] space-y-4 overflow-y-auto">
                    {definedOptions.map((option) => {
                        const values = option.values.filter((v) => v.trim());
                        return (
                            <div key={option.name}>
                                <p className="mb-2 px-1 text-[12.5px] font-medium text-[#8E8E93]">
                                    {option.name}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {values.map((value) => {
                                        const isSelected = selected[option.name] === value;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => pick(option.name, value)}
                                                className={
                                                    "rounded-full px-4 py-2 text-[13px] font-medium transition-colors " +
                                                    (isSelected
                                                        ? "bg-black text-white"
                                                        : "bg-black/[0.05] text-[#1C1C1E] active:bg-black/[0.08]")
                                                }
                                            >
                                                {value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isDuplicate && (
                    <p className="mt-3 rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-center text-[12.5px] font-medium text-[#FF3B30]">
                        این ترکیب قبلاً اضافه شده
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!isComplete || isDuplicate}
                    className="mt-4 w-full rounded-2xl bg-black py-3 text-[13.5px] font-semibold text-white disabled:opacity-30"
                >
                    افزودن ترکیب
                </button>
            </SheetContent>
        </Sheet>
    );
}