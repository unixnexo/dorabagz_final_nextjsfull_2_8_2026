import { Ticket, Trash2, Pencil, Users, ShoppingBag, Layers } from "lucide-react";
import type { CouponDTO } from "@/types/coupon";

function formatExpiry(iso: string) {
    const d = new Date(iso);
    const isExpired = d.getTime() < Date.now();
    const label = d.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
    return { label, isExpired };
}

export function CouponCard({
    coupon,
    onEdit,
    onDelete,
}: {
    coupon: CouponDTO;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const valueLabel =
        coupon.type === "PERCENT"
            ? `${coupon.value.toLocaleString("fa-IR")}٪`
            : `${coupon.value.toLocaleString("fa-IR")} ت`;

    const scopeLabel =
        coupon.scope === "ENTIRE_CART"
            ? "کل سبد خرید"
            : coupon.scope === "SPECIFIC_PRODUCTS"
                ? `${coupon.productIds.length.toLocaleString("fa-IR")} محصول`
                : `${coupon.categoryIds.length.toLocaleString("fa-IR")} دسته‌بندی`;

    const ScopeIcon =
        coupon.scope === "ENTIRE_CART" ? Layers : coupon.scope === "SPECIFIC_PRODUCTS" ? ShoppingBag : Layers;

    const { label: expiryLabel, isExpired } = formatExpiry(coupon.expiresAt);
    const usageLabel = `${coupon.totalUsageCount.toLocaleString("fa-IR")} / ${
        coupon.maxTotalUsage ? coupon.maxTotalUsage.toLocaleString("fa-IR") : "∞"
    }`;

    return (
        <div
            className={
                "relative overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] " +
                (coupon.isDeleted ? "opacity-55" : "")
            }
        >
            <div className="flex items-stretch">
                {/* Ticket stub — the coupon's value, visually torn from the body */}
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex w-[76px] shrink-0 flex-col items-center justify-center gap-0.5 border-l border-dashed border-black/[0.08] bg-[#0A7D5C]/[0.06] py-3"
                >
                    <Ticket className="h-3.5 w-3.5 text-[#0A7D5C]" strokeWidth={2.25} />
                    <span className="text-[14px] font-bold tabular-nums text-[#0A7D5C]">
                        {valueLabel}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={onEdit}
                    className="min-w-0 flex-1 py-3 pr-3.5 text-right"
                >
                    <div className="flex items-center gap-1.5">
                        <p className="truncate font-mono text-[13.5px] font-semibold tracking-wide text-[#1C1C1E]">
                            {coupon.code}
                        </p>
                        {coupon.isDeleted && (
                            <span className="shrink-0 rounded-full bg-[#FF3B30]/12 px-2 py-0.5 text-[10px] font-semibold text-[#FF3B30]">
                                حذف شده
                            </span>
                        )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[10.5px] text-[#8E8E93]">
                        <span className="flex items-center gap-1">
                            <ScopeIcon className="h-3 w-3" strokeWidth={2.25} />
                            {scopeLabel}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 tabular-nums">
                            <Users className="h-3 w-3" strokeWidth={2.25} />
                            {usageLabel}
                        </span>
                    </div>

                    <p
                        className={
                            "mt-1 text-[10.5px] tabular-nums " +
                            (isExpired ? "font-medium text-[#FF3B30]" : "text-[#C7C7CC]")
                        }
                    >
                        {isExpired ? "منقضی شده · " : "انقضا "}
                        {expiryLabel}
                    </p>
                </button>

                <div className="flex shrink-0 items-center gap-1.5 pl-3">
                    <button
                        type="button"
                        onClick={onEdit}
                        aria-label="ویرایش"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.05] active:bg-black/[0.08]"
                    >
                        <Pencil className="h-3.5 w-3.5 text-[#1C1C1E]" strokeWidth={2.25} />
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        aria-label="حذف"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/10 active:bg-[#FF3B30]/15"
                    >
                        <Trash2 className="h-3.5 w-3.5 text-[#FF3B30]" strokeWidth={2.25} />
                    </button>
                </div>
            </div>
        </div>
    );
}
