// "use client";

// /**
//  * ============================================================================
//  * COMPONENT: SiteSatisfactionPopup
//  * ============================================================================
//  * Per your spec, the ONLY trigger point for this popup (for now) is: right
//  * after a user is redirected back from the payment gateway with a
//  * successful payment. Drop this component into the order detail page,
//  * conditioned on the `?success=1` query param.
//  *
//  * Behavior: checks shouldShowSiteSatisfactionPopupAction() on mount — if
//  * true, shows a rating (1-5) + optional text popup. Submitting OR
//  * dismissing it permanently hides it for that user forever, tracked via
//  * the SITE_SATISFACTION popup type.
//  *
//  * TO RETIRE THIS POPUP LATER: flip `SITE_SATISFACTION_POPUP_ENABLED` to
//  * `false` in src/server/review/popup-actions.ts — no other code changes
//  * needed, this component will simply stop rendering itself.
//  * ============================================================================
//  */
// import { useEffect, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X, Sparkles } from "lucide-react";

// import { shouldShowSiteSatisfactionPopupAction, dismissPopupAction } from "@/server/review/popup-actions";
// import { submitSiteSatisfactionAction } from "@/server/review/site-satisfaction-actions";
// import { StarRatingInput } from "@/components/star-rating-input";

// export function SiteSatisfactionPopup() {
//   const [visible, setVisible] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [text, setText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     shouldShowSiteSatisfactionPopupAction().then((result) => {
//       if (result.success && result.data) {
//         // small delay so it doesn't compete with the page's own
//         // entrance animations
//         setTimeout(() => setVisible(true), 500);
//       }
//     });
//   }, []);

//   async function handleDismiss() {
//     setVisible(false);
//     await dismissPopupAction({ popupType: "SITE_SATISFACTION" });
//   }

//   async function handleSubmit() {
//     if (rating === 0) return;
//     setIsSubmitting(true);
//     await submitSiteSatisfactionAction({ rating, text: text.trim() || undefined });
//     setIsSubmitting(false);
//     setVisible(false);
//   }

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           dir="rtl"
//           initial={{ opacity: 0, y: 24, scale: 0.95 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: 16, scale: 0.95 }}
//           transition={{ type: "spring", stiffness: 320, damping: 28 }}
//           className="fixed inset-x-4 bottom-5 z-[200] mx-auto max-w-[360px] overflow-hidden rounded-[26px] bg-white shadow-[0_12px_36px_-8px_rgba(0,0,0,0.25)]"
//         >
//           <div className="relative p-5">
//             <button
//               type="button"
//               onClick={handleDismiss}
//               className="absolute left-4 top-4 flex size-7 items-center justify-center rounded-full bg-[#f1f2f3] text-black/40 transition-transform active:scale-90"
//             >
//               <X className="size-3.5" />
//             </button>

//             <div className="flex items-center gap-2.5 pl-8">
//               <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
//                 <Sparkles className="size-4 text-amber-500" />
//               </div>
//               <p className="text-[13.5px] font-semibold leading-6">
//                 تا این لحظه چقدر از فروشگاه ما راضی بودید؟
//               </p>
//             </div>

//             <div className="mt-4">
//               <StarRatingInput rating={rating} onChange={setRating} size="sm" />
//             </div>

//             <textarea
//               placeholder="نظر شما (اختیاری)"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               rows={2}
//               className="mt-3 w-full resize-none rounded-[16px] bg-[#f1f2f3] px-3.5 py-2.5 text-[13px] outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/10"
//             />

//             <div className="mt-3 flex gap-2">
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={rating === 0 || isSubmitting}
//                 className="h-11 flex-1 rounded-[15px] bg-[#171717] text-[13px] font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-40"
//               >
//                 {isSubmitting ? "در حال ارسال..." : "ارسال"}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleDismiss}
//                 className="h-11 rounded-[15px] bg-[#f1f2f3] px-4 text-[13px] font-medium text-black/55 transition-transform active:scale-[0.97]"
//               >
//                 بستن
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }






"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageSquareText, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

import { submitReviewAction } from "@/server/review/actions";
import { StarRatingInput } from "@/components/star-rating-input";

type ReviewState = "open" | "skipped" | "submitted";

export function OrderReviewForm({ orderId }: { orderId: string }) {
  // Auto-opens on mount — the parent only renders this component when
  // order.status === "COMPLETED" && !order.hasReview, so it's always
  // relevant the moment it shows up.
  const [modalOpen, setModalOpen] = useState(true);
  const [state, setState] = useState<ReviewState>("open");

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("لطفاً امتیاز خود را انتخاب کنید");
      return;
    }

    setIsSubmitting(true);
    const result = await submitReviewAction({ orderId, rating, text: text.trim() || undefined });
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setState("submitted");
    setModalOpen(false);
  }

  function handleSkip() {
    setState("skipped");
    setModalOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {modalOpen && (
          <div
            dir="rtl"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Overlay — intentionally has no onClick, so tapping it
                            does nothing (not freely dismissible, per spec). */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-white"
            >
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-amber-50"
                >
                  <MessageSquareText className="size-6 text-amber-500" />
                </motion.div>

                <h3 className="text-[16px] font-bold">نظر شما درباره این سفارش</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-black/45">
                  تجربه‌ی خرید خود را با دیگران به اشتراک بگذارید
                </p>

                <div className="mt-5">
                  <StarRatingInput rating={rating} onChange={setRating} />
                </div>

                <textarea
                  placeholder="نظر شما (اختیاری)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  className="mt-4 w-full resize-none rounded-[18px] bg-[#f1f2f3] px-4 py-3 text-[13.5px] outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/10"
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                  className="mt-4 h-12 w-full rounded-[16px] bg-[#171717] text-[13.5px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-40"
                >
                  {isSubmitting ? "در حال ارسال..." : "ثبت نظر"}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="mt-2 h-11 w-full text-[13px] font-medium text-black/40"
                >
                  بعداً
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom trigger card — reopens the modal if skipped, or shows a
                confirmation once submitted. */}
      <AnimatePresence mode="wait">
        {state === "skipped" && (
          <motion.button
            key="skipped"
            type="button"
            onClick={() => setModalOpen(true)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full items-center gap-3 rounded-[25px] bg-white p-4 text-right transition-transform active:scale-[0.99]"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-50">
              <MessageSquareText className="size-5 text-amber-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">نظرتون رو ثبت نکردید</p>
              <p className="mt-0.5 text-[12px] text-black/40">برای ثبت نظر بزنید</p>
            </div>
            <ChevronLeft className="size-4 shrink-0 text-black/30" />
          </motion.button>
        )}

        {state === "submitted" && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-[25px] bg-white p-4"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[14px] font-semibold">ممنون از نظر شما!</p>
              <p className="mt-0.5 text-[12px] text-black/40">نظر شما با موفقیت ثبت شد</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}