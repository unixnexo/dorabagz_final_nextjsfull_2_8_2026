// "use client";

// import { Heart } from "lucide-react";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { AnimatePresence, motion } from "framer-motion";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import type { ProductListItemDTO } from "@/types/product";

// type ProductCardProps = {
//     product: ProductListItemDTO;
// };

// type PriceFrame = {
//     key: string;
//     label: string;
//     // "sale" = discounted price (shown in red, bold)
//     // "strike" = original price shown alongside a sale (muted, line-through)
//     // "normal" = regular price, no discount active
//     variant: "sale" | "strike" | "normal";
// };

// /** Builds the sequence of price "frames" this card cycles through.
//  *
//  *  - No discount, single price: just that number, no cycling.
//  *  - No discount, price range: cycles [min, max].
//  *  - Discount, single variant: cycles [discounted, original-struck].
//  *  - Discount, price range: cycles [min-discounted, max-discounted,
//  *    min-original, max-original] — every distinct number the shopper
//  *    might care about, one at a time, always at full readable size.
//  *
//  *  This is intentionally a flat list of frames rather than nested
//  *  min/max + discount state, so the animation logic below never needs to
//  *  branch on shape — it just steps through frames[i] on an interval.
//  */
// function buildPriceFrames(product: ProductListItemDTO): PriceFrame[] {
//     const fmt = (n: number) => n.toLocaleString("en-US");
//     const hasRange = product.minPrice !== product.maxPrice;
//     const hasDiscountRange = product.minDiscountedPrice !== product.maxDiscountedPrice;

//     if (!product.hasDiscount) {
//         if (!hasRange) {
//             return [{ key: "single", label: fmt(product.minPrice), variant: "normal" }];
//         }
//         return [
//             { key: "min", label: fmt(product.minPrice), variant: "normal" },
//             { key: "max", label: fmt(product.maxPrice), variant: "normal" },
//         ];
//     }

//     const frames: PriceFrame[] = [];
//     frames.push({
//         key: "sale-min",
//         label: fmt(product.minDiscountedPrice),
//         variant: "sale",
//     });
//     if (hasDiscountRange) {
//         frames.push({
//             key: "sale-max",
//             label: fmt(product.maxDiscountedPrice),
//             variant: "sale",
//         });
//     }
//     frames.push({
//         key: "strike-min",
//         label: fmt(product.minPrice),
//         variant: "strike",
//     });
//     if (hasRange) {
//         frames.push({
//             key: "strike-max",
//             label: fmt(product.maxPrice),
//             variant: "strike",
//         });
//     }
//     return frames;
// }

// const FRAME_INTERVAL_MS = 1800;

// function PriceDisplay({ product }: { product: ProductListItemDTO }) {
//     const frames = buildPriceFrames(product);
//     const [frameIndex, setFrameIndex] = useState(0);

//     // Only bother with an interval if there's actually more than one
//     // frame to cycle through — a single fixed price never animates.
//     useEffect(() => {
//         if (frames.length <= 1) return;
//         setFrameIndex(0);
//         const timer = setInterval(() => {
//             setFrameIndex((i) => (i + 1) % frames.length);
//         }, FRAME_INTERVAL_MS);
//         return () => clearInterval(timer);
//         // frames.length is derived from `product`, safe to key off product.id
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [product.id]);

//     const frame = frames[frameIndex];

//     return (
//         <div className="mt-1 flex h-[20px] items-center gap-1.5 overflow-hidden">
//             <AnimatePresence mode="wait">
//                 <motion.span
//                     key={frame.key}
//                     initial={{ y: 10, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     exit={{ y: -10, opacity: 0 }}
//                     transition={{ duration: 0.25, ease: "easeOut" }}
//                     className={
//                         frame.variant === "sale"
//                             ? "text-[15px] font-bold text-[#c0392b]"
//                             : frame.variant === "strike"
//                                 ? "text-[12px] text-muted-foreground line-through"
//                                 : "text-[15px] font-bold"
//                     }
//                 >
//                     {frame.label}
//                 </motion.span>
//             </AnimatePresence>

//             <span className="text-[12px] text-muted-foreground">تومن</span>
//         </div>
//     );
// }

// export function ProductCard({ product }: ProductCardProps) {
//     // Placeholder only — this card does NOT yet know the real favorited
//     // state for the current user, because ProductListItemDTO has no
//     // isFavorited field yet (confirmed missing, not an oversight). This
//     // toggle is purely local/cosmetic until that field exists and gets
//     // wired to toggleFavoriteAction like the product detail page does.
//     const [isFavorite, setIsFavorite] = useState(false);

//     const discountPercent = product.hasDiscount
//         ? Math.round(
//             ((product.minPrice - product.minDiscountedPrice) / product.minPrice) * 100
//         )
//         : 0;

