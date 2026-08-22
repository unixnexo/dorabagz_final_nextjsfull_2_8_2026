"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { createStoryAction, updateStoryAction } from "@/server/story/admin-actions";
import type { AdminStoryDTO, StoryMediaType } from "@/types/story";
import { StoryMediaUpload } from "./story-media-upload";
import { StoryProductPicker } from "./story-product-picker";
import toast from "react-hot-toast";

export function StoryFormSheet({
    open,
    onOpenChange,
    editing,
    onDone,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: AdminStoryDTO | null;
    onDone: () => void;
}) {
    const [mediaType, setMediaType] = useState<StoryMediaType>("IMAGE");
    const [mediaUrl, setMediaUrl] = useState("");
    const [description, setDescription] = useState("");
    const [durationHours, setDurationHours] = useState(24);
    const [linkedProductIds, setLinkedProductIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset (or hydrate for edit) every time the sheet opens, so switching
    // between "new" and editing different stories never leaks stale state.
    useEffect(() => {
        if (!open) return;
        setMediaType(editing?.mediaType ?? "IMAGE");
        setMediaUrl(editing?.mediaUrl ?? "");
        setDescription(editing?.description ?? "");
        setDurationHours(24);
        setLinkedProductIds(editing?.linkedProductIds ?? []);
        setError(null);
    }, [open, editing]);

    async function handleSubmit() {
        setError(null);

        // if (!mediaUrl) {
        //     setError("لطفاً یک فایل آپلود کنید.");
        //     return;
        // }

        if (!mediaUrl) {
            const message = "اول یه فایل برای استوری آپلود کن.";
            setError(message);
            toast.error(message);
            return;
        }

        setIsSubmitting(true);
        const payload = {
            mediaType,
            mediaUrl,
            description: description || undefined,
            durationHours,
            linkedProductIds,
        };
        const result = editing
            ? await updateStoryAction({ id: editing.id, ...payload })
            : await createStoryAction(payload);
        setIsSubmitting(false);

        // if (!result.success) {
        //     setError(result.error);
        //     return;
        // }
        // onDone();

        if (!result.success) {
            setError(result.error);
            toast.error(result.error || "ذخیره استوری انجام نشد.");
            return;
        }

        toast.success(
            editing
                ? "استوری با موفقیت ویرایش شد."
                : "استوری با موفقیت ساخته شد."
        );

        onDone();
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl px-4 pb-6 pt-4">
                <SheetHeader className="mb-4 text-right">
                    <SheetTitle className="text-[15px] font-semibold text-[#1C1C1E]">
                        {editing ? "ویرایش استوری" : "استوری جدید"}
                    </SheetTitle>
                </SheetHeader>

                <div className="space-y-4">
                    <StoryMediaUpload
                        mediaType={mediaType}
                        mediaUrl={mediaUrl}
                        onMediaSelected={(type, url) => {
                            setMediaType(type);
                            setMediaUrl(url);
                        }}
                    />

                    <div>
                        <label className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]">
                            توضیحات (اختیاری)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            placeholder="توضیح کوتاه برای این استوری..."
                            className="w-full resize-none rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-[13px] text-[#1C1C1E] outline-none placeholder:text-[#C7C7CC]"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]">
                            مدت نمایش (ساعت)
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            value={durationHours}
                            onChange={(e) => setDurationHours(Number(e.target.value) || 1)}
                            className="w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-[13px] tabular-nums text-[#1C1C1E] outline-none"
                        />
                    </div>

                    <StoryProductPicker
                        selectedIds={linkedProductIds}
                        onChange={setLinkedProductIds}
                    />
                </div>

                {error && (
                    <p className="mt-4 rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-5 w-full rounded-2xl bg-black py-3 text-[13.5px] font-semibold text-white disabled:opacity-50"
                >
                    {isSubmitting ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد استوری"}
                </button>
            </SheetContent>
        </Sheet>
    );
}