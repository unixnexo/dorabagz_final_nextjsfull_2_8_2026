"use client";

/**
 * ============================================================================
 * COMPONENT: ReviewPromptBanner
 * ============================================================================
 * Checks getReviewableOrdersAction() on mount — if the user has any
 * COMPLETED orders without a review yet (and hasn't dismissed this prompt
 * before, per src/server/review/actions.ts), shows a small banner asking
 * them to review one. Drop this anywhere you want the nudge to appear —
 * per your spec you weren't sure where exactly, so it's built as a
 * self-contained, drop-in-anywhere component. Currently placed on the
 * home page (src/app/page.tsx) as a reasonable default; move/duplicate
 * it elsewhere freely, it works the same anywhere.
 *
 * Submitting a rating right here goes straight to submitReviewAction —
 * no need to visit the order page separately, though the order detail
 * page (Module 4) is also a valid place to review from.
 * ============================================================================
 */
import { useEffect, useState } from "react";
import { getReviewableOrdersAction, submitReviewAction } from "@/server/review/actions";
import { dismissPopupAction } from "@/server/review/popup-actions";
import type { ReviewableOrderDTO } from "@/types/review";

export function ReviewPromptBanner() {
  const [reviewableOrders, setReviewableOrders] = useState<ReviewableOrderDTO[] | null>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getReviewableOrdersAction().then((result) => {
      if (result.success) setReviewableOrders(result.data);
    });
  }, []);

  async function handleDismiss() {
    setReviewableOrders([]);
    await dismissPopupAction({ popupType: "ORDER_REVIEW_PROMPT" });
  }

  async function handleSubmit(orderId: string) {
    if (rating === 0) return;
    setIsSubmitting(true);
    const result = await submitReviewAction({ orderId, rating, text: text.trim() || undefined });
    setIsSubmitting(false);
    if (result.success) setSubmitted(true);
  }

  if (!reviewableOrders || reviewableOrders.length === 0) return null;

  const order = reviewableOrders[0]; // prompt for the most recently completed order

  if (submitted) {
    return (
      <div dir="rtl" style={{ border: "1px solid #ddd", padding: 12, margin: "16px 0" }}>
        ممنون از نظر شما! 🙏
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ border: "1px solid #ddd", padding: 12, margin: "16px 0" }}>
      <p style={{ margin: "0 0 8px" }}>
        سفارش شما ({order.productTitles.join("، ")}) تحویل داده شد. چقدر از آن راضی بودید؟
      </p>

      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            style={{ fontWeight: rating === n ? "bold" : "normal" }}
          >
            {n}
          </button>
        ))}
      </div>

      <textarea
        placeholder="نظر شما (اختیاری)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => handleSubmit(order.orderId)} disabled={rating === 0 || isSubmitting}>
          {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
        </button>
        <button onClick={handleDismiss}>دیگر نشان نده</button>
      </div>
    </div>
  );
}
