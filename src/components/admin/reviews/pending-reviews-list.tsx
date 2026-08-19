import type { PendingReviewDTO } from "@/types/review";
import { PendingReviewCard } from "./pending-review-card";

export function PendingReviewsList({
    reviews,
    isLoading,
    busyId,
    onApprove,
    onReject,
}: {
    reviews: PendingReviewDTO[] | undefined;
    isLoading: boolean;
    busyId: string | null;
    onApprove: (id: string) => void;
    onReject: (review: PendingReviewDTO) => void;
}) {
    if (isLoading) {
        return (
            <div className="space-y-2.5">
                <div className="h-40 animate-pulse rounded-3xl bg-white/70" />
                <div className="h-40 animate-pulse rounded-3xl bg-white/70" />
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] text-[#8E8E93]">
                    نظر جدیدی در انتظار تایید نیست
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {reviews.map((review) => (
                <PendingReviewCard
                    key={review.id}
                    review={review}
                    isBusy={busyId === review.id}
                    onApprove={() => onApprove(review.id)}
                    onReject={() => onReject(review)}
                />
            ))}
        </div>
    );
}