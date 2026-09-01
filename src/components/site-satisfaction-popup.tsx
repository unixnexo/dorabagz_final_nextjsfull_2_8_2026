"use client";

/**
 * ============================================================================
 * COMPONENT: SiteSatisfactionPopup
 * ============================================================================
 * Per your spec, the ONLY trigger point for this popup (for now) is: right
 * after a user is redirected back from the payment gateway with a
 * successful payment. Drop this component into the order detail page,
 * conditioned on the `?success=1` query param.
 *
 * Behavior: checks shouldShowSiteSatisfactionPopupAction() on mount — if
 * true, shows a rating (1-5) + optional text popup. Submitting OR
 * dismissing it permanently hides it for that user forever, tracked via
 * the SITE_SATISFACTION popup type.
 *
 * TO RETIRE THIS POPUP LATER: flip `SITE_SATISFACTION_POPUP_ENABLED` to
 * `false` in src/server/review/popup-actions.ts — no other code changes
 * needed, this component will simply stop rendering itself.
 * ============================================================================
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";

import { shouldShowSiteSatisfactionPopupAction, dismissPopupAction } from "@/server/review/popup-actions";
import { submitSiteSatisfactionAction } from "@/server/review/site-satisfaction-actions";
import { StarRatingInput } from "@/components/star-rating-input";

export function SiteSatisfactionPopup() {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    shouldShowSiteSatisfactionPopupAction().then((result) => {
      if (result.success && result.data) {
        // small delay so it doesn't compete with the page's own
        // entrance animations
        setTimeout(() => setVisible(true), 500);
      }
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed inset-x-4 bottom-5 z-[200] mx-auto max-w-[360px] overflow-hidden rounded-[26px] bg-white shadow-[0_12px_36px_-8px_rgba(0,0,0,0.25)]"
        >
          <div className="relative p-5">
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute left-4 top-4 flex size-7 items-center justify-center rounded-full bg-[#f1f2f3] text-black/40 transition-transform active:scale-90"
            >
              <X className="size-3.5" />
            </button>

            <div className="flex items-center gap-2.5 pl-8">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
                <Sparkles className="size-4 text-amber-500" />
              </div>
              <p className="text-[13.5px] font-semibold leading-6">
                تا این لحظه چقدر از فروشگاه ما راضی بودید؟
              </p>
            </div>

            <div className="mt-4">
              <StarRatingInput rating={rating} onChange={setRating} size="sm" />
            </div>

            <textarea
              placeholder="نظر شما (اختیاری)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="mt-3 w-full resize-none rounded-[16px] bg-[#f1f2f3] px-3.5 py-2.5 text-[13px] outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/10"
            />

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="h-11 flex-1 rounded-[15px] bg-[#171717] text-[13px] font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-40"
              >
                {isSubmitting ? "در حال ارسال..." : "ارسال"}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="h-11 rounded-[15px] bg-[#f1f2f3] px-4 text-[13px] font-medium text-black/55 transition-transform active:scale-[0.97]"
              >
                بستن
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


