"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { createCouponAction, updateCouponAction } from "@/server/coupon/actions";
import type { CouponDTO, CouponType, CouponScope } from "@/types/coupon";
import { SegmentedControl } from "./segmented-control";
import { FormField, TextInput } from "./form-field";
import { CouponProductPicker } from "./coupon-product-picker";
import { CouponCategoryPicker } from "./coupon-category-picker";
import { CouponUserPicker } from "./coupon-user-picker";
import { JalaliDatePicker } from "./jalali-date-picker";
import toast from "react-hot-toast";
import { FormattedNumberInput } from "@/components/formatted-number-input";

function randomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

export function CouponFormSheet({
    open,
    onOpenChange,
    editing,
    onDone,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: CouponDTO | null;
    onDone: () => void;
}) {
    const [code, setCode] = useState("");
    const [type, setType] = useState<CouponType>("PERCENT");
    const [value, setValue] = useState(10);
    const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | "">("");
    const [scope, setScope] = useState<CouponScope>("ENTIRE_CART");
    const [productIds, setProductIds] = useState<string[]>([]);
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [minOrderAmount, setMinOrderAmount] = useState<number | "">("");
    const [maxUsesPerUser, setMaxUsesPerUser] = useState(1);
    const [maxTotalUsage, setMaxTotalUsage] = useState<number | "">("");
    const [assignedUserId, setAssignedUserId] = useState<string | null>(null);
    const [assignedUserPhone, setAssignedUserPhone] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset (or hydrate for edit) every time the sheet opens.
    useEffect(() => {
        if (!open) return;
        setCode(editing?.code ?? "");
        setType(editing?.type ?? "PERCENT");
        setValue(editing?.value ?? 10);
        setMaxDiscountAmount(editing?.maxDiscountAmount ?? "");
        setScope(editing?.scope ?? "ENTIRE_CART");
        setProductIds(editing?.productIds ?? []);
        setCategoryIds(editing?.categoryIds ?? []);
        setMinOrderAmount(editing?.minOrderAmount ?? "");
        setMaxUsesPerUser(editing?.maxUsesPerUser ?? 1);
        setMaxTotalUsage(editing?.maxTotalUsage ?? "");
        setAssignedUserId(editing?.assignedUserId ?? null);
        setAssignedUserPhone(editing?.assignedUserPhone ?? null);
        // setExpiresAt(editing ? new Date(editing.expiresAt).toISOString().slice(0, 16) : "");
        setExpiresAt(editing ? editing.expiresAt : "");
        setError(null);
    }, [open, editing]);

    async function handleSubmit() {
        setError(null);

        if (!expiresAt) {
            setError("لطفاً تاریخ انقضا را مشخص کنید.");
            return;
        }
        if (scope === "SPECIFIC_PRODUCTS" && productIds.length === 0) {
            setError("حداقل یک محصول انتخاب کنید.");
            return;
        }
        if (scope === "SPECIFIC_CATEGORIES" && categoryIds.length === 0) {
            setError("حداقل یک دسته‌بندی انتخاب کنید.");
            return;
        }

        setIsSubmitting(true);
        const payload = {
            code: code.trim() || undefined,
            type,
            value,
            maxDiscountAmount: type === "PERCENT" && maxDiscountAmount !== "" ? Number(maxDiscountAmount) : null,
            scope,
            productIds: scope === "SPECIFIC_PRODUCTS" ? productIds : [],
            categoryIds: scope === "SPECIFIC_CATEGORIES" ? categoryIds : [],
            minOrderAmount: minOrderAmount !== "" ? Number(minOrderAmount) : null,
            maxUsesPerUser,
            maxTotalUsage: maxTotalUsage !== "" ? Number(maxTotalUsage) : null,
            assignedUserId,
            expiresAt: new Date(expiresAt).toISOString(),
        };

        const result = editing
            ? await updateCouponAction({ id: editing.id, ...payload })
            : await createCouponAction(payload);
        setIsSubmitting(false);

        // if (!result.success) {
        //     setError(result.error);
        //     return;
        // }
        // onDone();
        if (!result.success) {
            setError(result.error);
            return;
        }

        toast.success(
            editing ? "کد تخفیف ویرایش شد" : "کد تخفیف ایجاد شد"
        );

        onDone();
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl px-4 pb-6 pt-4">
                <SheetHeader className="mb-4 text-right">
                    <SheetTitle className="text-[15px] font-semibold text-[#1C1C1E]">
                        {editing ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}
                    </SheetTitle>
                </SheetHeader>

                <div className="space-y-4">
                    <FormField label="کد تخفیف (اختیاری — در صورت خالی بودن خودکار تولید می‌شود)">
                        <div className="flex items-center gap-2">
                            <TextInput
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="مثلاً SUMMER20"
                                className="flex-1 font-mono tracking-wide"
                            />
                            <button
                                type="button"
                                onClick={() => setCode(randomCode())}
                                aria-label="تولید کد تصادفی"
                                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-2xl bg-black/[0.05] active:bg-black/[0.08]"
                            >
                                <RefreshCw className="h-4 w-4 text-[#1C1C1E]" strokeWidth={2.25} />
                            </button>
                        </div>
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
                        {/* <TextInput
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={type === "PERCENT" ? 100 : undefined}
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value) || 0)}
                        /> */}
                        {type === "PERCENT" ? (
                            <TextInput
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={100}
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value) || 0)}
                            />
                        ) : (
                            <FormattedNumberInput
                                min={1}
                                value={value}
                                onChange={(value) => setValue(value === "" ? 0 : value)}
                            />
                        )}
                    </FormField>

                    {type === "PERCENT" && (
                        <FormField label="حداکثر مبلغ تخفیف (تومان، اختیاری)">
                            {/* <TextInput
                                type="number"
                                inputMode="numeric"
                                value={maxDiscountAmount}
                                onChange={(e) => setMaxDiscountAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="بدون سقف"
                            /> */}
                            <FormattedNumberInput
                                value={maxDiscountAmount}
                                onChange={setMaxDiscountAmount}
                                placeholder="بدون سقف"
                            />
                        </FormField>
                    )}

                    <FormField label="محدوده تخفیف">
                        <SegmentedControl
                            value={scope}
                            onChange={setScope}
                            options={[
                                { value: "ENTIRE_CART", label: "کل سبد" },
                                { value: "SPECIFIC_PRODUCTS", label: "محصولات" },
                                { value: "SPECIFIC_CATEGORIES", label: "دسته‌بندی‌ها" },
                            ]}
                        />
                    </FormField>

                    {scope === "SPECIFIC_PRODUCTS" && (
                        <CouponProductPicker selectedIds={productIds} onChange={setProductIds} />
                    )}

                    {scope === "SPECIFIC_CATEGORIES" && (
                        <CouponCategoryPicker selectedIds={categoryIds} onChange={setCategoryIds} />
                    )}

                    <FormField label="حداقل مبلغ سفارش (تومان، اختیاری)">
                        {/* <TextInput
                            type="number"
                            inputMode="numeric"
                            value={minOrderAmount}
                            onChange={(e) => setMinOrderAmount(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="بدون حداقل"
                        /> */}
                        <FormattedNumberInput
                            value={minOrderAmount}
                            onChange={setMinOrderAmount}
                            placeholder="بدون حداقل"
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-2.5">
                        <FormField label="حداکثر استفاده هر کاربر">
                            {/* <TextInput
                                type="number"
                                inputMode="numeric"
                                min={1}
                                value={maxUsesPerUser}
                                onChange={(e) => setMaxUsesPerUser(Number(e.target.value) || 1)}
                            /> */}
                            <FormattedNumberInput
                                min={1}
                                value={maxUsesPerUser}
                                onChange={(value) =>
                                    setMaxUsesPerUser(value === "" ? 1 : value)
                                }
                            />
                        </FormField>

                        <FormField label="سقف کل استفاده (اختیاری)">
                            {/* <TextInput
                                type="number"
                                inputMode="numeric"
                                value={maxTotalUsage}
                                onChange={(e) => setMaxTotalUsage(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="نامحدود"
                            /> */}
                            <FormattedNumberInput
                                value={maxTotalUsage}
                                onChange={setMaxTotalUsage}
                                placeholder="نامحدود"
                            />
                        </FormField>
                    </div>

                    <CouponUserPicker
                        selectedUserId={assignedUserId}
                        selectedUserPhone={assignedUserPhone}
                        onChange={(id, phone) => {
                            setAssignedUserId(id);
                            setAssignedUserPhone(phone);
                        }}
                    />

                    {/* <FormField label="تاریخ و ساعت انقضا">
                        <TextInput
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />
                    </FormField> */}

                    <FormField label="تاریخ و ساعت انقضا">
                        <JalaliDatePicker
                            value={expiresAt}
                            onChange={(iso) => setExpiresAt(iso)}
                        />
                    </FormField>
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
                    {isSubmitting ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد کد تخفیف"}
                </button>
            </SheetContent>
        </Sheet>
    );
}