//     return (
//         <Link href={`/products/${product.slug}`}>
//             {/* layoutId here is the "card frame" half of the shared-element
//                transition — paired with the matching layoutId on OverlayShell's
//                wrapping motion.div in the intercepted route. */}
//             <motion.div layoutId={`product-card-${product.slug}`}>
//                 <Card className="group overflow-hidden rounded-[25px] border-0 bg-transparent shadow-none">
//                     {/* Image */}
//                     <div className="relative aspect-[0.88] overflow-hidden rounded-[25px] bg-white">
//                         {product.mainImageUrl && (
//                             // layoutId here is the "image" half — paired with the
//                             // layoutId'd wrapper in ProductGallery in the overlay. Uses
//                             // a motion.div wrapper + next/image inside (not motion(Image)
//                             // directly) so both ends of the shared transition interpolate
//                             // the same box-based way — avoids a squish/crop artifact when
//                             // animating between differently-shaped object-cover images.
//                             <motion.div
//                                 layoutId={`product-image-${product.slug}`}
//                                 className="absolute inset-0 h-full w-full overflow-hidden"
//                             >
//                                 <Image
//                                     src={product.mainImageUrl}
//                                     alt={product.title}
//                                     fill
//                                     sizes="(max-width: 640px) 50vw, 300px"
//                                     className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
//                                 />
//                             </motion.div>
//                         )}

//                         {/* Favorite */}
//                         <Button
//                             type="button"
//                             variant="ghost"
//                             size="icon"
//                             onClick={(e) => {
//                                 e.preventDefault();
//                                 setIsFavorite((current) => !current);
//                             }}
//                             className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
//                         >
//                             <Heart
//                                 className="h-[19px] w-[19px] stroke-[1.8]"
//                                 fill={isFavorite ? "currentColor" : "none"}
//                             />
//                         </Button>

//                         {/* Discount badge — top-left ribbon-style corner tag,
//                             only rendered when there's an actual discount */}
//                         {product.hasDiscount && discountPercent > 0 && (
//                             <div className="absolute left-3 top-3 z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#c0392b] px-3 shadow-sm">
//                                 <span className="text-xs font-bold text-white">
//                                     {discountPercent}%
//                                 </span>
//                             </div>
//                         )}

//                         {/* Out-of-stock — now a full-width bottom band over
//                             the image instead of a small corner pill, so it's
//                             actually noticeable at a glance */}
//                         {product.totalStock <= 0 && (
//                             <div className="absolute inset-x-0 bottom-0 z-10 bg-black/75 py-1.5 text-center backdrop-blur-sm">
//                                 <span className="text-[12px] font-bold text-white">
//                                     ناموجود
//                                 </span>
//                             </div>
//                         )}
//                     </div>

//                     {/* Product info */}
//                     <div className="px-1 pt-2.5">
//                         <h3 className="truncate text-[15px] font-medium">
//                             {product.title}
//                         </h3>

//                         <PriceDisplay product={product} />
//                     </div>
//                 </Card>
//             </motion.div>
//         </Link>
//     );
// }









"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { toggleFavoriteAction } from "@/server/favorite/actions";
import type { ProductListItemDTO } from "@/types/product";
import { FavoriteButton } from "../products/[slug]/favorite-button";

type ProductCardProps = {
    product: ProductListItemDTO;
};

type PriceFrame = {
    key: string;
    label: string;
    // "sale" = discounted price (shown in red, bold)
    // "strike" = original price shown alongside a sale (muted, line-through)
    // "normal" = regular price, no discount active
    variant: "sale" | "strike" | "normal";
};

/** Builds the sequence of price "frames" this card cycles through.
 *
 *  - No discount, single price: just that number, no cycling.
 *  - No discount, price range: cycles [min, max].
 *  - Discount, single variant: cycles [discounted, original-struck].
 *  - Discount, price range: cycles [min-discounted, max-discounted,
 *    min-original, max-original] — every distinct number the shopper
 *    might care about, one at a time, always at full readable size.
 */
function buildPriceFrames(product: ProductListItemDTO): PriceFrame[] {
    const fmt = (n: number) => n.toLocaleString("en-US");
    const hasRange = product.minPrice !== product.maxPrice;
    const hasDiscountRange = product.minDiscountedPrice !== product.maxDiscountedPrice;

    if (!product.hasDiscount) {
        if (!hasRange) {
            return [{ key: "single", label: fmt(product.minPrice), variant: "normal" }];
        }
        return [
            { key: "min", label: fmt(product.minPrice), variant: "normal" },
            { key: "max", label: fmt(product.maxPrice), variant: "normal" },
        ];
    }

    const frames: PriceFrame[] = [];
    frames.push({ key: "sale-min", label: fmt(product.minDiscountedPrice), variant: "sale" });
    if (hasDiscountRange) {
        frames.push({ key: "sale-max", label: fmt(product.maxDiscountedPrice), variant: "sale" });
    }
    frames.push({ key: "strike-min", label: fmt(product.minPrice), variant: "strike" });
    if (hasRange) {
        frames.push({ key: "strike-max", label: fmt(product.maxPrice), variant: "strike" });
    }
    return frames;
}

