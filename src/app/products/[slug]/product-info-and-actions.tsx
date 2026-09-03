// "use client";

// import { useMemo, useState } from "react";
// import toast from "react-hot-toast";
// import { useCart } from "@/hooks/use-cart";
// import { toggleFavoriteAction } from "@/server/favorite/actions";
// import { VariantPicker } from "./variant-picker";
// import { ProductPrice } from "./product-price";
// import { QuantityStepper } from "./quantity-stepper";
// import { FavoriteButton } from "./favorite-button";
// import { AddToCartButton } from "./add-to-cart-button";
// import type { ProductDetailDTO } from "@/types/product";
// import type { UserDTO } from "@/types/user";

// export function ProductInfoAndActions({
//     product,
//     currentUser,
//     initiallyFavorited,
// }: {
//     product: ProductDetailDTO;
//     currentUser: UserDTO | null;
//     initiallyFavorited: boolean;
// }) {
//     const [selected, setSelected] = useState<Record<string, string>>({});
//     const [quantity, setQuantity] = useState(1);
//     const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
//     const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

//     const { addToCart } = useCart(currentUser);

//     const selectedVariant = useMemo(() => {
//         // Products without options have a single default variant.
//         if (product.options.length === 0) {
//             return product.variants[0] ?? null;
//         }

//         if (Object.keys(selected).length !== product.options.length) {
//             return null;
//         }

//         return (
//             product.variants.find((variant) =>
//                 product.options.every(
//                     (opt) =>
//                         variant.optionValues[opt.name] === selected[opt.name]
//                 )
//             ) ?? null
//         );
//     }, [selected, product]);

//     function handleOptionChange(optionName: string, value: string) {
//         setSelected((prev) => ({
//             ...prev,
//             [optionName]: value,
//         }));
//         setQuantity(1);
//     }

//     // Returns true/false so AddToCartButton knows whether to play its
//     // success animation. Toast intentionally disabled per request — the
//     // button's own animation is the feedback now. Left commented out
//     // (not removed) in case we want it back as a secondary confirmation.
//     async function handleAddToCart(): Promise<boolean> {
//         if (!selectedVariant) {
//             toast.error("لطفاً همه گزینه‌ها را انتخاب کنید.");
//             return false;
//         }

//         const result = await addToCart(selectedVariant.id, quantity);

//         if (result.success) {
//             // toast.success("به سبد خرید اضافه شد.");
//             return true;
//         } else {
//             toast.error(result.error);
//             return false;
//         }
//     }

//     async function handleToggleFavorite() {
//         if (!currentUser) {
//             toast.error("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.");
//             return;
//         }

//         setIsTogglingFavorite(true);

//         try {
//             const result = await toggleFavoriteAction({
//                 productId: product.id,
//             });

//             if (result.success) {
//                 setIsFavorited(result.data.isFavorited);

//                 // toast.success(
//                 //     result.data.isFavorited
//                 //         ? "به علاقه‌مندی‌ها اضافه شد."
//                 //         : "از علاقه‌مندی‌ها حذف شد."
//                 // );
//             } else {
//                 toast.error(result.error);
//             }
//         } finally {
//             setIsTogglingFavorite(false);
//         }
//     }

//     const hasOptions = product.options.length > 0;

//     return (
//         <div className="space-y-6">
//             <div className="space-y-2">
//                 <h1 className="text-3xl font-bold leading-tight text-foreground">
//                     {product.title}
//                 </h1>

//                 <ProductPrice
//                     variants={product.variants}
//                     selectedVariant={selectedVariant}
//                 />

//                 {selectedVariant && (
//                     <p className="text-sm text-muted-foreground">
//                         موجودی:{" "}
//                         {selectedVariant.stock.toLocaleString("fa-IR")}
//                     </p>
//                 )}
//             </div>

//             <div className="flex flex-row items-center gap-3">
//                 <FavoriteButton
//                     isFavorited={isFavorited}
//                     onToggle={handleToggleFavorite}
//                     disabled={isTogglingFavorite}
//                 />

