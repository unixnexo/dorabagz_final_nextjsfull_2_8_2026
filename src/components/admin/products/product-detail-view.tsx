"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { ProductDetailDTO } from "@/types/product";
import { setProductDeletedAction } from "@/server/product/actions";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductVariantsSection } from "./product-variants-section";
import { ProductSpecsSection } from "./product-specs-section";

export function ProductDetailView({ product }: { product: ProductDetailDTO }) {
    const router = useRouter();
    const [isToggling, setIsToggling] = useState(false);

    const priceLabel =
        product.variants.length === 0
            ? null
            : (() => {
                const prices = product.variants.map((v) => v.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                return min === max
                    ? `${min.toLocaleString("fa-IR")} تومن`
                    : `${min.toLocaleString("fa-IR")} - ${max.toLocaleString("fa-IR")} تومن`;
            })();

    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

    async function handleToggleDeleted() {
        setIsToggling(true);
        const result = await setProductDeletedAction(product.id, !product.isDeleted);
        setIsToggling(false);
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        toast.success(product.isDeleted ? "محصول بازگردانی شد" : "محصول حذف شد");
        router.refresh();
    }

    return (
        <div className="mt-4 space-y-4">
            <ProductImageGallery images={product.images} title={product.title} />

            <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h2 className="truncate text-[16px] font-bold text-[#1C1C1E]">
                                {product.title}
                            </h2>
                            {product.isDeleted && (
                                <span className="shrink-0 rounded-full bg-[#FF3B30]/12 px-2 py-0.5 text-[10px] font-semibold text-[#FF3B30]">
                                    حذف شده
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-[11.5px] text-[#8E8E93]">
                            کد محصول: {product.productCode}
                        </p>
                    </div>

                    <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex shrink-0 items-center gap-1.5 rounded-full bg-black px-3.5 py-2 text-[12.5px] font-semibold text-white active:bg-black/85"
                    >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
                        ویرایش
                    </Link>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-black/[0.04] px-3 py-2.5 text-center">
                        <p className="text-[10.5px] font-medium text-[#8E8E93]">قیمت</p>
                        <p className="mt-0.5 truncate text-[12.5px] font-semibold tabular-nums text-[#1C1C1E]">
                            {priceLabel ?? "—"}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-black/[0.04] px-3 py-2.5 text-center">
                        <p className="text-[10.5px] font-medium text-[#8E8E93]">موجودی کل</p>
                        <p className="mt-0.5 text-[12.5px] font-semibold tabular-nums text-[#1C1C1E]">
                            {totalStock.toLocaleString("fa-IR")}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-black/[0.04] px-3 py-2.5 text-center">
                        <p className="text-[10.5px] font-medium text-[#8E8E93]">دسته‌بندی</p>
                        <p className="mt-0.5 truncate text-[12.5px] font-semibold text-[#1C1C1E]">
                            {product.categoryTitle ?? "—"}
                        </p>
                    </div>
                </div>
            </div>

            {product.description && (
                <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <p className="mb-2 text-[12.5px] font-semibold text-[#1C1C1E]">توضیحات</p>
                    <p className="whitespace-pre-wrap text-[13px] leading-6 text-[#3A3A3C]">
                        {product.description}
                    </p>
                </div>
            )}

            <ProductVariantsSection variants={product.variants} options={product.options} />

            <ProductSpecsSection specifications={product.specifications} />

            <button
                type="button"
                onClick={handleToggleDeleted}
                disabled={isToggling}
                className={
                    "flex w-full items-center justify-center gap-1.5 rounded-2xl py-3 text-[13px] font-medium disabled:opacity-50 " +
                    (product.isDeleted
                        ? "bg-brand-primary/10 text-brand-primary active:bg-brand-primary/15"
                        : "bg-[#FF3B30]/10 text-[#FF3B30] active:bg-[#FF3B30]/15")
                }
            >
                {product.isDeleted ? (
                    <>
                        <RotateCcw className="h-4 w-4" strokeWidth={2.25} />
                        بازگردانی محصول
                    </>
                ) : (
                    <>
                        <Trash2 className="h-4 w-4" strokeWidth={2.25} />
                        حذف محصول
                    </>
                )}
            </button>
        </div>
    );
}