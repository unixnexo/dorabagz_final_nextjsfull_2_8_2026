"use client";

import { useMemo, useState } from "react";
import type { ProductDetailDTO } from "@/types/product";

/**
 * Variant picker + add-to-cart/favorite buttons. Cart/Favorites modules
 * don't exist yet, so those two actions are stubbed with console.log —
 * this component's job for now is just to prove the variant-matching
 * logic works, which the Cart module will reuse as-is.
 */
export function ProductActions({ product }: { product: ProductDetailDTO }) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const selectedVariant = useMemo(() => {
    if (product.options.length === 0) {
      return product.variants[0] ?? null;
    }
    // Only match once every option has a selected value.
    if (Object.keys(selected).length !== product.options.length) return null;

    return (
      product.variants.find((variant) =>
        product.options.every((opt) => variant.optionValues[opt.name] === selected[opt.name])
      ) ?? null
    );
  }, [selected, product]);

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
            قیمت: {selectedVariant.price.toLocaleString("fa-IR")} تومان | موجودی:{" "}
            {selectedVariant.stock}
          </p>
          <button
            disabled={selectedVariant.stock === 0}
            onClick={() => console.log("TODO cart module: add variant", selectedVariant.id)}
          >
            افزودن به سبد خرید
          </button>
          <button
            onClick={() => console.log("TODO favorites module: toggle product", product.id)}
            style={{ marginRight: 8 }}
          >
            افزودن به علاقه‌مندی‌ها
          </button>
        </div>
      ) : (
        product.options.length > 0 && <p>لطفاً همه گزینه‌ها را انتخاب کنید</p>
      )}
    </div>
  );
}
