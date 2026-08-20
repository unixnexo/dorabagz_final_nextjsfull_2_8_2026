"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import type { StoryMediaType } from "@/types/story";

export function StoryMediaUpload({
    mediaType,
    mediaUrl,
    onMediaSelected,
}: {
    mediaType: StoryMediaType;
    mediaUrl: string;
    onMediaSelected: (type: StoryMediaType, url: string) => void;
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Video temporarily disabled — admin can only upload images for now.
        // const isVideo = file.type.startsWith("video/");
        setError(null);
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload/story-media", { method: "POST", body: formData });
        const data = await res.json();
        setIsUploading(false);

        if (!res.ok) {
            setError(data.error ?? "خطا در آپلود فایل");
            return;
        }
        onMediaSelected("IMAGE", data.url);
        // onMediaSelected(isVideo ? "VIDEO" : "IMAGE", data.url);
    }

    return (
        <div>
            <label className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]">
                فایل استوری
            </label>

            <label className="flex aspect-[9/14] w-full max-w-[160px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl bg-black/[0.04]">
                <input
                    type="file"
                    accept="image/*"
                    // accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {mediaUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
                ) : /* mediaType === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <video src={mediaUrl} className="h-full w-full object-cover" muted controls />
        ) */
                    isUploading ? (
                        <p className="text-[11.5px] text-[#8E8E93]">در حال آپلود...</p>
                    ) : (
                        <>
                            <Upload className="h-5 w-5 text-[#8E8E93]" strokeWidth={2} />
                            <p className="px-3 text-center text-[11px] text-[#8E8E93]">
                                عکس استوری را انتخاب کنید
                            </p>
                            {/* <p className="px-3 text-center text-[11px] text-[#8E8E93]">
              عکس یا ویدیو حداکثر ۳۰ ثانیه
            </p> */}
                        </>
                    )}
            </label>

            {error && (
                <p className="mt-1.5 px-1 text-[11.5px] font-medium text-[#FF3B30]">{error}</p>
            )}
        </div>
    );
}