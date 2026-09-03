// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { BottomNav } from "@/components/bottom-nav";
// import { SearchCommand } from "@/components/search-command";
// import type { ProductListItemDTO } from "@/types/product";
// import type { CategoryTreeDTO } from "@/types/category";
// import { Shirt, X } from "lucide-react";
// import { HomeHeader } from "./home-header";
// import { Stories } from "./stories";
// import { ProductCard } from "./product-card";
// import { useProductFilters, hasActiveFilters } from "@/lib/use-product-filters";
// import type { PaginatedResult } from "@/types/user";

// type HomeContentProps = {
//     products: PaginatedResult<ProductListItemDTO>;
//     categories: CategoryTreeDTO[];
//     isAdmin: boolean;
// };

// export default function HomeContent({ products, categories, isAdmin }: HomeContentProps) {
//     const categoriesRef = useRef<HTMLDivElement>(null);
//     const [searchOpen, setSearchOpen] = useState(false);
//     const { filters, applyFilters, clearFilters } = useProductFilters();

//     useEffect(() => {
//         const el = categoriesRef.current;

//         if (!el || el.scrollWidth <= el.clientWidth) return;

//         const timer = setTimeout(() => {
//             const start = el.scrollLeft;
//             const distance = -50;
//             const duration = 1100;
//             const startTime = performance.now();

//             const easeInOut = (t: number) =>
//                 t < 0.5
//                     ? 4 * t * t * t
//                     : 1 - Math.pow(-2 * t + 2, 3) / 2;

//             const animate = (currentTime: number) => {
//                 const elapsed = currentTime - startTime;
//                 const progress = Math.min(elapsed / duration, 1);
//                 const eased = easeInOut(progress);

//                 el.scrollLeft = start + distance * eased;

//                 if (progress < 1) {
//                     requestAnimationFrame(animate);
//                 } else {
//                     setTimeout(() => {
//                         const returnStart = el.scrollLeft;
//                         const returnTime = performance.now();

//                         const animateBack = (time: number) => {
//                             const elapsedBack = time - returnTime;
//                             const progressBack = Math.min(
//                                 elapsedBack / duration,
//                                 1
//                             );
//                             const easedBack = easeInOut(progressBack);

//                             el.scrollLeft =
//                                 returnStart + (start - returnStart) * easedBack;

//                             if (progressBack < 1) {
//                                 requestAnimationFrame(animateBack);
//                             }
//                         };

//                         requestAnimationFrame(animateBack);
//                     }, 300);
//                 }
//             };

//             requestAnimationFrame(animate);
//         }, 800);

//         return () => clearTimeout(timer);
//     }, []);

//     const filtersActive = hasActiveFilters(filters);
//     const items = products.items;

//     return (
//         <main className="min-h-screen pt-[88px] text-[#171717]">
//             <div className="min-h-screen w-full overflow-hidden">
//                 {/* Header */}
//                 <HomeHeader isAdmin={isAdmin} />

//                 {/* Main content */}
//                 <div className="relative z-30 rounded-t-[32px] bg-[#f1f2f3] px-4 pb-10 pt-5">
//                     {/* Stories */}
//                     <section className="mb-6">
//                         <Stories />
//                     </section>

//                     {/* Categories */}
//                     <div className="relative -mx-4">
//                         {/* Left fade */}
//                         <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#f1f2f3] to-transparent rounded-t-lg" />

//                         {/* Right fade */}
//                         <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#f1f2f3] to-transparent rounded-t-lg" />

//                         <div
//                             ref={categoriesRef}
//                             className="flex gap-2.5 overflow-x-auto px-4 scrollbar-none"
//                             dir="rtl"
//                         >
//                             {categories.map((category) => {
//                                 const isActive = filters.categoryId === category.id;
//                                 return (
//                                     <button
//                                         key={category.id}
//                                         onClick={() =>
//                                             applyFilters({
//                                                 categoryId: isActive ? undefined : category.id,
//                                             })
//                                         }
//                                         className="group flex w-[calc((100vw-57.5px)/4)] min-w-[calc((100vw-57.5px)/4)] max-w-[120px] flex-col items-center"
//                                     >
//                                         <Card
//                                             className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-[22px] border-0 shadow-none transition-transform group-active:scale-95 ${isActive ? "bg-black" : "bg-white"
//                                                 }`}
//                                         >
//                                             <Shirt
//                                                 className={`h-[38%] w-[38%] ${isActive ? "text-white" : "text-black/30"
//                                                     }`}
//                                                 strokeWidth={1.5}
//                                             />
//                                         </Card>

//                                         <span className="mt-2 w-full truncate text-center text-[13px] font-medium">
//                                             {category.title}
//                                         </span>
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* Active search/filter bar */}
//                     {filtersActive && (
//                         <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3">
//                             <p className="text-[13px] text-black/60">
//                                 {filters.search ? (
//                                     <>
//                                         نتایج جستجو برای{" "}
//                                         <span className="font-semibold text-black">
//                                             «{filters.search}»
//                                         </span>
//                                     </>
//                                 ) : (
//                                     <>نتایج فیلتر شده</>
//                                 )}
//                                 {" · "}
//                                 {products.totalItems.toLocaleString("en-US")} محصول
//                             </p>

