// "use client";

// import { useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { X } from "lucide-react";
// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
// } from "@/components/ui/sheet";
// import { adminListProductsAction } from "@/server/product/actions";

// export function StoryProductPicker({
//     selectedIds,
//     onChange,
// }: {
//     selectedIds: string[];
//     onChange: (ids: string[]) => void;
// }) {
//     const [pickerOpen, setPickerOpen] = useState(false);
//     const [search, setSearch] = useState("");

//     const { data: products } = useQuery({
//         queryKey: ["admin-products-for-story"],
//         queryFn: async () => {
//             const result = await adminListProductsAction({ page: 1, pageSize: 200 });
//             return result.success ? result.data.items : [];
//         },
//         enabled: pickerOpen, // only fetch once the picker is actually opened
//     });

//     const selectedProducts = useMemo(
//         () => (products ?? []).filter((p) => selectedIds.includes(p.id)),
//         [products, selectedIds]
//     );

//     const filtered = useMemo(() => {
//         if (!products) return [];
//         if (!search.trim()) return products;
//         return products.filter((p) => p.title.includes(search.trim()));
//     }, [products, search]);

//     function toggle(id: string) {
//         onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
//     }

//     return (
//         <div>
//             <label className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]">
//                 محصولات مرتبط (اختیاری)
//             </label>

//             <button
//                 type="button"
//                 onClick={() => setPickerOpen(true)}
//                 className="w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-right text-[13px] text-[#1C1C1E]"
//             >
//                 {selectedIds.length === 0 ? (
//                     <span className="text-[#C7C7CC]">انتخاب محصول...</span>
//                 ) : (
//                     `${selectedIds.length.toLocaleString("fa-IR")} محصول انتخاب شده`
//                 )}
//             </button>

//             {selectedProducts.length > 0 && (
//                 <div className="mt-2 flex flex-wrap gap-1.5">
//                     {selectedProducts.map((p) => (
//                         <span
//                             key={p.id}
//                             className="flex items-center gap-1 rounded-full bg-black/[0.05] py-1 pl-1 pr-2.5 text-[11.5px] text-[#1C1C1E]"
//                         >
//                             {p.title}
//                             <button
//                                 type="button"
//                                 onClick={() => toggle(p.id)}
//                                 aria-label="حذف"
//                                 className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10"
//                             >
//                                 <X className="h-2.5 w-2.5" strokeWidth={2.5} />
//                             </button>
//                         </span>
//                     ))}
//                 </div>
//             )}

//             <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
//                 <SheetContent side="bottom" className="max-h-[80vh] rounded-t-3xl px-4 pb-6 pt-4">
//                     <SheetHeader className="mb-3 text-right">
//                         <SheetTitle className="text-[15px] font-semibold text-[#1C1C1E]">
//                             انتخاب محصولات
//                         </SheetTitle>
//                     </SheetHeader>

//                     <input
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="جستجوی محصول..."
//                         className="mb-3 w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-[13px] text-[#1C1C1E] outline-none placeholder:text-[#C7C7CC]"
//                     />

//                     <div className="max-h-[55vh] space-y-1.5 overflow-y-auto">
//                         {filtered.map((p) => {
//                             const isSelected = selectedIds.includes(p.id);
//                             return (
//                                 <button
//                                     key={p.id}
//                                     type="button"
//                                     onClick={() => toggle(p.id)}
//                                     className={
//                                         "flex w-full items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-right text-[13px] " +
//                                         (isSelected ? "bg-black text-white" : "bg-black/[0.04] text-[#1C1C1E]")
//                                     }
//                                 >
//                                     <span className="truncate">{p.title}</span>
//                                     {isSelected && <span className="shrink-0 text-[11px]">انتخاب شد</span>}
//                                 </button>
//                             );
//                         })}

//                         {products && filtered.length === 0 && (
//                             <p className="py-6 text-center text-[12.5px] text-[#8E8E93]">
//                                 محصولی پیدا نشد
//                             </p>
//                         )}
//                     </div>

