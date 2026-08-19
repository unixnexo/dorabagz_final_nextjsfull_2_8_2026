import type { SiteSatisfactionRatingDTO } from "@/types/review";
import { StarRating } from "./star-rating";

export function SatisfactionRatingRow({
    rating,
    isLast,
}: {
    rating: SiteSatisfactionRatingDTO;
    isLast: boolean;
}) {
    return (
        <div
            className={
                "px-4 py-3 " + (isLast ? "" : "border-b border-[#E5E5EA]")
            }
        >
            <div className="flex items-center justify-between">
                <StarRating rating={rating.rating} />
                <span className="text-[11px] text-[#8E8E93]">
                    {new Date(rating.createdAt).toLocaleDateString("fa-IR")}
                </span>
            </div>

            {rating.text && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#1C1C1E]">
                    {rating.text}
                </p>
            )}

            <p dir="ltr" className="mt-1.5 text-left text-[11px] text-[#8E8E93]">
                {rating.phoneNumber}
            </p>
        </div>
    );
}