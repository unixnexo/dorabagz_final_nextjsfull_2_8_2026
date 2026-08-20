"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { ProductImageDTO } from "@/types/product";

export function ProductImageGallery({
    images,
    title,
}: {
    images: ProductImageDTO[];
    title: string;
}) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const sorted = [...images].sort((a, b) => {
        if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
        return a.sortOrder - b.sortOrder;
    });

    if (sorted.length === 0) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <ImageOff className="h-8 w-8 text-[#C7C7CC]" strokeWidth={1.75} />
            </div>
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => setLightboxIndex(activeIndex)}
                className="block aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={sorted[activeIndex].url}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </button>

            {sorted.length > 1 && (
                <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
                    {sorted.map((img, i) => (
                        <button
                            key={img.id}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            className={
                                "h-14 w-14 shrink-0 overflow-hidden rounded-2xl " +
                                (i === activeIndex ? "ring-2 ring-black" : "opacity-60")
                            }
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <Lightbox
                open={lightboxIndex !== null}
                close={() => setLightboxIndex(null)}
                index={lightboxIndex ?? 0}
                slides={sorted.map((img) => ({ src: img.url }))}
                on={{ view: ({ index }) => setActiveIndex(index) }}
            />
        </div>
    );
}