"use client";

import { ImagePlus, X, Loader2 } from "lucide-react";
import { useRef } from "react";

export function CategoryImagePicker({
    imageUrl,
    isUploading,
    onFileSelected,
    onRemove,
}: {
    imageUrl: string;
    isUploading: boolean;
    onFileSelected: (file: File) => void;
    onRemove: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <p className="mb-1.5 px-1 text-[12.5px] font-medium text-[#8E8E93]">
                تصویر (اختیاری)
            </p>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileSelected(file);
                    e.target.value = "";
                }}
            />

            {imageUrl ? (
                <div className="relative h-20 w-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt=""
                        className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        aria-label="حذف تصویر"
                        className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF3B30] shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
                    >
                        <X className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl bg-black/[0.05] active:bg-black/[0.08] disabled:opacity-60"
                >
                    {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#8E8E93]" strokeWidth={2.25} />
                    ) : (
                        <>
                            <ImagePlus className="h-5 w-5 text-[#8E8E93]" strokeWidth={2} />
                            <span className="text-[10.5px] text-[#8E8E93]">افزودن</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}