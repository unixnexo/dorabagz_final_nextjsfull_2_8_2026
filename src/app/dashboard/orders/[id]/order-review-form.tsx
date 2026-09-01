// "use client";

// /**
//  * Review submission form shown directly on a COMPLETED order's detail
//  * page — a second path to review besides the homepage banner
//  * (ReviewPromptBanner), for a user who lands here directly. Both paths
//  * call the same submitReviewAction and are mutually exclusive in
//  * practice (once submitted, getReviewableOrdersAction stops returning
//  * this order, so the homepage banner won't double-prompt for it).
//  */
// import { useState } from "react";
// import { submitReviewAction } from "@/server/review/actions";

// export function OrderReviewForm({ orderId }: { orderId: string }) {
//   const [rating, setRating] = useState(0);
//   const [text, setText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit() {
//     if (rating === 0) return;
//     setError(null);
//     setIsSubmitting(true);
//     const result = await submitReviewAction({ orderId, rating, text: text.trim() || undefined });
//     setIsSubmitting(false);
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     setSubmitted(true);
//   }

//   if (submitted) {
//     return (
//       <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 16 }}>
//         <p style={{ margin: 0 }}>ممنون از نظر شما! 🙏</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 16 }}>
//       <h3 style={{ marginTop: 0 }}>نظر شما درباره این سفارش</h3>

//       <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
//         {[1, 2, 3, 4, 5].map((n) => (
//           <button
//             key={n}
//             onClick={() => setRating(n)}
//             style={{ fontWeight: rating === n ? "bold" : "normal" }}
//           >
//             {n}
//           </button>
//         ))}
//       </div>

//       <textarea
//         placeholder="نظر شما (اختیاری)"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         rows={3}
//         style={{ width: "100%", marginBottom: 8 }}
//       />

//       <button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
//         {isSubmitting ? "در حال ارسال..." : "ثبت نظر"}
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }









"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { submitReviewAction } from "@/server/review/actions";

export function OrderReviewForm({ orderId }: { orderId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="flex items-center gap-3 rounded-[25px] bg-white p-5"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.1 }}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50"
        >
          <CheckCircle2 className="size-6 text-emerald-600" />
        </motion.div>
        <div>
          <p className="text-[14px] font-semibold">ممنون از نظر شما!</p>
          <p className="mt-0.5 text-[12.5px] text-black/40">
            نظر شما به بهتر شدن تجربه دیگران کمک می‌کند.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-[25px] bg-white p-5">
      <h3 className="text-[15px] font-bold">نظر شما درباره این سفارش</h3>
      <p className="mt-1 text-[12.5px] text-black/40">تجربه‌ی خرید خود را با دیگران به اشتراک بگذارید</p>

      <div className="mt-4 flex items-center justify-center gap-1.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= (hoverRating || rating);

          return (
            <motion.button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              whileTap={{ scale: 0.8 }}
              animate={filled ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
              className="p-1"
            >
              <Star
                className={`size-8 transition-colors ${filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-black/20"
                  }`}
              />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {rating > 0 && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-center text-[12.5px] font-medium text-amber-600"
          >
            {RATING_LABELS[rating]}
          </motion.p>
        )}
      </AnimatePresence>

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
    </div>
  );
}

const RATING_LABELS: Record<number, string> = {
  1: "ضعیف",
  2: "متوسط",
  3: "خوب",
  4: "خیلی خوب",
  5: "عالی",
};

