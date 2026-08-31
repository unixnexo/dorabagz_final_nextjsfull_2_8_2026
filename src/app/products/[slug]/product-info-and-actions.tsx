"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toggleFavoriteAction } from "@/server/favorite/actions";
import { VariantPicker } from "./variant-picker";
import { ProductPrice } from "./product-price";
import { QuantityStepper } from "./quantity-stepper";
import { FavoriteButton } from "./favorite-button";
import type { ProductDetailDTO } from "@/types/product";
import type { UserDTO } from "@/types/user";

/**
 * Title + price + variant picker + qty + add-to-cart + favorite toggle.
 *
 * Add-to-cart works for BOTH logged-in and guest users (see useCart — guests
 * get written to the Zustand localStorage store, logged-in users get
 * written straight to the DB).
 * Add-to-favorite requires login — a guest clicking it is told to log in.
 */
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
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    const { addToCart } = useCart(currentUser);

    const selectedVariant = useMemo(() => {
        if (product.options.length === 0) {
            return product.variants[0] ?? null;
        }
        if (Object.keys(selected).length !== product.options.length) return null;

        return (
            product.variants.find((variant) =>
                product.options.every((opt) => variant.optionValues[opt.name] === selected[opt.name])
            ) ?? null
        );
    }, [selected, product]);

    function handleOptionChange(optionName: string, value: string) {
        setSelected((prev) => ({ ...prev, [optionName]: value }));
        setQuantity(1);
    }

    async function handleAddToCart() {
        if (!selectedVariant) {
            toast.error("لطفاً همه گزینه‌ها را انتخاب کنید.");
            return;
        }
        setIsAddingToCart(true);
        try {
            const result = await addToCart(selectedVariant.id, quantity);
            if (result.success) {
                toast.success("به سبد خرید اضافه شد.");
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsAddingToCart(false);
        }
    }

    async function handleToggleFavorite() {
        if (!currentUser) {
            toast.error("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.");
            return;
        }
        setIsTogglingFavorite(true);
        try {
            const result = await toggleFavoriteAction({ productId: product.id });
            if (result.success) {
                setIsFavorited(result.data.isFavorited);
                toast.success(result.data.isFavorited ? "به علاقه‌مندی‌ها اضافه شد." : "از علاقه‌مندی‌ها حذف شد.");
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsTogglingFavorite(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold leading-tight text-foreground">{product.title}</h1>

                <ProductPrice variants={product.variants} selectedVariant={selectedVariant} />

                {selectedVariant && (
                    <p className="text-sm text-muted-foreground">موجودی: {selectedVariant.stock.toLocaleString("fa-IR")}</p>
                )}
            </div>

            <div className="flex flex-row gap-3">
                <FavoriteButton isFavorited={isFavorited} onToggle={handleToggleFavorite} disabled={isTogglingFavorite} />

                <VariantPicker options={product.options} selected={selected} onChange={handleOptionChange} />
            </div>

            {product.options.length > 0 && !selectedVariant && (
                <p className="text-sm text-muted-foreground">لطفاً همه گزینه‌ها را انتخاب کنید</p>
            )}

            {selectedVariant && (
                <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">تعداد</span>
                    <QuantityStepper
                        value={quantity}
                        max={selectedVariant.stock}
                        onChange={(next) => setQuantity(Math.max(1, Math.min(selectedVariant.stock, next)))}
                    />
                </div>
            )}

            <Button
                className="w-full"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0 || isAddingToCart}
            >
                {selectedVariant?.stock === 0 ? "ناموجود" : "افزودن به سبد خرید"}
            </Button>
        </div>
    );
}