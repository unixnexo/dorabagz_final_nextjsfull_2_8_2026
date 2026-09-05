// "use client";

// import { Heart } from "lucide-react";
// import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// export type ProductCardProduct = {
//     id: number | string;
//     title: string;
//     price: number | string;
//     image: string;
// };

// type ProductCardProps = {
//     product: ProductCardProduct;
// };

// export function ProductCard({ product }: ProductCardProps) {
//     const [isFavorite, setIsFavorite] = useState(false);

//     return (
//         <Card className="group overflow-hidden rounded-[25px] border-0 bg-transparent shadow-none">
//             {/* Image */}
//             <div className="relative aspect-[0.88] overflow-hidden rounded-[25px] bg-white">
//                 <img
//                     src={product.image}
//                     alt={product.title}
//                     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
//                 />

//                 {/* Favorite */}
//                 <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setIsFavorite((current) => !current)}
//                     className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
//                 >
//                     <Heart
//                         className="h-[19px] w-[19px] stroke-[1.8]"
//                         fill={isFavorite ? "currentColor" : "none"}
//                     />
//                 </Button>
//             </div>

//             {/* Product info */}
//             <div className="px-1 pt-2.5">
//                 <h3 className="truncate text-[15px] font-medium">
//                     {product.title}
//                 </h3>

//                 <div className="mt-1 flex items-center gap-1">
//                     <span className="text-[15px] font-bold">
//                         {Number(product.price).toLocaleString("en-US")}
//                     </span>

//                     <span className="text-[12px] text-muted-foreground">
//                         تومن
//                     </span>
//                 </div>
//             </div>
//         </Card>
//     );
// }










"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export type ProductCardProduct = {
    id: number | string;
    title: string;
    image: string | null;
    slug?: string;

    // Simple flat price (existing usage — still works as-is)
    price?: number | string;

    // Range/discount pricing (favorites & anywhere with FavoriteItemDTO-like data)
    minPrice?: number;
    maxPrice?: number;
    hasDiscount?: boolean;
    minDiscountedPrice?: number;
    maxDiscountedPrice?: number;

    totalStock?: number;
};

type ProductCardProps = {
    product: ProductCardProduct;
    /** Controlled favorite state. If omitted, the card manages its own state internally. */
    isFavorite?: boolean;
    /** Called after the heart is tapped, with the new favorite state. */
    onToggleFavorite?: (next: boolean) => void;
};

function formatToman(value: number) {
    return value.toLocaleString("en-US");
}

export function ProductCard({ product, isFavorite: controlledFavorite, onToggleFavorite }: ProductCardProps) {
    const [internalFavorite, setInternalFavorite] = useState(false);
    const isControlled = controlledFavorite !== undefined;
    const isFavorite = isControlled ? controlledFavorite : internalFavorite;

    const [burstKey, setBurstKey] = useState(0);

    function handleToggle() {
        const next = !isFavorite;
        if (!isControlled) setInternalFavorite(next);
        if (next) setBurstKey((k) => k + 1); // trigger particle burst only on "love"
        onToggleFavorite?.(next);
    }

    const hasRange = product.minPrice !== undefined && product.maxPrice !== undefined;

    const CardInner = (
        <Card className="group overflow-hidden rounded-[25px] border-0 bg-transparent shadow-none">
            {/* Image */}
            <div className="relative aspect-[0.88] overflow-hidden rounded-[25px] bg-white">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 500px) 50vw, 220px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/5 text-[11px] text-black/30">
                        بدون تصویر
                    </div>
                )}

                {product.totalStock === 0 && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-center text-[11px] font-medium text-white backdrop-blur-sm">
                        ناموجود
                    </div>
                )}

                {/* Favorite */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggle();
                    }}
                    className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
                >
                    <span className="relative flex items-center justify-center">
                        <motion.span
                            key={isFavorite ? "on" : "off"}
                            initial={{ scale: 0.6 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            <Heart
                                className="h-[19px] w-[19px] stroke-[1.8] text-red-500"
                                fill={isFavorite ? "currentColor" : "none"}
                            />
                        </motion.span>

                        {/* Particle burst on love */}
                        <AnimatePresence>
                            {burstKey > 0 && isFavorite && (
                                <motion.span
                                    key={burstKey}
                                    className="pointer-events-none absolute inset-0"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    {Array.from({ length: 6 }).map((_, i) => {
                                        const angle = (i / 6) * Math.PI * 2;
                                        const dx = Math.cos(angle) * 16;
                                        const dy = Math.sin(angle) * 16;
                                        return (
                                            <motion.span
                                                key={i}
                                                className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-red-500"
                                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                                animate={{ x: dx, y: dy, opacity: 0, scale: 0 }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                            />
                                        );
                                    })}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </span>
                </Button>
            </div>

            {/* Product info */}
            <div className="px-1 pt-2.5">
                <h3 className="truncate text-[15px] font-medium">{product.title}</h3>

                {hasRange ? (
                    product.hasDiscount ? (
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[12px] text-muted-foreground line-through">
                                {product.minPrice === product.maxPrice
                                    ? formatToman(product.minPrice!)
                                    : `${formatToman(product.minPrice!)}-${formatToman(product.maxPrice!)}`}
                            </span>
                            <span className="text-[15px] font-bold text-red-600">
                                {product.minDiscountedPrice === product.maxDiscountedPrice
                                    ? formatToman(product.minDiscountedPrice!)
                                    : `${formatToman(product.minDiscountedPrice!)}-${formatToman(product.maxDiscountedPrice!)}`}
                            </span>
                            <span className="text-[12px] text-muted-foreground">تومن</span>
                        </div>
                    ) : (
                        <div className="mt-1 flex items-center gap-1">
                            <span className="text-[15px] font-bold">
                                {product.minPrice === product.maxPrice
                                    ? formatToman(product.minPrice!)
                                    : `${formatToman(product.minPrice!)}-${formatToman(product.maxPrice!)}`}
                            </span>
                            <span className="text-[12px] text-muted-foreground">تومن</span>
                        </div>
                    )
                ) : (
                    <div className="mt-1 flex items-center gap-1">
                        <span className="text-[15px] font-bold">
                            {Number(product.price).toLocaleString("en-US")}
                        </span>
                        <span className="text-[12px] text-muted-foreground">تومن</span>
                    </div>
                )}
            </div>
        </Card>
    );

    if (product.slug) {
        return (
            <Link href={`/products/${product.slug}`} className="block">
                {CardInner}
            </Link>
        );
    }

    return CardInner;
}


