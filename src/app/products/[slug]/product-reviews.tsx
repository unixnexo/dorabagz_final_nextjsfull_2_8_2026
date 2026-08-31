// "use client";

// /**
//  * ============================================================================
//  * COMPONENT: ProductReviews
//  * ============================================================================
//  * Shows paginated APPROVED reviews for a product, per your requested
//  * endpoint: getProductReviewsAction({productId, page?, pageSize?}) (see
//  * src/server/review/actions.ts) -> PaginatedResult<ProductReviewDTO>
//  *   ProductReviewDTO = { id, rating, text, maskedPhoneNumber, createdAt }
//  *
//  * `maskedPhoneNumber` is already masked server-side (e.g. "0912****789")
//  * — the full number is never sent to the client, per your spec.
//  * ============================================================================
//  */
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getProductReviewsAction } from "@/server/review/actions";

// export function ProductReviews({ productId }: { productId: string }) {
//   const [page, setPage] = useState(1);

//   const { data, isLoading } = useQuery({
//     queryKey: ["product-reviews", productId, page],
//     queryFn: async () => {
//       const result = await getProductReviewsAction({ productId, page, pageSize: 10 });
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   return (
//     <section style={{ marginTop: 32 }}>
//       <h2>نظرات کاربران</h2>

//       {isLoading && <p>در حال بارگذاری...</p>}
//       {data && data.items.length === 0 && <p>هنوز نظری برای این محصول ثبت نشده است.</p>}

//       {data && data.items.length > 0 && (
//         <>
//           {data.items.map((review) => (
//             <div key={review.id} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
//               <p style={{ margin: 0 }}>
//                 <strong>{"★".repeat(review.rating)}</strong>{" "}
//                 <span style={{ color: "#888", fontSize: 13 }}>{review.maskedPhoneNumber}</span>
//               </p>
//               {review.text && <p style={{ margin: "4px 0" }}>{review.text}</p>}
//               <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
//                 {new Date(review.createdAt).toLocaleDateString("fa-IR")}
//               </p>
//             </div>
//           ))}

//           <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
//             <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
//               قبلی
//             </button>
//             <span>
//               صفحه {data.page} از {data.totalPages}
//             </span>
//             <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
//               بعدی
//             </button>
//           </div>
//         </>
//       )}
//     </section>
//   );
// }









"use client";

/**
 * ============================================================================
 * COMPONENT: ProductReviews
 * ============================================================================
 * Shows paginated APPROVED reviews for a product:
 * getProductReviewsAction({productId, page?, pageSize?}) (see
 * src/server/review/actions.ts) -> PaginatedResult<ProductReviewDTO>
 *   ProductReviewDTO = { id, rating, text, maskedPhoneNumber, createdAt }
 *
 * `maskedPhoneNumber` is already masked server-side (e.g. "0912****789")
 * — the full number is never sent to the client.
 *
 * Meant to be rendered as the content of the "نظرات کاربران" accordion tab.
 * The accordion trigger itself shows the average rating + count (see
 * ProductAccordion) from ProductDetailDTO fields — this component only
 * renders the review list + pagination, no fake summary UI.
 * ============================================================================
 */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { getProductReviewsAction } from "@/server/review/actions";

export function ProductReviews({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product-reviews", productId, page],
    queryFn: async () => {
      const result = await getProductReviewsAction({ productId, page, pageSize: 10 });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  useEffect(() => {
    if (isError) toast.error(error instanceof Error ? error.message : "خطا در دریافت نظرات");
  }, [isError, error]);

  if (isLoading) {
    return <p className="py-4 text-sm text-muted-foreground">در حال بارگذاری...</p>;
  }

  if (!data || data.items.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">هنوز نظری برای این محصول ثبت نشده است.</p>;
  }

  return (
    <div className="space-y-3">
      {data.items.map((review) => (
        <div key={review.id} className="rounded-3xl border border-border/60 bg-card/60 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground" dir="ltr">{review.maskedPhoneNumber}</span>

            <div className="flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-1" dir="ltr">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-3.5 w-3.5 ${
                    index < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25"
                  }`}
                />
              ))}
            </div>
          </div>

          {review.text && <p className="text-sm leading-7 text-muted-foreground">{review.text}</p>}

          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
      ))}

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            className="text-sm text-primary disabled:text-muted-foreground disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            قبلی
          </button>
          <span className="text-xs text-muted-foreground">
            صفحه {data.page} از {data.totalPages}
          </span>
          <button
            className="text-sm text-primary disabled:text-muted-foreground disabled:opacity-50"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