//                 {hasOptions ? (
//                     <VariantPicker
//                         options={product.options}
//                         selected={selected}
//                         onChange={handleOptionChange}
//                     />
//                 ) : (
//                     selectedVariant && (
//                         <QuantityStepper
//                             value={quantity}
//                             max={selectedVariant.stock}
//                             onChange={(next) =>
//                                 setQuantity(
//                                     Math.max(
//                                         1,
//                                         Math.min(
//                                             selectedVariant.stock,
//                                             next
//                                         )
//                                     )
//                                 )
//                             }
//                         />
//                     )
//                 )}
//             </div>

//             {hasOptions && !selectedVariant && (
//                 <p className="text-sm text-muted-foreground">
//                     لطفاً همه گزینه‌ها را انتخاب کنید
//                 </p>
//             )}

//             {hasOptions && selectedVariant && (
//                 <div className="space-y-2">
//                     <span className="text-sm text-muted-foreground">
//                         تعداد
//                     </span>

//                     <QuantityStepper
//                         value={quantity}
//                         max={selectedVariant.stock}
//                         onChange={(next) =>
//                             setQuantity(
//                                 Math.max(
//                                     1,
//                                     Math.min(
//                                         selectedVariant.stock,
//                                         next
//                                     )
//                                 )
//                             )
//                         }
//                     />
//                 </div>
//             )}

//             <AddToCartButton
//                 onAddToCart={handleAddToCart}
//                 disabled={!selectedVariant}
//                 outOfStock={selectedVariant?.stock === 0}
//             />
//         </div>
//     );
// }
















