import type { TopCustomerDTO } from "@/types/report";
import { toman, faNumber } from "./format";
import { RankBadge } from "./rank-badge";

export function TopCustomersList({
    customers,
}: {
    customers: TopCustomerDTO[] | undefined;
}) {
    if (!customers) {
        return <div className="mt-3 h-64 animate-pulse rounded-3xl bg-white/70" />;
    }

    if (customers.length === 0) {
        return (
            <div className="mt-3 rounded-3xl bg-white p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13px] text-[#8E8E93]">هنوز مشتری‌ای ثبت نشده</p>
            </div>
        );
    }

    return (
        <ul className="mt-3 overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {customers.map((c, i) => (
                <li
                    key={c.userId}
                    className={
                        "flex items-center gap-3 px-4 py-3 " +
                        (i !== customers.length - 1 ? "border-b border-[#E5E5EA]" : "")
                    }
                >
                    <RankBadge rank={i + 1} />

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-[#1C1C1E]">
                            {c.fullName ?? "بدون نام"}
                        </p>
                        <p dir="ltr" className="text-left text-[11px] text-[#8E8E93]">
                            {c.phoneNumber}
                        </p>
                    </div>

                    <div className="shrink-0 text-left">
                        <p className="text-[12.5px] font-semibold tabular-nums text-[#0A7D5C]">
                            {toman(c.totalSpent)}
                        </p>
                        <p className="text-[10.5px] tabular-nums text-[#8E8E93]">
                            {faNumber(c.orderCount)} سفارش
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}