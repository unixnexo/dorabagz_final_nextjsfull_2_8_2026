"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";
import { SearchCommand } from "@/components/search-command";
import BackButton from "@/components/BackButton";

const cartItems = [
    {
        variantId: "1",
        productTitle: "تیشرت لوگو دار",
        productSlug: "logo-tshirt",
        mainImageUrl: "/site/1.jpg",
        optionValues: {
            رنگ: "مشکی",
            سایز: "L",
        },
        price: 2500000,
        quantity: 1,
        stock: 5,
    },
    {
        variantId: "2",
        productTitle: "شلوارک جین",
        productSlug: "denim-shorts",
        mainImageUrl: "/site/2.jpg",
        optionValues: {
            رنگ: "آبی",
            سایز: "M",
        },
        price: 1890000,
        quantity: 2,
        stock: 8,
    },
    {
        variantId: "3",
        productTitle: "هودی ساده",
        productSlug: "simple-hoodie",
        mainImageUrl: "/site/3.jpg",
        optionValues: {
            رنگ: "طوسی",
            سایز: "XL",
        },
        price: 6500000,
        quantity: 1,
        stock: 3,
    },
];

export function CartView() {
    const [items, setItems] = useState(cartItems);
    const [searchOpen, setSearchOpen] = useState(false);

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const totalItems = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    function updateQuantity(variantId: string, amount: number) {
        setItems((current) =>
            current.map((item) => {
                if (item.variantId !== variantId) return item;

                const quantity = Math.max(
                    1,
                    Math.min(item.stock, item.quantity + amount)
                );

                return {
                    ...item,
                    quantity,
                };
            })
        );
    }

    function removeItem(variantId: string) {
        setItems((current) =>
            current.filter((item) => item.variantId !== variantId)
        );
    }

    function clearCart() {
        setItems([]);
    }

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#f1f2f3] text-[#171717]"
        >
            <div className="mx-auto min-h-screen w-full max-w-[500px] px-4 pb-36 pt-[92px]">
                {/* Header */}
                <header className="fixed inset-x-0 top-0 z-50 mx-auto flex h-[88px] max-w-[500px] items-start justify-between bg-[#f1f2f3] px-4 pt-4">
                    <BackButton />

                    <div className="text-right">
                        <h1 className="text-[21px] font-bold tracking-tight">
                            سبد خرید
                        </h1>

                        <p className="mt-0.5 text-[13px] text-black/45">
                            {totalItems} کالا در سبد شما
                        </p>
                    </div>
                </header>

                {items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <>
                        {/* Clear */}
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-[13px] text-black/40">
                                {items.length} محصول
                            </span>

                            <button
                                type="button"
                                onClick={clearCart}
                                className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-red-500 transition-transform active:scale-95"
                            >
                                خالی کردن سبد
                            </button>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            {items.map((item) => (
                                <CartItem
                                    key={item.variantId}
                                    item={item}
                                    onIncrease={() =>
                                        updateQuantity(item.variantId, 1)
                                    }
                                    onDecrease={() =>
                                        updateQuantity(item.variantId, -1)
                                    }
                                    onRemove={() =>
                                        removeItem(item.variantId)
                                    }
                                />
                            ))}
                        </div>

                        {/* Summary */}
                        <section className="mt-5 rounded-[28px] bg-white p-5">
                            <div className="flex items-center justify-between text-[14px]">
                                <span className="text-black/50">
                                    جمع محصولات
                                </span>

                                <span className="font-medium">
                                    {totalPrice.toLocaleString("fa-IR")} تومن
                                </span>
                            </div>

                            <div className="my-4 h-px bg-black/[0.06]" />

                            <div className="flex items-end justify-between">
                                <span className="text-[15px] font-semibold">
                                    جمع کل
                                </span>

                                <div className="text-left">
                                    <span className="text-[21px] font-bold tracking-tight">
                                        {totalPrice.toLocaleString("fa-IR")}
                                    </span>

                                    <span className="mr-1 text-[12px] text-black/45">
                                        تومن
                                    </span>
                                </div>
                            </div>

                            <Button
                                asChild
                                className="mt-5 h-13 w-full rounded-[18px] text-[15px] font-semibold"
                            >
                                <Link href="/checkout">
                                    ادامه فرآیند خرید
                                </Link>
                            </Button>
                        </section>
                    </>
                )}
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

function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}: {
    item: (typeof cartItems)[number];
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}) {
    const options = Object.entries(item.optionValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join("  /  ");

    return (
        <Card className="overflow-hidden rounded-[28px] border-0 bg-white p-3 shadow-none">
            <div className="flex gap-3">
                {/* Image */}
                <Link
                    href={`/products/${item.productSlug}`}
                    className="block shrink-0"
                >
                    <div className="size-[104px] overflow-hidden rounded-[21px] bg-[#f5f5f5]">
                        <img
                            src={item.mainImageUrl}
                            alt={item.productTitle}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </Link>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col py-0.5">
                    <div className="flex items-start justify-between gap-2">
                        <Link
                            href={`/products/${item.productSlug}`}
                            className="min-w-0"
                        >
                            <h2 className="truncate text-[15px] font-semibold">
                                {item.productTitle}
                            </h2>
                        </Link>

                        <button
                            type="button"
                            onClick={onRemove}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-black/30 transition-colors hover:bg-red-50 hover:text-red-500 active:scale-90"
                        >
                            <Trash2 className="size-[17px]" />
                        </button>
                    </div>

                    <p className="mt-1 truncate text-[11px] text-black/40">
                        {options}
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-2">
                        <div className="min-w-0">
                            <span className="block truncate text-[14px] font-bold">
                                {item.price.toLocaleString("fa-IR")}
                            </span>

                            <span className="text-[10px] text-black/40">
                                تومن
                            </span>
                        </div>

                        {/* Quantity */}
                        <div className="flex h-9 items-center rounded-full bg-[#f1f2f3] p-0.5">
                            <button
                                type="button"
                                onClick={onIncrease}
                                disabled={item.quantity >= item.stock}
                                className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm transition-transform disabled:opacity-30 active:scale-90"
                            >
                                <Plus className="size-4" />
                            </button>

                            <span className="w-7 text-center text-[13px] font-semibold">
                                {item.quantity}
                            </span>

                            <button
                                type="button"
                                onClick={onDecrease}
                                disabled={item.quantity <= 1}
                                className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm transition-transform disabled:opacity-30 active:scale-90"
                            >
                                <Minus className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function EmptyCart() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[22px] bg-white">
                    <span className="text-[27px]">🛍</span>
                </div>

                <h2 className="text-[17px] font-semibold">
                    سبد خرید خالی است
                </h2>

                <p className="mt-1 text-[13px] leading-6 text-black/45">
                    محصولاتی که انتخاب می‌کنی
                    <br />
                    اینجا نمایش داده می‌شوند
                </p>

                <Button
                    asChild
                    className="mt-5 h-11 rounded-full px-6"
                >
                    <Link href="/">
                        مشاهده محصولات
                    </Link>
                </Button>
            </div>
        </div>
    );
}