"use client";

/**
 * Review submission form shown directly on a COMPLETED order's detail
 * page — a second path to review besides the homepage banner
 * (ReviewPromptBanner), for a user who lands here directly. Both paths
 * call the same submitReviewAction and are mutually exclusive in
 * practice (once submitted, getReviewableOrdersAction stops returning
 * this order, so the homepage banner won't double-prompt for it).
 */
import { useState } from "react";
import { submitReviewAction } from "@/server/review/actions";

export function OrderReviewForm({ orderId }: { orderId: string }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (rating === 0) return;
    setError(null);
    setIsSubmitting(true);
    const result = await submitReviewAction({ orderId, rating, text: text.trim() || undefined });
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 16 }}>
        <p style={{ margin: 0 }}>ممنون از نظر شما! 🙏</p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>نظر شما درباره این سفارش</h3>

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
        rows={3}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
        {isSubmitting ? "در حال ارسال..." : "ثبت نظر"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
