"use client";

import { useRef } from "react";
import { ImagePlus, Loader2, Video, X } from "lucide-react";
import { ImageItem } from "./product-form-types";
import { FormField } from "./form-field";
import { ProductImageTile } from "./product-image-tile";


export function MediaStep({
    images,
    videoUrl,
    isUploadingImage,
    isUploadingVideo,
    onImageFilesSelected,
    onSetMainImage,
    onRemoveImage,
    onVideoFileSelected,
    onRemoveVideo,
}: {
    images: ImageItem[];
    videoUrl: string;
    isUploadingImage: boolean;
    isUploadingVideo: boolean;
    onImageFilesSelected: (files: File[]) => void;
    onSetMainImage: (index: number) => void;
    onRemoveImage: (index: number) => void;
    onVideoFileSelected: (file: File) => void;
    onRemoveVideo: () => void;
}) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const canAddMore = images.length < 6;

    return (
        <div className="space-y-4 pt-4">
            <FormField
                label="تصاویر محصول"
                hint={`${images.length.toLocaleString("fa-IR")} از ۶`}
            >
                <div className="rounded-3xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <div className="flex flex-wrap gap-2.5">
                        {images.map((img, i) => (
                            <ProductImageTile
                                key={img.url}
                                image={img}
                                onSetMain={() => onSetMainImage(i)}
                                onRemove={() => onRemoveImage(i)}
                            />
                        ))}

                        {canAddMore && (
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={isUploadingImage}
                                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-black/[0.05] active:bg-black/[0.08] disabled:opacity-60"
                            >
                                {isUploadingImage ? (
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

                    {images.length > 0 && (
                        <p className="mt-2.5 px-0.5 text-[11px] text-[#8E8E93]">
                            روی ستاره بزنید تا تصویر اصلی مشخص شود
                        </p>
                    )}
                </div>

                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length > 0) onImageFilesSelected(files);
                        e.target.value = "";
                    }}
                />
            </FormField>

            <FormField label="ویدیو" hint="اختیاری، حداکثر ۳۰ ثانیه">
                <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onVideoFileSelected(file);
                        e.target.value = "";
                    }}
                />

                {videoUrl ? (
                    <div className="relative overflow-hidden rounded-3xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <video controls className="w-full rounded-2xl">
                            <source src={videoUrl} />
                        </video>
                        <button
                            type="button"
                            onClick={onRemoveVideo}
                            aria-label="حذف ویدیو"
                            className="absolute left-6 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-[#FF3B30] shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
                        >
                            <X className="h-4 w-4 text-white" strokeWidth={2.5} />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={isUploadingVideo}
                        className="flex w-full items-center justify-center gap-2 rounded-3xl bg-white py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] disabled:opacity-60"
                    >
                        {isUploadingVideo ? (
                            <Loader2 className="h-5 w-5 animate-spin text-[#8E8E93]" strokeWidth={2.25} />
                        ) : (
                            <>
                                <Video className="h-5 w-5 text-[#8E8E93]" strokeWidth={2} />
                                <span className="text-[13px] text-[#8E8E93]">افزودن ویدیو</span>
                            </>
                        )}
                    </button>
                )}
            </FormField>
        </div>
    );
}