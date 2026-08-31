// "use client";

// import { Heart } from "lucide-react";
// import { useState } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import type { ProductListItemDTO } from "@/types/product";

// type ProductCardProps = {
//     product: ProductListItemDTO;
// };

// export function ProductCard({ product }: ProductCardProps) {
//     const [isFavorite, setIsFavorite] = useState(false);

//     const priceLabel =
//         product.minPrice === product.maxPrice
//             ? product.minPrice.toLocaleString("en-US")
//             : `${product.minPrice.toLocaleString("en-US")} - ${product.maxPrice.toLocaleString("en-US")}`;

//     const discountedPriceLabel =
//         product.hasDiscount
//             ? product.minDiscountedPrice === product.maxDiscountedPrice
//                 ? product.minDiscountedPrice.toLocaleString("en-US")
//                 : `${product.minDiscountedPrice.toLocaleString("en-US")} - ${product.maxDiscountedPrice.toLocaleString("en-US")}`
//             : null;

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
//                             // layoutId passed into ProductGallery in the overlay.
//                             <motion.img
//                                 layoutId={`product-image-${product.slug}`}
//                                 src={product.mainImageUrl}
//                                 alt={product.title}
//                                 className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
//                             />
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
//                             className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
//                         >
//                             <Heart
//                                 className="h-[19px] w-[19px] stroke-[1.8]"
//                                 fill={isFavorite ? "currentColor" : "none"}
//                             />
//                         </Button>

//                         {product.totalStock <= 0 && (
//                             <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white">
//                                 ناموجود
//                             </span>
//                         )}
//                     </div>

//                     {/* Product info */}
//                     <div className="px-1 pt-2.5">
//                         <h3 className="truncate text-[15px] font-medium">
//                             {product.title}
//                         </h3>

//                         <div className="mt-1 flex items-center gap-1.5">
//                             {discountedPriceLabel ? (
//                                 <>
//                                     <span className="text-[15px] font-bold text-[#c0392b]">
//                                         {discountedPriceLabel}
//                                     </span>
//                                     <span className="text-[12px] text-muted-foreground line-through">
//                                         {priceLabel}
//                                     </span>
//                                 </>
//                             ) : (
//                                 <span className="text-[15px] font-bold">
//                                     {priceLabel}
//                                 </span>
//                             )}

//                             <span className="text-[12px] text-muted-foreground">
//                                 تومن
//                             </span>
//                         </div>
//                     </div>
//                 </Card>
//             </motion.div>
//         </Link>
//     );
// }








"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProductListItemDTO } from "@/types/product";

type ProductCardProps = {
    product: ProductListItemDTO;
};

export function ProductCard({ product }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const priceLabel =
        product.minPrice === product.maxPrice
            ? product.minPrice.toLocaleString("en-US")
            : `${product.minPrice.toLocaleString("en-US")} - ${product.maxPrice.toLocaleString("en-US")}`;

    const discountedPriceLabel =
        product.hasDiscount
            ? product.minDiscountedPrice === product.maxDiscountedPrice
                ? product.minDiscountedPrice.toLocaleString("en-US")
                : `${product.minDiscountedPrice.toLocaleString("en-US")} - ${product.maxDiscountedPrice.toLocaleString("en-US")}`
            : null;

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
                            // layoutId'd wrapper in ProductGallery in the overlay. Uses
                            // a motion.div wrapper + plain <img> inside (not motion.img
                            // directly) so both ends of the shared transition interpolate
                            // the same box-based way — avoids a squish/crop artifact when
                            // animating between differently-shaped object-cover images.
                            <motion.div
                                layoutId={`product-image-${product.slug}`}
                                className="absolute inset-0 h-full w-full overflow-hidden"
                            >
                                <img
                                    src={product.mainImageUrl}
                                    alt={product.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                            </motion.div>
                        )}

                        {/* Favorite */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsFavorite((current) => !current);
                            }}
                            className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
                        >
                            <Heart
                                className="h-[19px] w-[19px] stroke-[1.8]"
                                fill={isFavorite ? "currentColor" : "none"}
                            />
                        </Button>

                        {product.totalStock <= 0 && (
                            <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white">
                                ناموجود
                            </span>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="px-1 pt-2.5">
                        <h3 className="truncate text-[15px] font-medium">
                            {product.title}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5">
                            {discountedPriceLabel ? (
                                <>
                                    <span className="text-[15px] font-bold text-[#c0392b]">
                                        {discountedPriceLabel}
                                    </span>
                                    <span className="text-[12px] text-muted-foreground line-through">
                                        {priceLabel}
                                    </span>
                                </>
                            ) : (
                                <span className="text-[15px] font-bold">
                                    {priceLabel}
                                </span>
                            )}

                            <span className="text-[12px] text-muted-foreground">
                                تومن
                            </span>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </Link>
    );
}

