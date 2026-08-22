"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { createDiscountGroupAction, updateDiscountGroupAction } from "@/server/discount/actions";
import type { DiscountGroupDTO, DiscountType } from "@/types/discount";
import { SegmentedControl } from "./segmented-control";
import { FormField, TextInput } from "./form-field";
import { DiscountProductPicker } from "./discount-product-picker";
import { DiscountCategoryPicker } from "./discount-category-picker";
import { JalaliDatePicker } from "./jalali-date-picker";
import toast from "react-hot-toast";

export function DiscountFormSheet({
    open,
    onOpenChange,
    editing,
    onDone,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: DiscountGroupDTO | null;
    onDone: () => void;
}) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState<DiscountType>("PERCENT");
    const [value, setValue] = useState(10);
    const [startAt, setStartAt] = useState<string | null>(null);
    const [endAt, setEndAt] = useState<string | null>(null);
    const [productIds, setProductIds] = useState<string[]>([]);
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset (or hydrate for edit) every time the sheet opens.
    useEffect(() => {
        if (!open) return;
        setTitle(editing?.title ?? "");
        setType(editing?.type ?? "PERCENT");
        setValue(editing?.value ?? 10);
        setStartAt(editing?.startAt ?? null);
        setEndAt(editing?.endAt ?? null);
        setProductIds(editing?.productIds ?? []);
        setCategoryIds(editing?.categoryIds ?? []);
        setError(null);
    }, [open, editing]);

    async function handleSubmit() {
        setError(null);

        // if (!title.trim()) {
        //     setError("لطفاً یک عنوان وارد کنید.");
        //     return;
        // }

        if (!title.trim()) {
            const message = "یه عنوان برای گروه تخفیف وارد کن.";
            setError(message);
            toast.error(message);
            return;
        }

        // if (productIds.length === 0 && categoryIds.length === 0) {
        //     setError("حداقل یک محصول یا دسته‌بندی انتخاب کنید.");
        //     return;
        // }

        if (productIds.length === 0 && categoryIds.length === 0) {
            const message = "حداقل یه محصول یا دسته‌بندی انتخاب کن.";
            setError(message);
            toast.error(message);
            return;
        }

        setIsSubmitting(true);
        const payload = {
            title: title.trim(),
            type,
            value,
            startAt,
            endAt,
            productIds,
            categoryIds,
        };

        const result = editing
            ? await updateDiscountGroupAction({ id: editing.id, ...payload })
            : await createDiscountGroupAction(payload);
        setIsSubmitting(false);

        // if (!result.success) {
        //     setError(result.error);
        //     return;
        // }
        // onDone();

        if (!result.success) {
            setError(result.error);
            toast.error(result.error || "ذخیره گروه تخفیف انجام نشد.");
            return;
        }

        toast.success(
            editing
                ? "گروه تخفیف با موفقیت ویرایش شد."
                : "گروه تخفیف با موفقیت ساخته شد."
        );

        onDone();
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl px-4 pb-6 pt-4">
                <SheetHeader className="mb-4 text-right">
                    <SheetTitle className="text-[15px] font-semibold text-[#1C1C1E]">
                        {editing ? "ویرایش گروه تخفیف" : "گروه تخفیف جدید"}
                    </SheetTitle>
                </SheetHeader>

                <div className="space-y-4">
                    <FormField
                        label="عنوان"
                        hint="فقط برای مدیر — به مشتری نمایش داده نمی‌شود"
                    >
                        <TextInput
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="مثلاً حراج تابستانه"
                        />
                    </FormField>

                    <FormField label="نوع تخفیف">
                        <SegmentedControl
                            value={type}
                            onChange={setType}
                            options={[
                                { value: "PERCENT", label: "درصدی" },
                                { value: "FIXED", label: "مبلغ ثابت" },
                            ]}
                        />
                    </FormField>

                    <FormField label={type === "PERCENT" ? "درصد تخفیف (۱ تا ۱۰۰)" : "مبلغ تخفیف (تومان)"}>
                        <TextInput
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={type === "PERCENT" ? 100 : undefined}
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value) || 0)}
                        />
                    </FormField>

                    <JalaliDatePicker
                        label="شروع (اختیاری — خالی یعنی همین الان فعال)"
                        value={startAt}
                        onChange={setStartAt}
                        onClear={() => setStartAt(null)}
                    />

                    <JalaliDatePicker
                        label="پایان (اختیاری — خالی یعنی تا حذف دستی فعال می‌ماند)"
                        value={endAt}
                        onChange={setEndAt}
                        onClear={() => setEndAt(null)}
                    />

                    <DiscountProductPicker selectedIds={productIds} onChange={setProductIds} />

                    <DiscountCategoryPicker selectedIds={categoryIds} onChange={setCategoryIds} />
                </div>

                {error && (
                    <p className="mt-4 rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-5 w-full rounded-2xl bg-black py-3 text-[13.5px] font-semibold text-white disabled:opacity-50"
                >
                    {isSubmitting ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد گروه تخفیف"}
                </button>
            </SheetContent>
        </Sheet>
    );
}
