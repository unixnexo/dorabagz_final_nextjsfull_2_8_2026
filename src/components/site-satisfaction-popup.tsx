"use client";

/**
 * ============================================================================
 * COMPONENT: SiteSatisfactionPopup
 * ============================================================================
 * Per your spec, the ONLY trigger point for this popup (for now) is: right
 * after a user is redirected back from the payment gateway with a
 * successful payment. Drop this component into the order detail page,
 * conditioned on the `?success=1` query param (see
 * src/app/dashboard/orders/[id]/page.tsx from Module 4).
 *
 * Behavior: checks shouldShowSiteSatisfactionPopupAction() on mount — if
 * true, shows a rating (1-5) + optional text popup. Submitting OR
 * dismissing it permanently hides it for that user forever (per your
 * spec), tracked via the SITE_SATISFACTION popup type (separate from the
 * order-review prompt's dismissal tracking).
 *
 * TO RETIRE THIS POPUP LATER (per your "remove after 2 months" ask): flip
 * `SITE_SATISFACTION_POPUP_ENABLED` to `false` in
 * src/server/review/popup-actions.ts — no other code changes needed, this
 * component will simply stop rendering itself.
 * ============================================================================
 */
import { useEffect, useState } from "react";
import { shouldShowSiteSatisfactionPopupAction, dismissPopupAction } from "@/server/review/popup-actions";
import { submitSiteSatisfactionAction } from "@/server/review/site-satisfaction-actions";

export function SiteSatisfactionPopup() {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    shouldShowSiteSatisfactionPopupAction().then((result) => {
      if (result.success && result.data) setVisible(true);
    });
  }, []);

  async function handleDismiss() {
    setVisible(false);
    await dismissPopupAction({ popupType: "SITE_SATISFACTION" });
  }

  async function handleSubmit() {
    if (rating === 0) return;
    setIsSubmitting(true);
    await submitSiteSatisfactionAction({ rating, text: text.trim() || undefined });
    setIsSubmitting(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        background: "#fff",
        border: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        padding: 16,
        maxWidth: 320,
        fontFamily: "sans-serif",
        zIndex: 1000,
      }}
    >
      <p style={{ margin: "0 0 8px" }}>تا این لحظه چقدر از فروشگاه ما راضی بودید؟</p>

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
        <button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
          {isSubmitting ? "در حال ارسال..." : "ارسال"}
        </button>
        <button onClick={handleDismiss}>بستن</button>
      </div>
    </div>
  );
}
