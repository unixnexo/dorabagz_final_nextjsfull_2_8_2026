import { Percent, Trash2, Pencil, X, Tag, Layers } from "lucide-react";
import type { DiscountGroupDTO } from "@/types/discount";
import { getDiscountStatus, STATUS_LABEL, STATUS_COLOR } from "./discount-status";

function formatDateShort(iso: string) {
    return new Date(iso).toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
}

export function DiscountGroupCard({
    group,
    onEdit,
    onDelete,
    onRemoveProduct,
    onRemoveCategory,
}: {
    group: DiscountGroupDTO;
    onEdit: () => void;
    onDelete: () => void;
    onRemoveProduct: (productId: string) => void;
    onRemoveCategory: (categoryId: string) => void;
}) {
    const status = getDiscountStatus(group);
    const statusColor = STATUS_COLOR[status];

    const valueLabel =
        group.type === "PERCENT"
            ? `${group.value.toLocaleString("fa-IR")}٪`
            : `${group.value.toLocaleString("fa-IR")} ت`;

    const hasMembers = group.productIds.length > 0 || group.categoryIds.length > 0;

    return (
        <div className="rounded-3xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0A7D5C]/[0.08]">
                    <Percent className="h-4.5 w-4.5 text-[#0A7D5C]" strokeWidth={2.25} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <p className="truncate text-[13.5px] font-semibold text-[#1C1C1E]">
                            {group.title}
                        </p>
                        <span
                            className={
                                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                                statusColor.bg +
                                " " +
                                statusColor.text
                            }
                        >
                            {STATUS_LABEL[status]}
                        </span>
                    </div>

                    <p className="mt-0.5 text-[12px] tabular-nums text-[#8E8E93]">
                        {valueLabel} تخفیف
                    </p>

                    {(group.startAt || group.endAt) && (
                        <p className="mt-1 text-[10.5px] tabular-nums text-[#C7C7CC]">
                            {group.startAt && `از ${formatDateShort(group.startAt)}`}
                            {group.startAt && group.endAt && " · "}
                            {group.endAt && `تا ${formatDateShort(group.endAt)}`}
                        </p>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
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

            {hasMembers && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-black/[0.05] pt-3">
                    {group.productIds.map((id, i) => (
                        <span
                            key={id}
                            className="flex items-center gap-1 rounded-full bg-black/[0.05] py-1 pl-1 pr-2.5 text-[11px] text-[#1C1C1E]"
                        >
                            <Tag className="h-2.5 w-2.5 text-[#8E8E93]" strokeWidth={2.25} />
                            {group.productTitles[i]}
                            <button
                                type="button"
                                onClick={() => onRemoveProduct(id)}
                                aria-label="حذف از گروه"
                                className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10"
                            >
                                <X className="h-2.5 w-2.5" strokeWidth={2.5} />
                            </button>
                        </span>
                    ))}

                    {group.categoryIds.map((id, i) => (
                        <span
                            key={id}
                            className="flex items-center gap-1 rounded-full bg-[#0A7D5C]/[0.08] py-1 pl-1 pr-2.5 text-[11px] text-[#0A7D5C]"
                        >
                            <Layers className="h-2.5 w-2.5" strokeWidth={2.25} />
                            {group.categoryTitles[i]}
                            <button
                                type="button"
                                onClick={() => onRemoveCategory(id)}
                                aria-label="حذف از گروه"
                                className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0A7D5C]/15"
                            >
                                <X className="h-2.5 w-2.5" strokeWidth={2.5} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {!hasMembers && (
                <p className="mt-3 border-t border-black/[0.05] pt-3 text-[11px] text-[#C7C7CC]">
                    بدون محصول یا دسته‌بندی — این گروه روی هیچ محصولی اعمال نمی‌شود
                </p>
            )}
        </div>
    );
}