"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/use-cart";
import { toggleFavoriteAction } from "@/server/favorite/actions";
import { VariantPicker } from "./variant-picker";
import { ProductPrice } from "./product-price";
import { QuantityStepper } from "./quantity-stepper";
import { FavoriteButton } from "./favorite-button";
import { AddToCartButton } from "./add-to-cart-button";
import { ShareButton } from "./share-button";
import { ProductCode } from "./product-code";
import type { ProductDetailDTO } from "@/types/product";
import type { UserDTO } from "@/types/user";
import { Check, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export function ProductInfoAndActions({
    product,
    currentUser,
    initiallyFavorited,
}: {
    product: ProductDetailDTO;
    currentUser: UserDTO | null;
    initiallyFavorited: boolean;
}) {
    const [selected, setSelected] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);
    const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    const { addToCart } = useCart(currentUser);

    const selectedVariant = useMemo(() => {
        // Products without options have a single default variant.
        if (product.options.length === 0) {
            return product.variants[0] ?? null;
        }

        if (Object.keys(selected).length !== product.options.length) {
            return null;
        }

        return (
            product.variants.find((variant) =>
                product.options.every(
                    (opt) =>
                        variant.optionValues[opt.name] === selected[opt.name]
                )
            ) ?? null
        );
    }, [selected, product]);

    function handleOptionChange(optionName: string, value: string) {
        setSelected((prev) => ({
            ...prev,
            [optionName]: value,
        }));
        setQuantity(1);
    }

    function showCartSuccessToast() {
        toast.custom(
            (t) => (
                <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.94 }}
                    animate={{
                        opacity: t.visible ? 1 : 0,
                        y: t.visible ? 0 : 8,
                        scale: t.visible ? 1 : 0.96,
                    }}
                    transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative w-full min-w-[300px] overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#1C1C1E] p-4 text-white shadow-[0_14px_45px_rgba(0,0,0,0.25)]"
                >
                    {/* Shine */}
                    <motion.div
                        initial={{ x: "-120%" }}
                        animate={{ x: "140%" }}
                        transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            delay: 0.15,
                        }}
                        className="pointer-events-none absolute inset-y-0 w-20 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
                    />

                    <div className="relative">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.1]">
                                <Check
                                    className="size-5 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>

                            <div className="min-w-0 flex-1 text-right">
                                <p className="text-[14px] font-semibold">
                                    به سبد خرید اضافه شد
                                </p>

                                <p className="mt-0.5 text-[12px] text-white/55">
                                    محصول با موفقیت به سبد خرید شما اضافه شد.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                toast.dismiss(t.id);
                                window.location.href = "/cart";
                            }}
                            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-[13px] font-bold text-[#1C1C1E] transition-transform duration-150 active:scale-[0.97]"
                        >
                            <ShoppingBag className="size-4" strokeWidth={2.2} />
                            رفتن به سبد خرید
                        </button>
                    </div>
                </motion.div>
            ),
            {
                duration: 5000,
            }
        );
    }


    // Returns true/false so AddToCartButton knows whether to play its
    // success animation. Toast intentionally disabled per request — the
    // button's own animation is the feedback now. Left commented out
    // (not removed) in case we want it back as a secondary confirmation.
    async function handleAddToCart(): Promise<boolean> {
        if (!selectedVariant) {
            toast.error("لطفاً همه گزینه‌ها را انتخاب کنید.");
            return false;
        }

        const result = await addToCart(selectedVariant.id, quantity);

        if (result.success) {
            // toast.success("به سبد خرید اضافه شد.");
            showCartSuccessToast();
            return true;
        } else {
            toast.error(result.error);
            return false;
        }
    }

    async function handleToggleFavorite() {
        if (!currentUser) {
            // toast.error("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.");
            toast.custom(
                (t) => (
                    <div
                        className={`w-full min-w-[280px] rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out ${t.visible
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-2 scale-95 opacity-0"
                            }`}
                    >
                        <div className="text-center">
                            <p className="text-[14px] font-medium leading-6 text-[#1C1C1E]">
                                برای افزودن به علاقه‌مندی‌ها
                            </p>

                            <p className="text-[13px] leading-6 text-[#8E8E93]">
                                ابتدا وارد حساب کاربری خود شوید.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                toast.dismiss(t.id);
                                window.location.href = "/login";
                            }}
                            className="mt-3 h-11 w-full rounded-full bg-[#1C1C1E] text-[14px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
                        >
                            ورود
                        </button>
                    </div>
                ),
                {
                    duration: 5000,
                }
            );

            return;
        }

        setIsTogglingFavorite(true);

        try {
            const result = await toggleFavoriteAction({
                productId: product.id,
            });

            if (result.success) {
                setIsFavorited(result.data.isFavorited);

                // toast.success(
                //     result.data.isFavorited
                //         ? "به علاقه‌مندی‌ها اضافه شد."
                //         : "از علاقه‌مندی‌ها حذف شد."
                // );
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsTogglingFavorite(false);
        }
    }

    const hasOptions = product.options.length > 0;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                    <h1 className="text-3xl font-bold leading-tight text-foreground">
                        {product.title}
                    </h1>

                    <ShareButton
                        title={product.title}
                        url={typeof window !== "undefined" ? window.location.href : ""}
                    />
                </div>

                <ProductCode code={product.productCode} />

                <ProductPrice
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                />

                {selectedVariant && (
                    <p className="text-sm text-muted-foreground">
                        موجودی:{" "}
                        {selectedVariant.stock.toLocaleString("fa-IR")}
                    </p>
                )}
            </div>

            <div className="flex flex-row items-center gap-3">
                <FavoriteButton
                    isFavorited={isFavorited}
                    onToggle={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                />

                {hasOptions ? (
                    <VariantPicker
                        options={product.options}
                        selected={selected}
                        onChange={handleOptionChange}
                    />
                ) : (
                    selectedVariant && (
                        <QuantityStepper
                            value={quantity}
                            max={selectedVariant.stock}
                            onChange={(next) =>
                                setQuantity(
                                    Math.max(
                                        1,
                                        Math.min(
                                            selectedVariant.stock,
                                            next
                                        )
                                    )
                                )
                            }
                        />
                    )
                )}
            </div>

            {hasOptions && !selectedVariant && (
                <p className="text-sm text-muted-foreground">
                    لطفاً همه گزینه‌ها را انتخاب کنید
                </p>
            )}

            {hasOptions && selectedVariant && (
                <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">
                        تعداد
                    </span>

                    <QuantityStepper
                        value={quantity}
                        max={selectedVariant.stock}
                        onChange={(next) =>
                            setQuantity(
                                Math.max(
                                    1,
                                    Math.min(
                                        selectedVariant.stock,
                                        next
                                    )
                                )
                            )
                        }
                    />
                </div>
            )}

            <AddToCartButton
                onAddToCart={handleAddToCart}
                disabled={!selectedVariant}
                outOfStock={selectedVariant?.stock === 0}
            />
        </div>
    );
}

