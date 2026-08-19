"use client";

import { FormField } from "./form-field";
import { VariantItem } from "./product-form-types";
import { VariantCard } from "./variant-card";


export function PricingStep({
    variants,
    onFieldChange,
}: {
    variants: VariantItem[];
    onFieldChange: (index: number, field: "price" | "stock", value: number) => void;
}) {
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
                    {variants.length > 1
                        ? "این ترکیب‌ها بر اساس گزینه‌هایی که در مرحله قبل وارد کردید ساخته شده‌اند"
                        : "قیمت و موجودی محصول را وارد کنید"}
                </p>

                <div className="space-y-2.5">
                    {variants.map((variant, i) => (
                        <VariantCard
                            key={i}
                            variant={variant}
                            onFieldChange={(field, value) => onFieldChange(i, field, value)}
                        />
                    ))}
                </div>
            </FormField>
        </div>
    );
}