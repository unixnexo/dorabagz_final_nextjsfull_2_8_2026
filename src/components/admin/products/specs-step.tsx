"use client";

import { Plus, X } from "lucide-react";
import { SpecItem } from "./product-form-types";
import { FormField } from "./form-field";


export function SpecsStep({
    specs,
    onAdd,
    onUpdate,
    onRemove,
}: {
    specs: SpecItem[];
    onAdd: () => void;
    onUpdate: (index: number, field: "key" | "value", value: string) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <div className="space-y-4 pt-4">
            <FormField label="مشخصات فنی" hint="اختیاری">
                {specs.length === 0 ? (
                    <div className="rounded-3xl bg-white p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <p className="text-[13px] text-[#8E8E93]">
                            می‌توانید مشخصاتی مثل «جنس بدنه: آلومینیوم» اضافه کنید
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {specs.map((spec, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 rounded-3xl bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                            >
                                <input
                                    value={spec.key}
                                    onChange={(e) => onUpdate(i, "key", e.target.value)}
                                    placeholder="کلید (مثلاً جنس بدنه)"
                                    className="w-[38%] shrink-0 rounded-2xl bg-black/[0.04] px-3 py-2.5 text-[13px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none"
                                />
                                <input
                                    value={spec.value}
                                    onChange={(e) => onUpdate(i, "value", e.target.value)}
                                    placeholder="مقدار (مثلاً آلومینیوم)"
                                    className="min-w-0 flex-1 rounded-2xl bg-black/[0.04] px-3 py-2.5 text-[13px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemove(i)}
                                    aria-label="حذف"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/10 active:bg-[#FF3B30]/15"
                                >
                                    <X className="h-3.5 w-3.5 text-[#FF3B30]" strokeWidth={2.25} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </FormField>

            <button
                type="button"
                onClick={onAdd}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-black/[0.05] py-3 text-[13px] font-medium text-[#1C1C1E] active:bg-black/[0.08]"
            >
                <Plus className="h-4 w-4" strokeWidth={2.25} />
                افزودن مشخصه
            </button>
        </div>
    );
}