"use client";

import { cn } from "@/lib/utils";
import { FORM_STEPS } from "./product-form-types";

export function FormStepIndicator({
    currentIndex,
    furthestReachedIndex,
    onStepClick,
}: {
    currentIndex: number;
    furthestReachedIndex: number;
    onStepClick: (index: number) => void;
}) {
    return (
        <div className="pt-4">
            <div className="flex gap-1.5">
                {FORM_STEPS.map((step, index) => {
                    const isDone = index < currentIndex;
                    const isActive = index === currentIndex;
                    const isReachable = index <= furthestReachedIndex;
                    return (
                        <button
                            key={step.key}
                            type="button"
                            disabled={!isReachable}
                            onClick={() => onStepClick(index)}
                            className={cn(
                                "h-[5px] flex-1 rounded-full transition-colors",
                                isActive || isDone ? "bg-brand-primary" : "bg-black/[0.08]"
                            )}
                            aria-label={step.label}
                        />
                    );
                })}
            </div>
            <p className="mt-2.5 text-[13px] font-semibold text-[#1C1C1E]">
                {(currentIndex + 1).toLocaleString("fa-IR")} از {FORM_STEPS.length.toLocaleString("fa-IR")} · {FORM_STEPS[currentIndex].label}
            </p>
        </div>
    );
}