"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { DiscountGroupDTO } from "@/types/discount";

export function DeleteDiscountDialog({
    group,
    isDeleting,
    onCancel,
    onConfirm,
}: {
    group: DiscountGroupDTO | null;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={group !== null} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="max-w-[340px] rounded-3xl p-5 text-right">
                <DialogHeader>
                    <DialogTitle className="text-[15px] font-bold text-[#1C1C1E]">
                        حذف گروه تخفیف
                    </DialogTitle>
                </DialogHeader>

                <p className="text-[13px] leading-6 text-[#8E8E93]">
                    گروه «{group?.title}» برای همیشه حذف می‌شود و تخفیف از تمام محصولات و دسته‌بندی‌های آن برداشته می‌شود.
                </p>

                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-2xl bg-black/[0.05] py-2.5 text-[13px] font-medium text-[#1C1C1E] active:bg-black/[0.08]"
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 rounded-2xl bg-[#FF3B30] py-2.5 text-[13px] font-semibold text-white active:bg-[#FF3B30]/85 disabled:opacity-50"
                    >
                        {isDeleting ? "در حال حذف..." : "حذف"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
