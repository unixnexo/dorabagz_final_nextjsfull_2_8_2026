import { cn } from "@/lib/utils";
import { faNumber } from "./format";

const MEDAL_STYLES: Record<number, string> = {
    1: "bg-[#FFD60A] text-[#7A5B00]",
    2: "bg-[#D1D1D6] text-[#48484A]",
    3: "bg-[#E3B08C] text-[#6B3E1D]",
};

export function RankBadge({ rank }: { rank: number }) {
    return (
        <span
            className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold tabular-nums",
                MEDAL_STYLES[rank] ?? "bg-black/[0.05] text-[#8E8E93]"
            )}
        >
            {faNumber(rank)}
        </span>
    );
}