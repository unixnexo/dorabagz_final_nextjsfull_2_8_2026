"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const RATING_LABELS: Record<number, string> = {
    1: "ضعیف",
    2: "متوسط",
    3: "خوب",
    4: "خیلی خوب",
    5: "عالی",
};

type StarRatingInputProps = {
    rating: number;
    onChange: (value: number) => void;
    size?: "sm" | "md";
};

export function StarRatingInput({ rating, onChange, size = "md" }: StarRatingInputProps) {
    const [hoverRating, setHoverRating] = useState(0);
    const starSize = size === "sm" ? "size-6" : "size-8";

    return (
        <div>
            <div className="flex items-center justify-center gap-1.5" dir="ltr">
                {[1, 2, 3, 4, 5].map((n) => {
                    const filled = n <= (hoverRating || rating);

                    return (
                        <motion.button
                            key={n}
                            type="button"
                            onClick={() => onChange(n)}
                            onMouseEnter={() => setHoverRating(n)}
                            onMouseLeave={() => setHoverRating(0)}
                            whileTap={{ scale: 0.8 }}
                            animate={filled ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                            transition={{ duration: 0.25 }}
                            className="p-1"
                        >
                            <Star
                                className={`${starSize} transition-colors ${filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-black/20"
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
                        className="mt-1.5 text-center text-[12px] font-medium text-amber-600"
                    >
                        {RATING_LABELS[rating]}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}