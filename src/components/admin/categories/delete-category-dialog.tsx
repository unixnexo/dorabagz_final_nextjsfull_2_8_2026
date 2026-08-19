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
import type { CategoryDTO } from "@/types/category";

export function DeleteCategoryDialog({
    category,
    onOpenChange,
    onConfirm,
    isDeleting,
    error,
}: {
    category: CategoryDTO | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
    error?: string | null;
}) {
    return (
        <AlertDialog open={!!category} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[86%] max-w-[340px] rounded-3xl border-0 bg-white p-5 text-right">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-right text-[16px] font-bold text-[#1C1C1E]">
                        حذف «{category?.title}»؟
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-right text-[13px] text-[#8E8E93]">
                        اگر این دسته زیرمجموعه داشته باشد، ابتدا باید زیرمجموعه‌ها حذف یا
                        جابه‌جا شوند.
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
                        disabled={isDeleting}
                        className="flex-1 rounded-2xl bg-[#FF3B30] py-3 text-[14px] font-semibold text-white hover:bg-[#FF3B30] active:opacity-90 disabled:opacity-60"
                    >
                        {isDeleting ? "در حال حذف..." : "حذف"}
                    </AlertDialogAction>
                    <AlertDialogCancel className="flex-1 rounded-2xl bg-black/[0.05] py-3 text-[14px] font-semibold text-[#1C1C1E] border-0 hover:bg-black/[0.05]">
                        انصراف
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}