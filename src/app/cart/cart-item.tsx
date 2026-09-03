"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import type { CartItemDTO } from "@/types/cart";

type CartItemProps = {
    item: CartItemDTO;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
};

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
    const options = Object.entries(item.optionValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join("  /  ");

    const isOutOfStock = item.quantity > item.stock;

    return (
        <Card
            className={`overflow-hidden rounded-[28px] border-0 bg-white p-3 shadow-none transition-opacity ${isOutOfStock ? "opacity-50" : ""
                }`}
        >
            {isOutOfStock && (
                <div className="mb-2 rounded-full bg-red-50 px-3 py-1.5 text-center text-[12px] font-medium text-red-500">
                    موجودی کافی نیست — این محصول در ادامه فرآیند خرید حذف می‌شود
                </div>
            )}

            <div className="flex gap-3">
                {/* Image */}
                <Link href={`/products/${item.productSlug}`} className="block shrink-0">
                    <div className="size-[104px] overflow-hidden rounded-[21px] bg-[#f5f5f5]">
                        {item.mainImageUrl ? (
                            <img
                                src={item.mainImageUrl}
                                alt={item.productTitle}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-[11px] text-black/30">
                                بدون تصویر
                            </div>
                        )}
                    </div>
                </Link>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col py-0.5">
                    <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${item.productSlug}`} className="min-w-0">
                            <h2 className="truncate text-[15px] font-semibold">{item.productTitle}</h2>
                        </Link>

                        <button
                            type="button"
                            onClick={onRemove}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-black/30 transition-colors hover:bg-red-50 hover:text-red-500 active:scale-90"
                        >
                            <Trash2 className="size-[17px]" />
                        </button>
                    </div>

                    {options && <p className="mt-1 truncate text-[11px] text-black/40">{options}</p>}

                    <div className="mt-auto flex items-end justify-between gap-2">
                        {/* <div className="min-w-0">
                            <span className="block truncate text-[14px] font-bold">
                                {item.price.toLocaleString("fa-IR")}
                            </span>
                            <span className="text-[10px] text-black/40">تومن</span>
                        </div> */}

                        <div className="min-w-0">
                            <span className="relative block overflow-hidden truncate text-[14px] font-bold">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                        key={item.price}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                        className="inline-block"
                                    >
                                        {item.price.toLocaleString("fa-IR")}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                            <span className="text-[10px] text-black/40">تومن</span>
                        </div>

                        {/* Quantity */}
                        <div className="flex h-9 items-center rounded-full bg-[#f1f2f3] p-0.5">
                            <button
                                type="button"
                                onClick={onIncrease}
                                disabled={isOutOfStock || item.quantity >= item.stock}
                                className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm transition-transform disabled:opacity-30 active:scale-90"
                            >
                                <Plus className="size-4" />
                            </button>

                            {/* <span className="w-7 text-center text-[13px] font-semibold">{item.quantity}</span> */}

                            <span className="relative w-7 overflow-hidden text-center text-[13px] font-semibold">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                        key={item.quantity}
                                        initial={{ y: 12, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -12, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="inline-block"
                                    >
                                        {item.quantity}
                                    </motion.span>
                                </AnimatePresence>
                            </span>

                            <button
                                type="button"
                                onClick={onDecrease}
                                disabled={isOutOfStock || item.quantity <= 1}
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