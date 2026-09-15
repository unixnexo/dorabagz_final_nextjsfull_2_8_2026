import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageItem } from "./product-form-types";

export function ProductImageTile({
    image,
    onSetMain,
    onRemove,
}: {
    image: ImageItem;
    onSetMain: () => void;
    onRemove: () => void;
}) {
    return (
        <div className="relative h-20 w-20 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={image.url}
                alt=""
                className={cn(
                    "h-20 w-20 rounded-2xl object-cover",
                    image.isMain && "ring-2 ring-brand-primary ring-offset-2 ring-offset-[#F2F2F7]"
                )}
            />

            <button
                type="button"
                onClick={onSetMain}
                aria-label="انتخاب به عنوان تصویر اصلی"
                className={cn(
                    "absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.2)]",
                    image.isMain ? "bg-brand-primary" : "bg-white"
                )}
            >
                <Star
                    className={cn("h-3.5 w-3.5", image.isMain ? "text-white" : "text-[#8E8E93]")}
                    strokeWidth={2.25}
                    fill={image.isMain ? "currentColor" : "none"}
                />
            </button>

            <button
                type="button"
                onClick={onRemove}
                aria-label="حذف تصویر"
                className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF3B30] shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
            >
                <X className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </button>
        </div>
    );
}