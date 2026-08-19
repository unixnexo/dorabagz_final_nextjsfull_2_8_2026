"use client";

import { Plus } from "lucide-react";
import { OptionItem } from "./product-form-types";
import { FormField } from "./form-field";
import { OptionCard } from "./option-card";


export function OptionsStep({
    options,
    onAddOption,
    onUpdateOptionName,
    onUpdateOptionValue,
    onAddOptionValue,
    onRemoveOptionValue,
    onRemoveOption,
}: {
    options: OptionItem[];
    onAddOption: () => void;
    onUpdateOptionName: (optIndex: number, name: string) => void;
    onUpdateOptionValue: (optIndex: number, valIndex: number, value: string) => void;
    onAddOptionValue: (optIndex: number) => void;
    onRemoveOptionValue: (optIndex: number, valIndex: number) => void;
    onRemoveOption: (optIndex: number) => void;
}) {
    return (
        <div className="space-y-4 pt-4">
            <FormField label="گزینه‌های محصول" hint="اختیاری">
                {options.length === 0 ? (
                    <div className="rounded-3xl bg-white p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <p className="text-[13px] text-[#8E8E93]">
                            اگر محصول شما سایز، رنگ یا گزینه‌های دیگری دارد، اینجا اضافه
                            کنید. قیمت و موجودی هر ترکیب در مرحله بعد مشخص می‌شود.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {options.map((opt, optIndex) => (
                            <OptionCard
                                key={optIndex}
                                option={opt}
                                onNameChange={(name) => onUpdateOptionName(optIndex, name)}
                                onValueChange={(valIndex, value) =>
                                    onUpdateOptionValue(optIndex, valIndex, value)
                                }
                                onAddValue={() => onAddOptionValue(optIndex)}
                                onRemoveValue={(valIndex) => onRemoveOptionValue(optIndex, valIndex)}
                                onRemoveOption={() => onRemoveOption(optIndex)}
                            />
                        ))}
                    </div>
                )}
            </FormField>

            <button
                type="button"
                onClick={onAddOption}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-black/[0.05] py-3 text-[13px] font-medium text-[#1C1C1E] active:bg-black/[0.08]"
            >
                <Plus className="h-4 w-4" strokeWidth={2.25} />
                افزودن گزینه جدید
            </button>
        </div>
    );
}