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

export function RejectReviewDialog({
    open,
    onOpenChange,
    onConfirm,
    isSubmitting,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isSubmitting: boolean;
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[86%] max-w-[340px] rounded-3xl border-0 bg-white p-5 text-right">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-right text-[16px] font-bold text-[#1C1C1E]">
                        این نظر حذف شود؟
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-right text-[13px] text-[#8E8E93]">
                        این عمل قابل بازگشت نیست و هیچ اطلاعی به کاربر داده نمی‌شود.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 flex-row-reverse gap-2 sm:flex-row-reverse sm:justify-start">
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="flex-1 rounded-2xl bg-[#FF3B30] py-3 text-[14px] font-semibold text-white hover:bg-[#FF3B30] active:opacity-90 disabled:opacity-60"
                    >
                        {isSubmitting ? "در حال حذف..." : "حذف نظر"}
                    </AlertDialogAction>
                    <AlertDialogCancel className="flex-1 rounded-2xl bg-black/[0.05] py-3 text-[14px] font-semibold text-[#1C1C1E] border-0 hover:bg-black/[0.05]">
                        انصراف
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}