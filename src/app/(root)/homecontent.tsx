// "use client";

// import { useState } from "react";
// import { BottomNav } from "@/components/bottom-nav";
// import { SearchCommand } from "@/components/search-command";
// import type { ProductListItemDTO } from "@/types/product";
// import type { CategoryTreeDTO } from "@/types/category";
// import { X } from "lucide-react";
// import { HomeHeader } from "./home-header";
// import { Stories } from "./stories";
// import { CategoryBar } from "./category-bar";
// import { ProductCard } from "./product-card";
// import { useProductFilters, hasActiveFilters } from "@/lib/use-product-filters";
// import type { PaginatedResult } from "@/types/user";

// type HomeContentProps = {
//     products: PaginatedResult<ProductListItemDTO>;
//     categories: CategoryTreeDTO[];
//     isAdmin: boolean;
// };

// export default function HomeContent({ products, categories, isAdmin }: HomeContentProps) {
//     const [searchOpen, setSearchOpen] = useState(false);
//     const { filters, applyFilters, clearFilters } = useProductFilters();

//     const filtersActive = hasActiveFilters(filters);
//     const items = products.items;

//     return (
//         <main className="min-h-dvh pt-[88px] text-[#171717]">
//             <div className="min-h-dvg w-full overflow-hidden">
//                 {/* Header */}
//                 <HomeHeader isAdmin={isAdmin} />

//                 {/* Main content */}
//                 <div className="relative z-30 rounded-t-[32px] bg-[#f1f2f3] px-4 pb-32 pt-5 min-h-dvh">
//                     {/* Stories */}
//                     <section className="mb-6">
//                         <Stories />
//                     </section>

//                     {/* Categories */}
//                     <CategoryBar categories={categories} />

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

// type HomeContentProps = {
//     products: PaginatedResult<ProductListItemDTO>;
//     categories: CategoryTreeDTO[];
//     isAdmin: boolean;
//     isLoggedIn: boolean;
//     initialCartCount?: number;
// };

// export default function HomeContent({ products, categories, isAdmin, isLoggedIn, initialCartCount }: HomeContentProps) {

type HomeContentProps = {
    products: PaginatedResult<ProductListItemDTO>;
    categories: CategoryTreeDTO[];
    isAdmin: boolean;
    isLoggedIn: boolean;
    initialCartCount?: number;
    initialUnreadCount?: number;
};

export default function HomeContent({ products, categories, isAdmin, isLoggedIn, initialCartCount, initialUnreadCount }: HomeContentProps) {

    const [searchOpen, setSearchOpen] = useState(false);
    const { filters, applyFilters, clearFilters } = useProductFilters();

    const filtersActive = hasActiveFilters(filters);
    const items = products.items;

    return (
        <main className="min-h-dvh pt-[88px] text-[#171717]">
            <div className="min-h-dvg w-full overflow-hidden">
                {/* Header */}
                {/* <HomeHeader isAdmin={isAdmin} /> */}
                <HomeHeader isAdmin={isAdmin} isLoggedIn={isLoggedIn} initialUnreadCount={initialUnreadCount} />

                {/* Main content */}
                <div className="relative z-30 rounded-t-[32px] bg-brand-secondary px-4 pb-32 pt-5 min-h-dvh">
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
                                className="flex items-start gap-1 text-[13px] font-medium text-[#c0392b]"
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
                isLoggedIn={isLoggedIn}
                initialCartCount={initialCartCount}
            />
        </main>
    );
}


