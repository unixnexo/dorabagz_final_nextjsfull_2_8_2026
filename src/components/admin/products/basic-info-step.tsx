"use client";

import { FormField } from "./form-field";


type FlatCategory = { id: string; label: string };

export function BasicInfoStep({
    title,
    description,
    categoryId,
    flatCategories,
    onTitleChange,
    onDescriptionChange,
    onCategoryChange,
}: {
    title: string;
    description: string;
    categoryId: string;
    flatCategories: FlatCategory[];
    onTitleChange: (v: string) => void;
    onDescriptionChange: (v: string) => void;
    onCategoryChange: (v: string) => void;
}) {
    return (
        <div className="space-y-4 pt-4">
            <FormField label="عنوان محصول">
                <input
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="مثلاً روغن موتور توتال ۵ لیتری"
                    className="w-full rounded-2xl bg-white px-3.5 py-3 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                />
            </FormField>

            <FormField label="توضیحات" hint="اختیاری">
                <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    rows={5}
                    placeholder="توضیحات کامل محصول..."
                    className="w-full resize-none rounded-2xl bg-white px-3.5 py-3 text-[14px] leading-relaxed text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                />
            </FormField>

            <FormField label="دسته‌بندی">
                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <select
                        value={categoryId}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full bg-transparent px-3.5 py-3 text-[14px] text-[#1C1C1E] outline-none"
                    >
                        <option value="">بدون دسته</option>
                        {flatCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            </FormField>
        </div>
    );
}