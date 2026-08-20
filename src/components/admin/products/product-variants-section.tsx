import type { ProductOptionDTO, ProductVariantDTO } from "@/types/product";

export function ProductVariantsSection({
    variants,
    options,
}: {
    variants: ProductVariantDTO[];
    options: ProductOptionDTO[];
}) {
    return (
        <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-[12.5px] font-semibold text-[#1C1C1E]">
                    ترکیب‌ها و موجودی
                </p>
                {variants.length > 0 && (
                    <span className="text-[11px] text-[#8E8E93]">
                        {variants.length.toLocaleString("fa-IR")} ترکیب
                    </span>
                )}
            </div>

            {options.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                    {options.map((opt) => (
                        <span
                            key={opt.id}
                            className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] text-[#3A3A3C]"
                        >
                            {opt.name}: {opt.values.map((v) => v.value).join("، ")}
                        </span>
                    ))}
                </div>
            )}

            {variants.length === 0 ? (
                <p className="rounded-2xl bg-[#FF9500]/10 px-3.5 py-2.5 text-[12px] font-medium text-[#B25E00]">
                    هیچ ترکیبی برای این محصول ثبت نشده
                </p>
            ) : (
                <div className="space-y-2">
                    {variants.map((variant) => {
                        const label =
                            Object.keys(variant.optionValues).length === 0
                                ? "تک نوع (بدون گزینه)"
                                : Object.entries(variant.optionValues)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(" / ");
                        const isOutOfStock = variant.stock === 0;

                        return (
                            <div
                                key={variant.id}
                                className="flex items-center gap-2 rounded-2xl bg-black/[0.03] px-3.5 py-2.5"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[12.5px] font-medium text-[#1C1C1E]">
                                        {label}
                                    </p>
                                    <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px]">
                                        {variant.hasDiscount ? (
                                            <>
                                                <span className="tabular-nums text-[#8E8E93] line-through">
                                                    {variant.price.toLocaleString("fa-IR")}
                                                </span>
                                                <span className="font-semibold tabular-nums text-[#FF3B30]">
                                                    {variant.discountedPrice.toLocaleString("fa-IR")} تومان
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-semibold tabular-nums text-[#1C1C1E]">
                                                {variant.price.toLocaleString("fa-IR")} تومان
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <span
                                    className={
                                        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums " +
                                        (isOutOfStock
                                            ? "bg-[#FF3B30]/10 text-[#FF3B30]"
                                            : "bg-[#0A7D5C]/10 text-[#0A7D5C]")
                                    }
                                >
                                    {isOutOfStock
                                        ? "ناموجود"
                                        : `موجودی ${variant.stock.toLocaleString("fa-IR")}`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}