const FRAME_INTERVAL_MS = 1800;

function PriceDisplay({ product }: { product: ProductListItemDTO }) {
    const frames = buildPriceFrames(product);
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        if (frames.length <= 1) return;
        setFrameIndex(0);
        const timer = setInterval(() => {
            setFrameIndex((i) => (i + 1) % frames.length);
        }, FRAME_INTERVAL_MS);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    const frame = frames[frameIndex];

    return (
        <div className="flex h-[20px] items-center gap-1.5 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.span
                    key={frame.key}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={
                        frame.variant === "sale"
                            ? "text-[15px] font-bold text-[#c0392b]"
                            : frame.variant === "strike"
                                ? "text-[12px] text-muted-foreground line-through"
                                : "text-[15px] font-bold"
                    }
                >
                    {frame.label}
                </motion.span>
            </AnimatePresence>

            <span className="text-[12px] text-muted-foreground">تومن</span>
        </div>
    );
}

export function ProductCard({ product }: ProductCardProps) {
    const [isFavorited, setIsFavorited] = useState(product.isFavorited);
    const [isPending, startTransition] = useTransition();

    // Keep local state in sync if the server-rendered product prop changes
    // underneath us (e.g. navigating back to this page after favoriting
    // elsewhere triggers a fresh server fetch with updated isFavorited).
    useEffect(() => {
        setIsFavorited(product.isFavorited);
    }, [product.isFavorited]);

    function handleToggleFavorite() {
        // Optimistic update, same pattern as the product detail page —
        // flip immediately, revert only if the server call actually fails.
        const next = !isFavorited;
        setIsFavorited(next);

        startTransition(async () => {
            const result = await toggleFavoriteAction({ productId: product.id });
            if (result.success) {
                setIsFavorited(result.data.isFavorited);
            } else {
                setIsFavorited(!next); // revert on failure
                toast.error(result.error);
            }
        });
    }

    const discountPercent = product.hasDiscount
        ? Math.round(((product.minPrice - product.minDiscountedPrice) / product.minPrice) * 100)
        : 0;

    return (
        <Link href={`/products/${product.slug}`}>
            {/* layoutId here is the "card frame" half of the shared-element
               transition — paired with the matching layoutId on OverlayShell's
               wrapping motion.div in the intercepted route. */}
            <motion.div layoutId={`product-card-${product.slug}`}>
                <Card className="group overflow-hidden rounded-[25px] border-0 bg-transparent shadow-none">
                    {/* Image */}
                    <div className="relative aspect-[0.88] overflow-hidden rounded-[25px] bg-white">
                        {product.mainImageUrl && (
                            // layoutId here is the "image" half — paired with the
                            // layoutId'd wrapper in ProductGallery in the overlay.
                            <motion.div
                                layoutId={`product-image-${product.slug}`}
                                className="absolute inset-0 h-full w-full overflow-hidden"
                            >
                                <Image
                                    src={product.mainImageUrl}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, 300px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                            </motion.div>
                        )}

                        {/* Favorite — same component/animation as the product
                            detail page. Its own hit target is h-11 w-11
                            (unchanged) so tap size matches everywhere in the
                            app; wrapped + scaled down visually here only to
                            fit the smaller card real estate without forking
                            the component. */}
                        <div
                            className="absolute right-2 top-2 z-10 origin-top-right scale-[0.73]"
                            onClick={(e) => e.preventDefault()}
                        >
                            <FavoriteButton
                                isFavorited={isFavorited}
                                onToggle={handleToggleFavorite}
                                disabled={isPending}
                            />
                        </div>

                        {/* Discount badge */}
                        {product.hasDiscount && discountPercent > 0 && (
                            <div className="absolute left-3 top-3 z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#c0392b] px-2 shadow-sm">
                                <span className="text-[11px] font-bold text-white">
                                    {discountPercent}%
                                </span>
                            </div>
                        )}

                        {/* Out-of-stock band */}
                        {product.totalStock <= 0 && (
                            <div className="absolute inset-x-0 bottom-0 z-10 bg-black/75 py-1.5 text-center backdrop-blur-sm">
                                <span className="text-[12px] font-bold text-white">ناموجود</span>
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="px-1 pt-2.5">
                        <h3 className="truncate text-[15px] font-medium">{product.title}</h3>

                        {/* Rating — only shown once there's at least one
                            review, per your spec ("if its above zero") */}
                        {product.reviewCount > 0 && (
                            <div className="mt-0.5 flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-[12px] font-medium text-black/70">
                                    {product.averageRating.toLocaleString("en-US", {
                                        maximumFractionDigits: 1,
                                    })}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    ({product.reviewCount.toLocaleString("en-US")})
                                </span>
                            </div>
                        )}

                        <div className="mt-1">
                            <PriceDisplay product={product} />
                        </div>
                    </div>
                </Card>
            </motion.div>
        </Link>
    );
}



