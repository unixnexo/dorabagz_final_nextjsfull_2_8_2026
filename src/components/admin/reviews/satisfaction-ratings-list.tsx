import type { SiteSatisfactionRatingDTO } from "@/types/review";
import { SatisfactionRatingRow } from "./satisfaction-rating-row";

export function SatisfactionRatingsList({
    ratings,
    isLoading,
}: {
    ratings: SiteSatisfactionRatingDTO[] | undefined;
    isLoading: boolean;
}) {
    if (isLoading) {
        return <div className="h-32 animate-pulse rounded-3xl bg-white/70" />;
    }

    if (!ratings || ratings.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] text-[#8E8E93]">
                    هنوز رضایت‌سنجی ثبت نشده است
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {ratings.map((rating, index) => (
                <SatisfactionRatingRow
                    key={rating.id}
                    rating={rating}
                    isLast={index === ratings.length - 1}
                />
            ))}
        </div>
    );
}