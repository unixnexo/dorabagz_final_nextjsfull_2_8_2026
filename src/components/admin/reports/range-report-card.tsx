import type { IncomeReportDTO } from "@/types/report";
import { toman, faNumber } from "./format";

export function RangeReportCard({
    report,
    loading,
    error,
}: {
    report: IncomeReportDTO | undefined;
    loading: boolean;
    error: boolean;
}) {
    if (error) {
        return (
            <div className="mt-3 rounded-3xl bg-white p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] font-medium text-[#FF3B30]">
                    دریافت گزارش با خطا مواجه شد
                </p>
            </div>
        );
    }

    if (loading || !report) {
        return (
            <div className="mt-3 space-y-2.5">
                <div className="h-20 animate-pulse rounded-3xl bg-white/70" />
                <div className="h-40 animate-pulse rounded-3xl bg-white/70" />
            </div>
        );
    }

    const maxIncome = Math.max(...report.breakdown.map((p) => p.income), 1);

    return (
        <div className="mt-3 space-y-2.5">
            {/* Totals strip */}
            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#E5E5EA] rounded-3xl bg-white py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Totals label="مجموع درآمد" value={toman(report.totalIncome)} />
                <Totals label="سفارش‌ها" value={faNumber(report.totalOrders)} />
                <Totals label="کالای فروخته‌شده" value={faNumber(report.unitsSold)} />
            </div>

            {/* Breakdown list */}
            {report.breakdown.length === 0 ? (
                <div className="rounded-3xl bg-white p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <p className="text-[13px] text-[#8E8E93]">
                        داده‌ای برای این بازه ثبت نشده
                    </p>
                </div>
            ) : (
                <ul className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {report.breakdown.map((point, index) => (
                        <li
                            key={point.label}
                            className={
                                "flex items-center gap-3 px-4 py-3 " +
                                (index !== report.breakdown.length - 1
                                    ? "border-b border-[#E5E5EA]"
                                    : "")
                            }
                        >
                            <div className="flex w-16 shrink-0 flex-col">
                                <span className="text-[13px] font-medium text-[#1C1C1E]">
                                    {point.label}
                                </span>
                                <span className="text-[10.5px] text-[#8E8E93]">
                                    {faNumber(point.orderCount)} سفارش
                                </span>
                            </div>

                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                                <div
                                    className="h-full rounded-full bg-brand-primary"
                                    style={{
                                        width: `${Math.max((point.income / maxIncome) * 100, 4)}%`,
                                    }}
                                />
                            </div>

                            <span className="w-[86px] shrink-0 text-left text-[12.5px] font-semibold tabular-nums text-[#1C1C1E]">
                                {toman(point.income)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Totals({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col items-center gap-0.5 px-1 text-center">
            <span className="text-[13px] font-bold tabular-nums text-[#1C1C1E]">
                {value}
            </span>
            <span className="text-[10.5px] text-[#8E8E93]">{label}</span>
        </div>
    );
}