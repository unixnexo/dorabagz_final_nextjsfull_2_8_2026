"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

/**
 * Favorite (heart) toggle button with a spring "pop" on tap and a burst of
 * small heart particles when favoriting. De-favoriting plays a quick
 * shrink/settle instead — a smaller, quieter motion since removing
 * something shouldn't feel as celebratory as adding it.
 *
 * Purely presentational — the parent still owns the isFavorited state and
 * the actual toggle request/login-check/toast logic.
 */
export function FavoriteButton({
    isFavorited,
    onToggle,
    disabled,
}: {
    isFavorited: boolean;
    onToggle: () => void;
    disabled?: boolean;
}) {
    const [burstKey, setBurstKey] = useState(0);

    function handleClick() {
        if (!isFavorited) {
            // about to favorite — trigger a fresh burst
            setBurstKey((k) => k + 1);
        }
        onToggle();
    }

    return (
        <div className="relative shrink-0">
            <motion.button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                aria-pressed={isFavorited}
                aria-label={isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                whileTap={{ scale: 0.8 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-input bg-background shadow-sm disabled:opacity-50"
            >
                <motion.span
                    key={isFavorited ? "filled" : "empty"}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={
                        isFavorited
                            ? { type: "spring", stiffness: 500, damping: 12 }
                            : { type: "spring", stiffness: 400, damping: 20 }
                    }
                >
                    <Heart className={`h-5 w-5 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                </motion.span>
            </motion.button>

            {/* heart-burst particles, only on favoriting */}
            <AnimatePresence>
                {isFavorited && (
                    <div key={burstKey} className="pointer-events-none absolute inset-0">
                        {PARTICLE_ANGLES.map((angle, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                animate={{
                                    opacity: 0,
                                    scale: 1,
                                    x: Math.cos(angle) * 26,
                                    y: Math.sin(angle) * 26,
                                }}
                                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.02 }}
                                className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5"
                            >
                                <Heart className="h-3 w-3 fill-red-400 text-red-400" />
                            </motion.span>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// 8 evenly spaced directions around the button, in radians
const PARTICLE_ANGLES = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);