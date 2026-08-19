"use client";

import { Plus, X } from "lucide-react";
import { OptionItem } from "./product-form-types";

export function OptionCard({
    option,
    onNameChange,
    onValueChange,
    onAddValue,
    onRemoveValue,
    onRemoveOption,
}: {
    option: OptionItem;
    onNameChange: (name: string) => void;
    onValueChange: (valueIndex: number, value: string) => void;
    onAddValue: () => void;
    onRemoveValue: (valueIndex: number) => void;
    onRemoveOption: () => void;
}) {
    return (
        <div className="rounded-3xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2">
                <input
                    value={option.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="نام گزینه (مثلاً سایز)"
                    className="min-w-0 flex-1 rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-[13.5px] font-medium text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none"
                />
                <button
                    type="button"
                    onClick={onRemoveOption}
                    aria-label="حذف گزینه"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/10 active:bg-[#FF3B30]/15"
                >
                    <X className="h-4 w-4 text-[#FF3B30]" strokeWidth={2.25} />
                </button>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
                {option.values.map((val, valIndex) => (
                    <div key={valIndex} className="relative">
                        <input
                            value={val}
                            onChange={(e) => onValueChange(valIndex, e.target.value)}
                            placeholder="مقدار"
                            className="w-24 rounded-full bg-black/[0.04] py-2 pr-3 pl-7 text-[12.5px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none"
                        />
                        {option.values.length > 1 && (
                            <button
                                type="button"
                                onClick={() => onRemoveValue(valIndex)}
                                aria-label="حذف مقدار"
                                className="absolute left-1.5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-[#C7C7CC]"
                            >
                                <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={onAddValue}
                    className="flex items-center gap-1 rounded-full bg-[#0A7D5C]/10 px-3 py-2 text-[12.5px] font-medium text-[#0A7D5C]"
                >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    مقدار
                </button>
            </div>
        </div>
    );
}