//                             <button
//                                 type="button"
//                                 onClick={clearFilters}
//                                 className="flex items-center gap-1 text-[13px] font-medium text-[#c0392b]"
//                             >
//                                 <X className="size-4" />
//                                 حذف
//                             </button>
//                         </div>
//                     )}

//                     {/* Products */}
//                     <section className="mt-7">
//                         {items.length === 0 ? (
//                             <p className="py-10 text-center text-sm text-muted-foreground">
//                                 محصولی یافت نشد.
//                             </p>
//                         ) : (
//                             <>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     {items.map((product) => (
//                                         <ProductCard key={product.id} product={product} />
//                                     ))}
//                                 </div>

//                                 {products.totalPages > 1 && (
//                                     <div className="mt-8 flex items-center justify-center gap-2">
//                                         {Array.from({ length: products.totalPages }, (_, i) => i + 1).map(
//                                             (pageNum) => (
//                                                 <button
//                                                     key={pageNum}
//                                                     type="button"
//                                                     onClick={() => {
//                                                         applyFilters({ page: pageNum });
//                                                         window.scrollTo({ top: 0, behavior: "smooth" });
//                                                     }}
//                                                     className={`flex size-9 items-center justify-center rounded-full text-[13px] font-medium transition-colors ${pageNum === products.page
//                                                         ? "bg-black text-white"
//                                                         : "bg-white text-black/60"
//                                                         }`}
//                                                 >
//                                                     {pageNum}
//                                                 </button>
//                                             )
//                                         )}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </section>
//                 </div>
//             </div>

//             <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

//             <BottomNav
//                 searchOpen={searchOpen}
//                 onSearchClick={() => setSearchOpen(true)}
//             />
//         </main>
//     );
// }






"use client";

import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { SearchCommand } from "@/components/search-command";
import type { ProductListItemDTO } from "@/types/product";
import type { CategoryTreeDTO } from "@/types/category";
import { X } from "lucide-react";
import { HomeHeader } from "./home-header";
import { Stories } from "./stories";
import { CategoryBar } from "./category-bar";
import { ProductCard } from "./product-card";
import { useProductFilters, hasActiveFilters } from "@/lib/use-product-filters";
import type { PaginatedResult } from "@/types/user";

type HomeContentProps = {
    products: PaginatedResult<ProductListItemDTO>;
    categories: CategoryTreeDTO[];
    isAdmin: boolean;
};

export default function HomeContent({ products, categories, isAdmin }: HomeContentProps) {
    const [searchOpen, setSearchOpen] = useState(false);
    const { filters, applyFilters, clearFilters } = useProductFilters();

    const filtersActive = hasActiveFilters(filters);
    const items = products.items;

    return (
        <main className="min-h-dvh pt-[88px] text-[#171717]">
            <div className="min-h-dvg w-full overflow-hidden">
                {/* Header */}
                <HomeHeader isAdmin={isAdmin} />

                {/* Main content */}
                <div className="relative z-30 rounded-t-[32px] bg-[#f1f2f3] px-4 pb-10 pt-5 min-h-dvh">
                    {/* Stories */}
                    <section className="mb-6">
                        <Stories />
                    </section>

                    {/* Categories */}
                    <CategoryBar categories={categories} />

                    {/* Active search/filter bar */}
                    {filtersActive && (
                        <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                            <p className="text-[13px] text-black/60">
                                {filters.search ? (
                                    <>
                                        نتایج جستجو برای{" "}
                                        <span className="font-semibold text-black">
                                            «{filters.search}»
                                        </span>
                                    </>
                                ) : (
                                    <>نتایج فیلتر شده</>
                                )}
                                {" · "}
                                {products.totalItems.toLocaleString("en-US")} محصول
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-[13px] font-medium text-[#c0392b]"
                            >
                                <X className="size-4" />
                                حذف
                            </button>
                        </div>
                    )}

                    {/* Products */}
                    <section className="mt-7">
                        {items.length === 0 ? (
                            <p className="py-10 text-center text-sm text-muted-foreground">
                                محصولی یافت نشد.
                            </p>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    {items.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {products.totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        {Array.from({ length: products.totalPages }, (_, i) => i + 1).map(
                                            (pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    type="button"
                                                    onClick={() => {
                                                        applyFilters({ page: pageNum });
                                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                                    }}
                                                    className={`flex size-9 items-center justify-center rounded-full text-[13px] font-medium transition-colors ${pageNum === products.page
                                                        ? "bg-black text-white"
                                                        : "bg-white text-black/60"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </div>

            <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

            <BottomNav
                searchOpen={searchOpen}
                onSearchClick={() => setSearchOpen(true)}
            />
        </main>
    );
}

