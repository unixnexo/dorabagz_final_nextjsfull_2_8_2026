"use client";

import { ProductCard } from "@/components/product-card";
import { BottomNav } from "@/components/bottom-nav";
import { SearchCommand } from "@/components/search-command";
import { useState } from "react";
import BackButton from "@/components/BackButton";

const favoriteProducts = [
    {
        id: 1,
        title: "تیشرت لوگو دار",
        price: "2500000",
        image: "/site/1.jpg",
    },
    {
        id: 2,
        title: "شلوارک جین",
        price: "1890000",
        image: "/site/2.jpg",
    },
    {
        id: 3,
        title: "هودی ساده",
        price: "6500000",
        image: "/site/3.jpg",
    },
    {
        id: 4,
        title: "کیف دستی",
        price: "3200000",
        image: "/site/4.jpg",
    },
];

export default function FavoritesPage() {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#f1f2f3] text-[#171717]"
        >
            <div className="mx-auto min-h-screen w-full max-w-[500px] px-4 pb-28 pt-[88px]">
                {/* Top bar */}
                <div className="fixed inset-x-0 top-0 z-50 mx-auto flex h-[88px] max-w-[500px] items-start justify-between bg-[#f1f2f3] px-4 pt-4">
                    <div className="text-right">
                        <h1 className="text-[21px] font-bold tracking-tight">
                            علاقه‌مندی‌ها
                        </h1>
                        <p className="mt-0.5 text-[13px] text-black/45">
                            محصولاتی که دوست داری
                        </p>
                    </div>

                    <BackButton fixed={false} />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <span className="text-[13px] text-black/40">
                        {favoriteProducts.length} محصول
                    </span>

                    {favoriteProducts.length > 0 && (
                        <button
                            type="button"
                            className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-red-500 active:scale-95"
                        >
                            حذف همه
                        </button>
                    )}
                </div>

                {/* Products */}
                <section className="pt-1">
                    {favoriteProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {favoriteProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[55vh] items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[22px] bg-white">
                                    <span className="text-2xl">♡</span>
                                </div>

                                <h2 className="text-[16px] font-semibold">
                                    هنوز محصولی اضافه نکردی
                                </h2>

                                <p className="mt-1 text-[13px] text-black/45">
                                    محصولات مورد علاقه‌ات اینجا نمایش داده می‌شوند
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <SearchCommand
                open={searchOpen}
                onOpenChange={setSearchOpen}
            />

            <BottomNav
                searchOpen={searchOpen}
                onSearchClick={() => setSearchOpen(true)}
            />
        </main>
    );
}