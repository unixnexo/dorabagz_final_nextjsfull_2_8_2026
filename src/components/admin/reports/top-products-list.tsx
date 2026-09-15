import type { TopProductDTO } from "@/types/report";
import { toman, faNumber } from "./format";
import { RankBadge } from "./rank-badge";

export function TopProductsList({
    products,
}: {
    products: TopProductDTO[] | undefined;
}) {
    if (!products) {
        return (
            <div className="mt-3 h-64 animate-pulse rounded-3xl bg-white/70" />
        );
    }

    if (products.length === 0) {
        return (
            <div className="mt-3 rounded-3xl bg-white p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13px] text-[#8E8E93]">هنوز محصولی فروخته نشده</p>
            </div>
        );
    }

    return (
        <ul className="mt-3 overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {products.map((p, i) => (
                <li
                    key={p.productId ?? p.productTitle}
                    className={
                        "flex items-center gap-3 px-4 py-3 " +
                        (i !== products.length - 1 ? "border-b border-[#E5E5EA]" : "")
                    }
                >
                    <RankBadge rank={i + 1} />

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-[#1C1C1E]">
                            {p.productTitle}
                        </p>
                        <p className="text-[11px] text-[#8E8E93]">
                            {faNumber(p.unitsSold)} فروش
                        </p>
                    </div>

                    <span className="shrink-0 text-[12.5px] font-semibold tabular-nums text-brand-primary">
                        {toman(p.revenue)}
                    </span>
                </li>
            ))}
        </ul>
    );
}