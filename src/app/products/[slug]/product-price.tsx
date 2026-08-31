"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProductVariantDTO } from "@/types/product";

/**
 * Price display with two states:
 *  - No variant selected yet + multiple variants: shows a range
 *    ("شروع قیمت از X تا Y تومان") built from each variant's EFFECTIVE
 *    price (discounted price if it has one, else base price). If the
 *    range collapses to a single value (min === max), shows just that
 *    price instead of a range.
 *  - Variant selected: shows that variant's price (struck-through
 *    original + discounted price, if applicable).
 *
 * Animates between states with framer-motion (requires the `framer-motion`
 * package — add it if not already installed: npm i framer-motion).
 */
export function ProductPrice({
    variants,
    selectedVariant,
}: {
    variants: ProductVariantDTO[];
    selectedVariant: ProductVariantDTO | null;
}) {
    const range = useMemo(() => {
        if (variants.length === 0) return null;
        const effectivePrices = variants.map((v) => (v.hasDiscount ? v.discountedPrice : v.price));
        const min = Math.min(...effectivePrices);
        const max = Math.max(...effectivePrices);
        const anyDiscounted = variants.some((v) => v.hasDiscount);
        return { min, max, anyDiscounted };
    }, [variants]);

    return (
        <div className="min-h-[2.5rem]">
            <AnimatePresence mode="wait">
                {selectedVariant ? (
                    <motion.div
                        key={`variant-${selectedVariant.id}`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="flex flex-wrap items-center gap-2"
                    >
                        {selectedVariant.hasDiscount && (
                            <span className="text-base font-medium text-muted-foreground line-through">
                                {selectedVariant.price.toLocaleString("fa-IR")} تومان
                            </span>
                        )}
                        <span className="text-2xl font-extrabold text-primary">
                            {(selectedVariant.hasDiscount ? selectedVariant.discountedPrice : selectedVariant.price).toLocaleString(
                                "fa-IR"
                            )}{" "}
                            تومان
                        </span>
                    </motion.div>
                ) : range ? (
                    <motion.div
                        key="range"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                    >
                        {range.min === range.max ? (
                            <span className="text-2xl font-extrabold text-primary">
                                {range.min.toLocaleString("fa-IR")} تومان
                            </span>
                        ) : (
                            <span className="text-lg font-bold text-primary">
                                شروع قیمت از {range.min.toLocaleString("fa-IR")} تا {range.max.toLocaleString("fa-IR")} تومان
                            </span>
                        )}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}