//                     <button
//                         type="button"
//                         onClick={() => setPickerOpen(false)}
//                         className="mt-4 w-full rounded-2xl bg-black py-3 text-[13.5px] font-semibold text-white"
//                     >
//                         تایید
//                     </button>
//                 </SheetContent>
//             </Sheet>
//         </div>
//     );
// }



"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { adminListProductsAction } from "@/server/product/actions";

export function StoryProductPicker({
    selectedIds,
    onChange,
}: {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ["admin-products-for-story"],
        queryFn: async () => {
            const result = await adminListProductsAction({ page: 1, pageSize: 200 });
            if (!result.success) throw new Error(result.error);
            return result.data.items;
        },
        enabled: pickerOpen, // only fetch once the picker is actually opened
    });

    const selectedProducts = useMemo(
        () => (products ?? []).filter((p) => selectedIds.includes(p.id)),
        [products, selectedIds]
    );

    const filtered = useMemo(() => {
        if (!products) return [];
        if (!search.trim()) return products;
        return products.filter((p) => p.title.includes(search.trim()));
    }, [products, search]);

    function toggle(id: string) {
        onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
    }

    return (
        <div>
            <label className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]">
                محصولات مرتبط (اختیاری)
            </label>

            <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-right text-[13px] text-[#1C1C1E]"
            >
                {selectedIds.length === 0 ? (
                    <span className="text-[#C7C7CC]">انتخاب محصول...</span>
                ) : (
                    `${selectedIds.length.toLocaleString("fa-IR")} محصول انتخاب شده`
                )}
            </button>

            {selectedProducts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedProducts.map((p) => (
                        <span
                            key={p.id}
                            className="flex items-center gap-1 rounded-full bg-black/[0.05] py-1 pl-1 pr-2.5 text-[11.5px] text-[#1C1C1E]"
                        >
                            {p.title}
                            <button
                                type="button"
                                onClick={() => toggle(p.id)}
                                aria-label="حذف"
                                className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10"
                            >
                                <X className="h-2.5 w-2.5" strokeWidth={2.5} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
                <SheetContent side="bottom" className="max-h-[80vh] rounded-t-3xl px-4 pb-6 pt-4">
                    <SheetHeader className="mb-3 text-right">
                        <SheetTitle className="text-[15px] font-semibold text-[#1C1C1E]">
                            انتخاب محصولات
                        </SheetTitle>
                    </SheetHeader>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="جستجوی محصول..."
                        className="mb-3 w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-[13px] text-[#1C1C1E] outline-none placeholder:text-[#C7C7CC]"
                    />

                    <div className="max-h-[55vh] space-y-1.5 overflow-y-auto">
                        {isLoading && (
                            <div className="space-y-1.5">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="h-[42px] animate-pulse rounded-2xl bg-black/[0.04]" />
                                ))}
                            </div>
                        )}

                        {isError && (
                            <p className="py-6 text-center text-[12.5px] font-medium text-[#FF3B30]">
                                خطا در دریافت محصولات
                            </p>
                        )}

                        {!isLoading && !isError && filtered.map((p) => {
                            const isSelected = selectedIds.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => toggle(p.id)}
                                    className={
                                        "flex w-full items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-right text-[13px] " +
                                        (isSelected ? "bg-black text-white" : "bg-black/[0.04] text-[#1C1C1E]")
                                    }
                                >
                                    <span className="truncate">{p.title}</span>
                                    {isSelected && <span className="shrink-0 text-[11px]">انتخاب شد</span>}
                                </button>
                            );
                        })}

                        {!isLoading && !isError && products && filtered.length === 0 && (
                            <p className="py-6 text-center text-[12.5px] text-[#8E8E93]">
                                محصولی پیدا نشد
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setPickerOpen(false)}
                        className="mt-4 w-full rounded-2xl bg-black py-3 text-[13.5px] font-semibold text-white"
                    >
                        تایید
                    </button>
                </SheetContent>
            </Sheet>
        </div>
    );
}
