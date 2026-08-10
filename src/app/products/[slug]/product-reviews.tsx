"use client";

/**
 * ============================================================================
 * COMPONENT: ProductReviews
 * ============================================================================
 * Shows paginated APPROVED reviews for a product, per your requested
 * endpoint: getProductReviewsAction({productId, page?, pageSize?}) (see
 * src/server/review/actions.ts) -> PaginatedResult<ProductReviewDTO>
 *   ProductReviewDTO = { id, rating, text, maskedPhoneNumber, createdAt }
 *
 * `maskedPhoneNumber` is already masked server-side (e.g. "0912****789")
 * — the full number is never sent to the client, per your spec.
 * ============================================================================
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductReviewsAction } from "@/server/review/actions";

export function ProductReviews({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["product-reviews", productId, page],
    queryFn: async () => {
      const result = await getProductReviewsAction({ productId, page, pageSize: 10 });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  return (
    <section style={{ marginTop: 32 }}>
      <h2>نظرات کاربران</h2>

      {isLoading && <p>در حال بارگذاری...</p>}
      {data && data.items.length === 0 && <p>هنوز نظری برای این محصول ثبت نشده است.</p>}

      {data && data.items.length > 0 && (
        <>
          {data.items.map((review) => (
            <div key={review.id} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
              <p style={{ margin: 0 }}>
                <strong>{"★".repeat(review.rating)}</strong>{" "}
                <span style={{ color: "#888", fontSize: 13 }}>{review.maskedPhoneNumber}</span>
              </p>
              {review.text && <p style={{ margin: "4px 0" }}>{review.text}</p>}
              <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
                {new Date(review.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          ))}

          <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              قبلی
            </button>
            <span>
              صفحه {data.page} از {data.totalPages}
            </span>
            <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
              بعدی
            </button>
          </div>
        </>
      )}
    </section>
  );
}
