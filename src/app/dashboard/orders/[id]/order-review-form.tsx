// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Star, CheckCircle2 } from "lucide-react";
// import toast from "react-hot-toast";

// import { submitReviewAction } from "@/server/review/actions";

// export function OrderReviewForm({ orderId }: { orderId: string }) {
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [text, setText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   async function handleSubmit() {
//     if (rating === 0) {
//       toast.error("لطفاً امتیاز خود را انتخاب کنید");
//       return;
//     }

//     setIsSubmitting(true);
//     const result = await submitReviewAction({ orderId, rating, text: text.trim() || undefined });
//     setIsSubmitting(false);

//     if (!result.success) {
//       toast.error(result.error);
//       return;
//     }

//     setSubmitted(true);
//   }

//   if (submitted) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ type: "spring", stiffness: 300, damping: 22 }}
//         className="flex items-center gap-3 rounded-[25px] bg-white p-5"
//       >
//         <motion.div
//           initial={{ scale: 0, rotate: -20 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.1 }}
//           className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50"
//         >
//           <CheckCircle2 className="size-6 text-emerald-600" />
//         </motion.div>
//         <div>
//           <p className="text-[14px] font-semibold">ممنون از نظر شما!</p>
//           <p className="mt-0.5 text-[12.5px] text-black/40">
//             نظر شما به بهتر شدن تجربه دیگران کمک می‌کند.
//           </p>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="rounded-[25px] bg-white p-5">
//       <h3 className="text-[15px] font-bold">نظر شما درباره این سفارش</h3>
//       <p className="mt-1 text-[12.5px] text-black/40">تجربه‌ی خرید خود را با دیگران به اشتراک بگذارید</p>

//       <div className="mt-4 flex items-center justify-center gap-1.5" dir="ltr">
//         {[1, 2, 3, 4, 5].map((n) => {
//           const filled = n <= (hoverRating || rating);

//           return (
//             <motion.button
//               key={n}
//               type="button"
//               onClick={() => setRating(n)}
//               onMouseEnter={() => setHoverRating(n)}
//               onMouseLeave={() => setHoverRating(0)}
//               whileTap={{ scale: 0.8 }}
//               animate={filled ? { scale: [1, 1.25, 1] } : { scale: 1 }}
//               transition={{ duration: 0.25 }}
//               className="p-1"
//             >
//               <Star
//                 className={`size-8 transition-colors ${filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-black/20"
//                   }`}
//               />
//             </motion.button>
//           );
//         })}
//       </div>

//       <AnimatePresence>
//         {rating > 0 && (
//           <motion.p
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="mt-2 text-center text-[12.5px] font-medium text-amber-600"
//           >
//             {RATING_LABELS[rating]}
//           </motion.p>
//         )}
//       </AnimatePresence>

//       <textarea
//         placeholder="نظر شما (اختیاری)"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         rows={3}
//         className="mt-4 w-full resize-none rounded-[18px] bg-[#f1f2f3] px-4 py-3 text-[13.5px] outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/10"
//       />

//       <button
//         type="button"
//         onClick={handleSubmit}
//         disabled={rating === 0 || isSubmitting}
//         className="mt-4 h-12 w-full rounded-[16px] bg-[#171717] text-[13.5px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-40"
//       >
//         {isSubmitting ? "در حال ارسال..." : "ثبت نظر"}
//       </button>
//     </div>
//   );
// }

// const RATING_LABELS: Record<number, string> = {
//   1: "ضعیف",
//   2: "متوسط",
//   3: "خوب",
//   4: "خیلی خوب",
//   5: "عالی",
// };










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

