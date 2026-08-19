export type ImageItem = { url: string; isMain: boolean; sortOrder: number };
export type SpecItem = { key: string; value: string; sortOrder: number };
export type OptionItem = { name: string; values: string[] };
export type VariantItem = {
    price: number;
    stock: number;
    optionValues: Record<string, string>;
};

export const FORM_STEPS = [
    { key: "basic", label: "اطلاعات پایه" },
    { key: "media", label: "تصاویر و ویدیو" },
    { key: "specs", label: "مشخصات فنی" },
    { key: "options", label: "گزینه‌ها" },
    { key: "pricing", label: "قیمت و موجودی" },
] as const;

export type FormStepKey = (typeof FORM_STEPS)[number]["key"];