// import Link from "next/link";
// import { ImageOff, ChevronLeft, RotateCcw, Trash2 } from "lucide-react";
// import type { ProductListItemDTO } from "@/types/product";

// export function ProductListCard({
//     product,
//     onToggleDeleted,
// }: {
//     product: ProductListItemDTO;
//     onToggleDeleted: () => void;
// }) {
//     const priceLabel =
//         product.minPrice === product.maxPrice
//             ? `${product.minPrice.toLocaleString("fa-IR")} تومن`
//             : `${product.minPrice.toLocaleString("fa-IR")} - ${product.maxPrice.toLocaleString("fa-IR")} تومن`;

//     return (
//         <div
//             className={
//                 "flex items-center gap-3 rounded-3xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] " +
//                 (product.isDeleted ? "opacity-55" : "")
//             }
//         >
//             <Link
//                 href={`/admin/products/${product.id}/edit`}
//                 className="flex min-w-0 flex-1 items-center gap-3"
//             >
//                 <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black/[0.05]">
//                     {product.mainImageUrl ? (
//                         // eslint-disable-next-line @next/next/no-img-element
//                         <img
//                             src={product.mainImageUrl}
//                             alt=""
//                             className="h-full w-full object-cover"
//                         />
//                     ) : (
//                         <ImageOff className="h-5 w-5 text-[#C7C7CC]" strokeWidth={2} />
//                     )}
//                 </div>

//                 <div className="min-w-0 flex-1">
//                     <div className="flex items-center gap-1.5">
//                         <p className="truncate text-[13.5px] font-semibold text-[#1C1C1E]">
//                             {product.title}
//                         </p>
//                         {product.isDeleted && (
//                             <span className="shrink-0 rounded-full bg-[#FF3B30]/12 px-2 py-0.5 text-[10px] font-semibold text-[#FF3B30]">
//                                 حذف شده
//                             </span>
//                         )}
//                     </div>

//                     <p className="mt-0.5 text-[12px] tabular-nums text-[#8E8E93]">
//                         {priceLabel}
//                     </p>

//                     <div className="mt-1 flex items-center gap-2 text-[10.5px] text-[#8E8E93]">
//                         <span>{product.categoryTitle ?? "بدون دسته"}</span>
//                         <span>·</span>
//                         <span>موجودی {product.totalStock.toLocaleString("fa-IR")}</span>
//                         {product.hasDiscount && (
//                             <>
//                                 <span>·</span>
//                                 <span className="font-medium text-[#FF3B30]">تخفیف‌دار</span>
//                             </>
//                         )}
//                     </div>
//                 </div>

//                 <ChevronLeft className="h-4 w-4 shrink-0 text-[#C7C7CC]" strokeWidth={2.25} />
//             </Link>

//             <button
//                 type="button"
//                 onClick={onToggleDeleted}
//                 aria-label={product.isDeleted ? "بازگردانی" : "حذف"}
//                 className={
//                     "flex h-8 w-8 shrink-0 items-center justify-center rounded-full " +
//                     (product.isDeleted
//                         ? "bg-[#0A7D5C]/10 active:bg-[#0A7D5C]/15"
//                         : "bg-[#FF3B30]/10 active:bg-[#FF3B30]/15")
//                 }
//             >
//                 {product.isDeleted ? (
//                     <RotateCcw className="h-3.5 w-3.5 text-[#0A7D5C]" strokeWidth={2.25} />
//                 ) : (
//                     <Trash2 className="h-3.5 w-3.5 text-[#FF3B30]" strokeWidth={2.25} />
//                 )}
//             </button>
//         </div>
//     );
// }







import Link from "next/link";
import { ImageOff, ChevronLeft, RotateCcw, Trash2, Pencil } from "lucide-react";
import type { ProductListItemDTO } from "@/types/product";

export function ProductListCard({
    product,
    onToggleDeleted,
}: {
    product: ProductListItemDTO;
    onToggleDeleted: () => void;
}) {
    const priceLabel =
        product.minPrice === product.maxPrice
            ? `${product.minPrice.toLocaleString("fa-IR")} تومن`
            : `${product.minPrice.toLocaleString("fa-IR")} - ${product.maxPrice.toLocaleString("fa-IR")} تومن`;

    return (
        <div
            className={
                "flex items-center gap-3 rounded-3xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] " +
                (product.isDeleted ? "opacity-55" : "")
            }
        >
            <Link
                href={`/admin/products/${product.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
            >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black/[0.05]">
                    {product.mainImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={product.mainImageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageOff className="h-5 w-5 text-[#C7C7CC]" strokeWidth={2} />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <p className="truncate text-[13.5px] font-semibold text-[#1C1C1E]">
                            {product.title}
                        </p>
                        {product.isDeleted && (
                            <span className="shrink-0 rounded-full bg-[#FF3B30]/12 px-2 py-0.5 text-[10px] font-semibold text-[#FF3B30]">
                                حذف شده
                            </span>
                        )}
                    </div>

                    <p className="mt-0.5 text-[12px] tabular-nums text-[#8E8E93]">
                        {priceLabel}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[10.5px] text-[#8E8E93]">
                        <span>{product.categoryTitle ?? "بدون دسته"}</span>
                        <span>·</span>
                        <span>موجودی {product.totalStock.toLocaleString("fa-IR")}</span>
                        {product.hasDiscount && (
                            <>
                                <span>·</span>
                                <span className="font-medium text-[#FF3B30]">تخفیف‌دار</span>
                            </>
                        )}
                    </div>
                </div>

                <ChevronLeft className="h-4 w-4 shrink-0 text-[#C7C7CC]" strokeWidth={2.25} />
            </Link>

            <Link
                href={`/admin/products/${product.id}/edit`}
                aria-label="ویرایش"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.05] active:bg-black/[0.08]"
            >
                <Pencil className="h-3.5 w-3.5 text-[#1C1C1E]" strokeWidth={2.25} />
            </Link>


            <button
                type="button"
                onClick={onToggleDeleted}
                aria-label={product.isDeleted ? "بازگردانی" : "حذف"}
                className={
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full " +
                    (product.isDeleted
                        ? "bg-[#0A7D5C]/10 active:bg-[#0A7D5C]/15"
                        : "bg-[#FF3B30]/10 active:bg-[#FF3B30]/15")
                }
            >
                {product.isDeleted ? (
                    <RotateCcw className="h-3.5 w-3.5 text-[#0A7D5C]" strokeWidth={2.25} />
                ) : (
                    <Trash2 className="h-3.5 w-3.5 text-[#FF3B30]" strokeWidth={2.25} />
                )}
            </button>
        </div>
    );
}

