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
            return true;
        } else {
            toast.error(result.error);
            return false;
        }
    }

    async function handleToggleFavorite() {
        if (!currentUser) {
            toast.error("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.");
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

