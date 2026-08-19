import { Star } from "lucide-react";

export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    className={
                        "h-3.5 w-3.5 " + (i < rating ? "text-[#FF9500]" : "text-[#E5E5EA]")
                    }
                    strokeWidth={0}
                    fill="currentColor"
                />
            ))}
        </div>
    );
}