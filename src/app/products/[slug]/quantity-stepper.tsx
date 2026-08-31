"use client";

import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Apple-style quantity stepper: fully rounded pill, +/- buttons instead of
 * manual typing. Full width — the number sits centered between two equally
 * sized tap targets on either edge. Value is clamped to [1, max] by the
 * caller's onChange — this component just fires intents up.
 */
export function QuantityStepper({
    value,
    max,
    onChange,
}: {
    value: number;
    max: number;
    onChange: (next: number) => void;
}) {
    const canDecrease = value > 1;
    const canIncrease = value < max;

    return (
        <div className="flex w-full items-center justify-between rounded-full bg-muted p-1.5">
            <motion.button
                type="button"
                whileTap={canDecrease ? { scale: 0.88 } : undefined}
                onClick={() => canDecrease && onChange(value - 1)}
                disabled={!canDecrease}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-opacity disabled:opacity-30"
                aria-label="کاهش تعداد"
            >
                <Minus className="h-4 w-4" />
            </motion.button>

            <span className="text-base font-semibold tabular-nums text-foreground">{value.toLocaleString("fa-IR")}</span>

            <motion.button
                type="button"
                whileTap={canIncrease ? { scale: 0.88 } : undefined}
                onClick={() => canIncrease && onChange(value + 1)}
                disabled={!canIncrease}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-opacity disabled:opacity-30"
                aria-label="افزایش تعداد"
            >
                <Plus className="h-4 w-4" />
            </motion.button>
        </div>
    );
}