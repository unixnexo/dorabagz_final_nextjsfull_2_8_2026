"use client";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    createCategoryAction,
    updateCategoryAction,
} from "@/server/category/actions";
import { uploadProductMedia } from "@/lib/upload-client";
import type { CategoryDTO } from "@/types/category";
import { CategoryImagePicker } from "./category-image-picker";
import { ParentCategoryPicker } from "./parent-category-picker";

export function CategoryFormSheet({
    open,
    editing,
    parentOptions,
    onOpenChange,
    onSaved,
}: {
    open: boolean;
    editing: CategoryDTO | null;
    parentOptions: CategoryDTO[];
    onOpenChange: (open: boolean) => void;
    onSaved: () => void;
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="max-h-[88dvh] overflow-y-auto rounded-t-3xl border-0 bg-[#F2F2F7] px-4 pb-8"
            >
                <SheetHeader className="pb-2 pt-5 text-right">
                    <SheetTitle className="absolute top-4 right-4 text-right text-[19px] font-bold text-[#1C1C1E]">
                        {editing ? "ویرایش دسته" : "دسته جدید"}
                    </SheetTitle>
                </SheetHeader>

                {/* key forces remount so form state resets between categories */}
                <CategoryFormBody
                    key={editing?.id ?? "new"}
                    editing={editing}
                    parentOptions={parentOptions}
                    onSaved={onSaved}
                />
            </SheetContent>
        </Sheet>
    );
}

function CategoryFormBody({
    editing,
    parentOptions,
    onSaved,
}: {
    editing: CategoryDTO | null;
    parentOptions: CategoryDTO[];
    onSaved: () => void;
}) {
    const [title, setTitle] = useState(editing?.title ?? "");
    const [parentId, setParentId] = useState(editing?.parentId ?? "");
    const [imageUrl, setImageUrl] = useState(editing?.imageUrl ?? "");
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFileSelected(file: File) {
        setIsUploading(true);
        setError(null);
        const result = await uploadProductMedia(file);
        setIsUploading(false);
        if ("error" in result) {
            setError(result.error);
            return;
        }
        setImageUrl(result.url);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("عنوان دسته را وارد کنید");
            return;
        }

        setIsSaving(true);
        const payload = {
            title: title.trim(),
            imageUrl: imageUrl || null,
            parentId: parentId || null,
        };
        const result = editing
            ? await updateCategoryAction({ id: editing.id, ...payload })
            : await createCategoryAction(payload);
        setIsSaving(false);

        if (!result.success) {
            setError(result.error);
            return;
        }
        onSaved();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
                <p className="mb-1.5 px-1 text-[12.5px] font-medium text-[#8E8E93]">
                    عنوان
                </p>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً لوازم یدکی"
                    className="w-full rounded-2xl bg-white px-3.5 py-3 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                />
            </div>

            <ParentCategoryPicker
                options={parentOptions}
                value={parentId}
                onChange={setParentId}
                excludeId={editing?.id}
            />

            <CategoryImagePicker
                imageUrl={imageUrl}
                isUploading={isUploading}
                onFileSelected={handleFileSelected}
                onRemove={() => setImageUrl("")}
            />

            {error && (
                <p className="rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isSaving || isUploading}
                className="w-full rounded-2xl bg-[#0A7D5C] py-3.5 text-[14.5px] font-semibold text-white active:opacity-90 disabled:opacity-60"
            >
                {isSaving ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد دسته"}
            </button>
        </form>
    );
}