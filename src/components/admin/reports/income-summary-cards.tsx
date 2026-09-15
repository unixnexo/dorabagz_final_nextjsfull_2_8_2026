import type { IncomeSummaryDTO } from "@/types/report";
import { toman } from "./format";

const CARDS: {
    field: "today" | "month" | "year";
    label: string;
}[] = [
        { field: "today", label: "امروز" },
        { field: "month", label: "این ماه" },
        { field: "year", label: "امسال" },
    ];

export function IncomeSummaryCards({
    summary,
    loading,
}: {
    summary: IncomeSummaryDTO | undefined;
    loading: boolean;
}) {
    return (
        <section className="grid grid-cols-3 gap-2.5 pt-4">
            {CARDS.map(({ field, label }) => (
                <SummaryCard
                    key={field}
                    label={label}
                    loading={loading}
                    income={summary?.[`${field}Income`]}
                    count={summary?.[`${field}OrderCount`]}
                    emphasize={field === "month"}
                />
            ))}
        </section>
    );
}

function SummaryCard({
    label,
    income,
    count,
    loading,
    emphasize,
}: {
    label: string;
    income: number | undefined;
    count: number | undefined;
    loading: boolean;
    emphasize?: boolean;
}) {
    return (
        <div
            className={
                "flex flex-col justify-between rounded-3xl p-3.5 " +
                (emphasize
                    ? "bg-brand-primary shadow-[0_8px_20px_-8px_rgba(10,125,92,0.55)]"
                    : "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]")
            }
            style={{ minHeight: 112 }}
        >
            <p
                className={
                    "text-[12px] font-medium " +
                    (emphasize ? "text-white/75" : "text-[#8E8E93]")
                }
            >
                {label}
            </p>

            {loading ? (
                <div className="space-y-1.5">
                    <div
                        className={
                            "h-4 w-14 animate-pulse rounded-full " +
                            (emphasize ? "bg-white/25" : "bg-black/[0.06]")
                        }
                    />
                    <div
                        className={
                            "h-2.5 w-10 animate-pulse rounded-full " +
                            (emphasize ? "bg-white/20" : "bg-black/[0.05]")
                        }
                    />
                </div>
            ) : (
                <div>
                    <p
                        className={
                            "text-[15px] font-bold leading-tight tabular-nums " +
                            (emphasize ? "text-white" : "text-[#1C1C1E]")
                        }
                    >
                        {toman(income ?? 0)}
                    </p>
                    <p
                        className={
                            "mt-1 text-[11px] tabular-nums " +
                            (emphasize ? "text-white/70" : "text-[#8E8E93]")
                        }
                    >
                        {(count ?? 0).toLocaleString("fa-IR")} سفارش
                    </p>
                </div>
            )}
        </div>
    );
}