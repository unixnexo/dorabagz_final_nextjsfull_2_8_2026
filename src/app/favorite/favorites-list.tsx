"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listFavoritesAction,
  removeFavoriteAction,
  clearFavoritesAction,
} from "@/server/favorite/actions";

export function FavoritesList() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const result = await listFavoritesAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  async function handleRemove(favoriteId: string) {
    await removeFavoriteAction(favoriteId);
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  }

  async function handleClearAll() {
    if (!confirm("همه علاقه‌مندی‌ها حذف شوند؟")) return;
    await clearFavoritesAction();
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  }

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (isError) return <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>;
  if (!data || data.length === 0) return <p>هیچ محصولی به علاقه‌مندی‌ها اضافه نشده است.</p>;

  return (
    <div>
      <button onClick={handleClearAll} style={{ marginBottom: 16 }}>
        حذف همه
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {data.map((fav) => (
          <div key={fav.id} style={{ border: "1px solid #ddd", padding: 12 }}>
            <Link href={`/products/${fav.productSlug}`}>
              {fav.mainImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fav.mainImageUrl}
                  alt={fav.productTitle}
                  style={{ width: "100%", height: 140, objectFit: "cover" }}
                />
              )}
              <p>{fav.productTitle}</p>
              <p>
                {fav.minPrice === fav.maxPrice
                  ? `${fav.minPrice.toLocaleString("fa-IR")} تومان`
                  : `${fav.minPrice.toLocaleString("fa-IR")} - ${fav.maxPrice.toLocaleString("fa-IR")} تومان`}
              </p>
              <p>{fav.totalStock > 0 ? `موجودی: ${fav.totalStock}` : "ناموجود"}</p>
            </Link>
            <button onClick={() => handleRemove(fav.id)}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
