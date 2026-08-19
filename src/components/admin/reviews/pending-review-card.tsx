"use client";

import { Check, X, Phone, Package } from "lucide-react";
import type { PendingReviewDTO } from "@/types/review";
import { StarRating } from "./star-rating";

export function PendingReviewCard({
    review,
    onApprove,
    onReject,
    isBusy,
}: {
    review: PendingReviewDTO;
    onApprove: () => void;
    onReject: () => void;
    isBusy: boolean;
}) {
    return (
        <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
                <StarRating rating={review.rating} />
                <span className="text-[11px] text-[#8E8E93]">
                    {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                </span>
            </div>

            <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#1C1C1E]">
                {review.text}
            </p>

            <div className="mt-3 flex items-start gap-1.5 text-[11.5px] text-[#8E8E93]">
                <Package className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                <span>{review.productTitles.join("، ")}</span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-[#8E8E93]">
                <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                <span dir="ltr">{review.userPhoneNumber}</span>
            </div>

            <div className="mt-3.5 flex gap-2">
                <button
                    type="button"
                    onClick={onApprove}
                    disabled={isBusy}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#0A7D5C] py-2.5 text-[13px] font-semibold text-white active:opacity-90 disabled:opacity-60"
                >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    تایید
                </button>
                <button
                    type="button"
                    onClick={onReject}
                    disabled={isBusy}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#FF3B30]/10 py-2.5 text-[13px] font-semibold text-[#FF3B30] active:bg-[#FF3B30]/15 disabled:opacity-60"
                >
                    <X className="h-4 w-4" strokeWidth={2.5} />
                    رد و حذف
                </button>
            </div>
        </div>
    );
}