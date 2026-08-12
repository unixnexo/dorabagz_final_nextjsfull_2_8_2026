"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { toggleFavoriteAction } from "@/server/favorite/actions";
import type { ProductDetailDTO } from "@/types/product";
import type { UserDTO } from "@/types/user";

/**
 * Variant picker + add-to-cart/favorite buttons.
 *
 * Add-to-cart works for BOTH logged-in and guest users (see useCart —
 * guests get written to the Zustand localStorage store, logged-in users
 * get written straight to the DB).
 *
 * Add-to-favorite requires login (favorites were never spec'd as a guest
 * feature) — if a guest clicks it, they're told to log in.
 */
export function ProductActions({
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
  const [message, setMessage] = useState<string | null>(null);
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

  async function handleAddToCart() {
    if (!selectedVariant) return;
    setMessage(null);
    const result = await addToCart(selectedVariant.id, quantity);
    setMessage(result.success ? "به سبد خرید اضافه شد." : result.error);
  }

  async function handleToggleFavorite() {
    if (!currentUser) {
      setMessage("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.");
      return;
    }
    const result = await toggleFavoriteAction({ productId: product.id });
    if (result.success) {
      setIsFavorited(result.data.isFavorited);
    } else {
      setMessage(result.error);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      {product.options.map((option) => (
        <div key={option.id} style={{ marginBottom: 8 }}>
          <label>{option.name}: </label>
          <select
            value={selected[option.name] ?? ""}
            onChange={(e) => setSelected((prev) => ({ ...prev, [option.name]: e.target.value }))}
          >
            <option value="">انتخاب کنید</option>
            {option.values.map((v) => (
              <option key={v.id} value={v.value}>
                {v.value}
              </option>
            ))}
          </select>
        </div>
      ))}

      {selectedVariant ? (
        <div>
          <p>
            {selectedVariant.hasDiscount ? (
              <>
                <span style={{ textDecoration: "line-through", color: "#999", marginLeft: 8 }}>
                  {selectedVariant.price.toLocaleString("fa-IR")} تومان
                </span>
                <span style={{ color: "#c0392b", fontWeight: "bold" }}>
                  {selectedVariant.discountedPrice.toLocaleString("fa-IR")} تومان
                </span>
              </>
            ) : (
              <>قیمت: {selectedVariant.price.toLocaleString("fa-IR")} تومان</>
            )}
            {" | "}موجودی: {selectedVariant.stock}
          </p>

          <input
            type="number"
            min={1}
            max={selectedVariant.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(selectedVariant.stock, Number(e.target.value))))}
            style={{ width: 60 }}
          />

          <button disabled={selectedVariant.stock === 0} onClick={handleAddToCart} style={{ marginRight: 8 }}>
            افزودن به سبد خرید
          </button>

          <button onClick={handleToggleFavorite} style={{ marginRight: 8 }}>
            {isFavorited ? "❤ حذف از علاقه‌مندی‌ها" : "🤍 افزودن به علاقه‌مندی‌ها"}
          </button>
        </div>
      ) : (
        product.options.length > 0 && <p>لطفاً همه گزینه‌ها را انتخاب کنید</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
