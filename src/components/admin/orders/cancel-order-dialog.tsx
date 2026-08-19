"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function CancelOrderDialog({
    open,
    onOpenChange,
    onConfirm,
    isSubmitting,
    error,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    error?: string | null;
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[86%] max-w-[340px] rounded-3xl border-0 bg-white p-5 text-right">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-right text-[16px] font-bold text-[#1C1C1E]">
                        این سفارش لغو شود؟
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-right text-[13px] text-[#8E8E93]">
                        لغو سفارش، موجودی انبار را به‌صورت خودکار برنمی‌گرداند. در صورت
                        نیاز، موجودی را به‌صورت دستی از صفحه محصول اصلاح کنید.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <p className="rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
                        {error}
                    </p>
                )}

                <AlertDialogFooter className="mt-4 flex-row-reverse gap-2 sm:flex-row-reverse sm:justify-start">
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="flex-1 rounded-2xl bg-[#FF3B30] py-3 text-[14px] font-semibold text-white hover:bg-[#FF3B30] active:opacity-90 disabled:opacity-60"
                    >
                        {isSubmitting ? "در حال لغو..." : "لغو سفارش"}
                    </AlertDialogAction>
                    <AlertDialogCancel className="flex-1 rounded-2xl bg-black/[0.05] py-3 text-[14px] font-semibold text-[#1C1C1E] border-0 hover:bg-black/[0.05]">
                        انصراف
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}