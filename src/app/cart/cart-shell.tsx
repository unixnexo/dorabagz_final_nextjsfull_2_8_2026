"use client";

import { useState } from "react";
import { CartItem } from "./cart-item";
import { CartItemSkeleton } from "./cart-item-skeleton";
import { CartSummary } from "./cart-summary";
import { EmptyCart } from "./empty-cart";
import { BottomNav } from "@/components/bottom-nav";
import { SearchCommand } from "@/components/search-command";
import BackButton from "@/components/BackButton";
import type { CartItemDTO } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type CartShellProps = {
    items: CartItemDTO[];
    totalPrice: number;
    isLoggedIn: boolean;
    isGuest: boolean;
    isLoading: boolean;
    onQuantityChange: (variantId: string, quantity: number) => void;
    onRemove: (variantId: string) => void;
    onClear: () => void;
};

export function CartShell({
    items,
    totalPrice,
    isLoggedIn,
    isGuest,
    isLoading,
    onQuantityChange,
    onRemove,
    onClear,
}: CartShellProps) {
    const [searchOpen, setSearchOpen] = useState(false);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const outOfStockVariantIds = items.filter((i) => i.quantity > i.stock).map((i) => i.variantId);
    const hasOutOfStockItems = outOfStockVariantIds.length > 0;
    const router = useRouter();

    async function handleRemoveOutOfStockItems() {
        for (const variantId of outOfStockVariantIds) {
            onRemove(variantId);
        }
    }

    return (
        <main dir="rtl" className="min-h-screen bg-[#f1f2f3] text-[#171717]">
            <div className="mx-auto min-h-screen w-full max-w-[500px] px-4 pb-36 pt-[92px]">
                {/* Header */}
                <header className="fixed inset-x-0 top-0 z-50 mx-auto flex h-[88px] max-w-[500px] items-start justify-between bg-[#f1f2f3] px-4 pt-4">
                    <BackButton bgClass="bg-white" />
                    <div className="text-right">
                        <h1 className="text-[21px] font-bold tracking-tight">سبد خرید</h1>
                        <p className="mt-0.5 text-[13px] text-black/45">{totalItems} کالا در سبد شما</p>
                    </div>
                </header>

                {isGuest && !isLoading && (
                    <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-[12px] leading-5 text-amber-700">
                        <p>
                            این سبد خرید در مرورگر شما ذخیره می‌شود. برای تکمیل خرید ابتدا وارد حساب
                            کاربری خود شوید.
                        </p>

                        <Button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="w-full h-10"
                        >
                            ورود
                        </Button>
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-3 pt-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <CartItemSkeleton key={i} />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-[13px] text-black/40">{items.length} محصول</span>
                            <button
                                type="button"
                                onClick={onClear}
                                className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-red-500 transition-transform active:scale-95"
                            >
                                خالی کردن سبد
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item) => (
                                <CartItem
                                    key={item.variantId}
                                    item={item}
                                    onIncrease={() => onQuantityChange(item.variantId, item.quantity + 1)}
                                    onDecrease={() => onQuantityChange(item.variantId, item.quantity - 1)}
                                    onRemove={() => onRemove(item.variantId)}
                                />
                            ))}
                        </div>

                        <CartSummary
                            totalPrice={totalPrice}
                            isLoggedIn={isLoggedIn}
                            hasOutOfStockItems={hasOutOfStockItems}
                            onRemoveOutOfStockItems={handleRemoveOutOfStockItems}
                        />
                    </>
                )}
            </div>

            <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
            {/* <BottomNav searchOpen={searchOpen} onSearchClick={() => setSearchOpen(true)} /> */}
            <BottomNav searchOpen={searchOpen} onSearchClick={() => setSearchOpen(true)} isLoggedIn={isLoggedIn} />
        </main>
    );
}