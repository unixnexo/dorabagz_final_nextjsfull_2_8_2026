// "use client";

// import { FormField } from "./form-field";
// import { VariantItem } from "./product-form-types";
// import { VariantCard } from "./variant-card";


// export function PricingStep({
//     variants,
//     onFieldChange,
// }: {
//     variants: VariantItem[];
//     onFieldChange: (index: number, field: "price" | "stock", value: number) => void;
// }) {
//     return (
//         <div className="space-y-4 pt-4">
//             <FormField
//                 label="قیمت و موجودی"
//                 hint={
//                     variants.length > 1
//                         ? `${variants.length.toLocaleString("fa-IR")} ترکیب`
//                         : undefined
//                 }
//             >
//                 <p className="mb-2.5 px-1 text-[11.5px] text-[#8E8E93]">
//                     {variants.length > 1
//                         ? "این ترکیب‌ها بر اساس گزینه‌هایی که در مرحله قبل وارد کردید ساخته شده‌اند"
//                         : "قیمت و موجودی محصول را وارد کنید"}
//                 </p>

//                 <div className="space-y-2.5">
//                     {variants.map((variant, i) => (
//                         <VariantCard
//                             key={i}
//                             variant={variant}
//                             onFieldChange={(field, value) => onFieldChange(i, field, value)}
//                         />
//                     ))}
//                 </div>
//             </FormField>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FormField } from "./form-field";
import { OptionItem, VariantItem } from "./product-form-types";
import { VariantCard } from "./variant-card";
import { AddVariantSheet } from "./add-variant-sheet";

export function PricingStep({
    variants,
    definedOptions,
    existingVariantKeys,
    onFieldChange,
    onAddVariant,
    onRemoveVariant,
}: {
    variants: VariantItem[];
    definedOptions: OptionItem[];
    existingVariantKeys: Set<string>;
    onFieldChange: (index: number, field: "price" | "stock", value: number) => void;
    onAddVariant: (optionValues: Record<string, string>) => void;
    onRemoveVariant: (index: number) => void;
}) {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <div className="space-y-4 pt-4">
            <FormField
                label="قیمت و موجودی"
                hint={
                    variants.length > 1
                        ? `${variants.length.toLocaleString("fa-IR")} ترکیب`
                        : undefined
                }
            >
                <p className="mb-2.5 px-1 text-[11.5px] text-[#8E8E93]">
                    {definedOptions.length > 0
                        ? "برای هر ترکیب از گزینه‌ها، یک ردیف قیمت و موجودی اضافه کنید"
                        : "قیمت و موجودی محصول را وارد کنید"}
                </p>

                {variants.length === 0 ? (
                    <div className="rounded-3xl bg-white p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <p className="text-[13px] text-[#8E8E93]">
                            {definedOptions.length > 0
                                ? "هنوز هیچ ترکیبی اضافه نکرده‌اید. با دکمه پایین اولین ترکیب را بسازید."
                                : "برای شروع، قیمت و موجودی محصول را اضافه کنید."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {variants.map((variant, i) => (
                            <VariantCard
                                key={combinationSafeKey(variant, i)}
                                variant={variant}
                                onFieldChange={(field, value) => onFieldChange(i, field, value)}
                                onRemove={variants.length > 1 ? () => onRemoveVariant(i) : undefined}
                            />
                        ))}
                    </div>
                )}
            </FormField>

            {/* With real options defined, build combinations via the sheet.
          With zero options, there's only ever one possible variant (the
          empty combo) — skip the sheet and add it directly, but only if
          it isn't already there. */}
            {definedOptions.length > 0 ? (
                <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-black/[0.05] py-3 text-[13px] font-medium text-[#1C1C1E] active:bg-black/[0.08]"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.25} />
                    افزودن ترکیب
                </button>
            ) : (
                variants.length === 0 && (
                    <button
                        type="button"
                        onClick={() => onAddVariant({})}
                        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-black/[0.05] py-3 text-[13px] font-medium text-[#1C1C1E] active:bg-black/[0.08]"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.25} />
                        افزودن قیمت
                    </button>
                )
            )}

            <AddVariantSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                definedOptions={definedOptions}
                existingVariantKeys={existingVariantKeys}
                onConfirm={(optionValues) => {
                    onAddVariant(optionValues);
                    setSheetOpen(false);
                }}
            />
        </div>
    );
}

// variants don't carry a stable id, so key on index + a snapshot of their
// option values; fine since list identity only needs to survive re-renders
// within one render pass, not across additions (React still reconciles
// correctly because indices shift together with the array).
function combinationSafeKey(variant: VariantItem, index: number) {
    return `${index}-${Object.values(variant.optionValues).join("-")}`;
}