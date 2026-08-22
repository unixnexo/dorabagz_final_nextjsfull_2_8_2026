import { Percent } from "lucide-react";
import type { DiscountGroupDTO } from "@/types/discount";
import { DiscountGroupCard } from "./discount-group-card";

export function DiscountsList({
    groups,
    isLoading,
    isError,
    onEdit,
    onDelete,
    onRemoveProduct,
    onRemoveCategory,
}: {
    groups: DiscountGroupDTO[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onEdit: (group: DiscountGroupDTO) => void;
    onDelete: (group: DiscountGroupDTO) => void;
    onRemoveProduct: (groupId: string, productId: string) => void;
    onRemoveCategory: (groupId: string, categoryId: string) => void;
}) {
    if (isError) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] font-medium text-[#FF3B30]">
                    خطا در دریافت اطلاعات
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-2.5">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-[92px] animate-pulse rounded-3xl bg-white/70" />
                ))}
            </div>
        );
    }

    if (!groups || groups.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Percent className="mx-auto h-7 w-7 text-[#C7C7CC]" strokeWidth={1.75} />
                <p className="mt-2 text-[13.5px] text-[#8E8E93]">
                    هنوز گروه تخفیفی ثبت نشده
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {groups.map((group) => (
                <DiscountGroupCard
                    key={group.id}
                    group={group}
                    onEdit={() => onEdit(group)}
                    onDelete={() => onDelete(group)}
                    onRemoveProduct={(productId) => onRemoveProduct(group.id, productId)}
                    onRemoveCategory={(categoryId) => onRemoveCategory(group.id, categoryId)}
                />
            ))}
        </div>
    );
}
