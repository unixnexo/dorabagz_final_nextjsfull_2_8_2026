"use client";

import { VariantItem } from "./product-form-types";


export function VariantCard({
    variant,
    onFieldChange,
}: {
    variant: VariantItem;
    onFieldChange: (field: "price" | "stock", value: number) => void;
}) {
    const comboLabel =
        Object.keys(variant.optionValues).length === 0
            ? "تک نوع (بدون گزینه)"
            : Object.entries(variant.optionValues)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" / ");

    const isPriced = variant.price > 0;

    return (
        <div className="rounded-3xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-1.5">
                <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1C1C1E]">
                    {comboLabel}
                </p>
                {!isPriced && (
                    <span className="shrink-0 rounded-full bg-[#FF9500]/12 px-2 py-0.5 text-[10px] font-semibold text-[#B25E00]">
                        بدون قیمت
                    </span>
                )}
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 rounded-2xl bg-black/[0.04] px-3 py-2">
                    <span className="text-[10.5px] font-medium text-[#8E8E93]">
                        قیمت (تومان)
                    </span>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={variant.price || ""}
                        onChange={(e) => onFieldChange("price", Number(e.target.value) || 0)}
                        placeholder="۰"
                        className="bg-transparent text-[13.5px] font-semibold tabular-nums text-[#1C1C1E] outline-none"
                    />
                </label>

                <label className="flex flex-col gap-1 rounded-2xl bg-black/[0.04] px-3 py-2">
                    <span className="text-[10.5px] font-medium text-[#8E8E93]">
                        موجودی
                    </span>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={variant.stock || ""}
                        onChange={(e) => onFieldChange("stock", Number(e.target.value) || 0)}
                        placeholder="۰"
                        className="bg-transparent text-[13.5px] font-semibold tabular-nums text-[#1C1C1E] outline-none"
                    />
                </label>
            </div>
        </div>
    );
}