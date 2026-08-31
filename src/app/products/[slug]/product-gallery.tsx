// "use client";

// import { useMemo, useState } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
// import { useRouter } from "next/navigation";
// import type { ProductImageDTO } from "@/types/product";

// /**
//  * Hero image + fullscreen swipeable gallery (kept as a hand-rolled gallery
//  * per your call, not yet-another-react-lightbox — matches the rest of the
//  * app less, but keeps this page's custom look/feel from the design ref).
//  *
//  * If a videoUrl is present it's appended as the last "slide" in the
//  * fullscreen gallery (thumbnail shows a play icon instead of an image).
//  *
//  * hasDiscount shows a small badge on the hero so buyers know at a glance
//  * this product currently has a discounted variant.
//  *
//  * layoutId (optional): when provided, the hero image renders as a plain
//  * motion.img instead of next/image's <Image>, so Framer Motion can morph
//  * it from the matching layoutId on ProductCard's image during the
//  * intercepted-route overlay transition. Omitted entirely on the real
//  * /products/[slug] page (hard loads/refreshes) — there's no card to morph
//  * from there, so it just renders as a normal optimized <Image>.
//  */
// export function ProductGallery({
//     images,
//     videoUrl,
//     title,
//     hasDiscount,
//     layoutId,
// }: {
//     images: ProductImageDTO[];
//     videoUrl: string | null;
//     title: string;
//     hasDiscount: boolean;
//     layoutId?: string;
// }) {
//     const router = useRouter();
//     const [galleryOpen, setGalleryOpen] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(0);

//     const sortedImages = useMemo(
//         () =>
//             [...images].sort((a, b) => {
//                 if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
//                 return a.sortOrder - b.sortOrder;
//             }),
//         [images]
//     );

//     // slides = images, plus the video as a trailing slide if present
//     const slideCount = sortedImages.length + (videoUrl ? 1 : 0);
//     const heroImage = sortedImages[0];

//     const openGallery = (index: number) => {
//         setActiveIndex(index);
//         setGalleryOpen(true);
//     };

//     const closeGallery = () => setGalleryOpen(false);

//     const nextSlide = () => setActiveIndex((i) => (i === slideCount - 1 ? 0 : i + 1));
//     const previousSlide = () => setActiveIndex((i) => (i === 0 ? slideCount - 1 : i - 1));

//     const isVideoSlide = (index: number) => videoUrl !== null && index === sortedImages.length;

//     if (!heroImage && !videoUrl) return null;

//     return (
//         <>
//             <div
//                 className="relative h-[420px] w-full overflow-hidden cursor-pointer"
//                 onClick={() => openGallery(0)}
//             >
//                 {heroImage ? (
//                     layoutId ? (
//                         <motion.img
//                             layoutId={layoutId}
//                             src={heroImage.url}
//                             alt={title}
//                             className="h-full w-full object-cover"
//                         />
//                     ) : (
//                         <Image
//                             src={heroImage.url}
//                             alt={title}
//                             fill
//                             priority
//                             className="object-cover transition-transform duration-500 active:scale-[0.98]"
//                         />
//                     )
//                 ) : (
//                     // no images at all, only a video — show a simple play affordance
//                     <div className="flex h-full w-full items-center justify-center bg-muted">
//                         <Play className="h-12 w-12 text-muted-foreground" />
//                     </div>
//                 )}

//                 <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-background/70 to-background" />

//                 {hasDiscount && (
//                     <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-l from-rose-500 to-orange-400 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-500/30">
//                         <Sparkles className="h-3.5 w-3.5" />
//                         تخفیف ویژه
//                     </div>
//                 )}

//                 {!layoutId && (
//                     <div className="absolute left-4 top-4 z-10" onClick={(e) => e.stopPropagation()}>
//                         <Button
//                             size="icon"
//                             variant="ghost"
//                             className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-xl shadow-sm"
//                             onClick={() => router.back()}
//                         >
//                             <ArrowLeft className="h-5 w-5" />
//                         </Button>
//                     </div>
//                 )}

//                 {slideCount > 1 && (
//                     <div className="pointer-events-none absolute bottom-0 -right-3 z-10">
//                         <div className="size-24 rounded-full">
//                             <DotLottieReact src="/lottie/Hand_Swipe.lottie" loop autoplay className="h-full w-full" />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {galleryOpen && (
//                 <div className="fixed inset-0 z-50 bg-black" dir="rtl">
//                     <button
//                         onClick={closeGallery}
//                         className="absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
//                     >
//                         <X className="h-5 w-5" />
//                     </button>

//                     <div className="absolute right-1/2 top-5 z-50 translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xl">
//                         {activeIndex + 1} / {slideCount}
//                     </div>

//                     <div className="relative flex h-full w-full items-center justify-center">
//                         {isVideoSlide(activeIndex) ? (
//                             <video controls autoPlay className="max-h-full max-w-full">
//                                 <source src={videoUrl!} />
//                             </video>
//                         ) : (
//                             <Image
//                                 src={sortedImages[activeIndex].url}
//                                 alt={`${title} ${activeIndex + 1}`}
//                                 fill
//                                 className="object-contain"
//                                 priority
//                             />
//                         )}

//                         {slideCount > 1 && (
//                             <>
//                                 <button
//                                     onClick={previousSlide}
//                                     className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
//                                 >
//                                     <ChevronRight className="h-6 w-6" />
//                                 </button>
//                                 <button
//                                     onClick={nextSlide}
//                                     className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
//                                 >
//                                     <ChevronLeft className="h-6 w-6" />
//                                 </button>
//                             </>
//                         )}
//                     </div>

//                     {slideCount > 1 && (
//                         <div className="absolute bottom-6 right-1/2 flex translate-x-1/2 gap-2 rounded-2xl bg-black/40 p-2 backdrop-blur-xl">
//                             {sortedImages.map((img, index) => (
//                                 <button
//                                     key={img.id}
//                                     onClick={() => setActiveIndex(index)}
//                                     className={`relative h-12 w-12 overflow-hidden rounded-lg transition-all ${activeIndex === index ? "ring-2 ring-white" : "opacity-60"
//                                         }`}
//                                 >
//                                     <Image src={img.url} alt="" fill className="object-cover" />
//                                 </button>
//                             ))}
//                             {videoUrl && (
//                                 <button
//                                     onClick={() => setActiveIndex(sortedImages.length)}
//                                     className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white/10 transition-all ${activeIndex === sortedImages.length ? "ring-2 ring-white" : "opacity-60"
//                                         }`}
//                                 >
//                                     <Play className="h-5 w-5 text-white" />
//                                 </button>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </>
//     );
// }

















"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProductImageDTO } from "@/types/product";

/**
 * Hero image + fullscreen swipeable gallery (kept as a hand-rolled gallery
 * per your call, not yet-another-react-lightbox — matches the rest of the
 * app less, but keeps this page's custom look/feel from the design ref).
 *
 * If a videoUrl is present it's appended as the last "slide" in the
 * fullscreen gallery (thumbnail shows a play icon instead of an image).
 *
 * hasDiscount shows a small badge on the hero so buyers know at a glance
 * this product currently has a discounted variant.
 *
 * layoutId (optional): when provided, the hero image renders as a plain
 * motion.img instead of next/image's <Image>, so Framer Motion can morph
 * it from the matching layoutId on ProductCard's image during the
 * intercepted-route overlay transition. Omitted entirely on the real
 * /products/[slug] page (hard loads/refreshes) — there's no card to morph
 * from there, so it just renders as a normal optimized <Image>.
 */
export function ProductGallery({
    images,
    videoUrl,
    title,
    hasDiscount,
    layoutId,
}: {
    images: ProductImageDTO[];
    videoUrl: string | null;
    title: string;
    hasDiscount: boolean;
    layoutId?: string;
}) {
    const router = useRouter();
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const sortedImages = useMemo(
        () =>
            [...images].sort((a, b) => {
                if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
                return a.sortOrder - b.sortOrder;
            }),
        [images]
    );

    // slides = images, plus the video as a trailing slide if present
    const slideCount = sortedImages.length + (videoUrl ? 1 : 0);
    const heroImage = sortedImages[0];

    const openGallery = (index: number) => {
        setActiveIndex(index);
        setGalleryOpen(true);
    };

    const closeGallery = () => setGalleryOpen(false);

    const nextSlide = () => setActiveIndex((i) => (i === slideCount - 1 ? 0 : i + 1));
    const previousSlide = () => setActiveIndex((i) => (i === 0 ? slideCount - 1 : i - 1));

    const isVideoSlide = (index: number) => videoUrl !== null && index === sortedImages.length;

    if (!heroImage && !videoUrl) return null;

    return (
        <>
            <div
                className="relative h-[420px] w-full overflow-hidden cursor-pointer"
                onClick={() => openGallery(0)}
            >
                {heroImage ? (
                    layoutId ? (
                        <motion.div layoutId={layoutId} className="absolute inset-0 h-full w-full overflow-hidden">
                            <img src={heroImage.url} alt={title} className="h-full w-full object-cover" />
                        </motion.div>
                    ) : (
                        <Image
                            src={heroImage.url}
                            alt={title}
                            fill
                            priority
                            className="object-cover transition-transform duration-500 active:scale-[0.98]"
                        />
                    )
                ) : (
                    // no images at all, only a video — show a simple play affordance
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-background/70 to-background" />

                {hasDiscount && (
                    <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-l from-rose-500 to-orange-400 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-500/30">
                        <Sparkles className="h-3.5 w-3.5" />
                        تخفیف ویژه
                    </div>
                )}

                {!layoutId && (
                    <div className="absolute left-4 top-4 z-10" onClick={(e) => e.stopPropagation()}>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-xl shadow-sm"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                {slideCount > 1 && (
                    <div className="pointer-events-none absolute bottom-0 -right-3 z-10">
                        <div className="size-24 rounded-full">
                            <DotLottieReact src="/lottie/Hand_Swipe.lottie" loop autoplay className="h-full w-full" />
                        </div>
                    </div>
                )}
            </div>

            {galleryOpen && (
                <div className="fixed inset-0 z-50 bg-black" dir="rtl">
                    <button
                        onClick={closeGallery}
                        className="absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="absolute right-1/2 top-5 z-50 translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xl">
                        {activeIndex + 1} / {slideCount}
                    </div>

                    <div className="relative flex h-full w-full items-center justify-center">
                        {isVideoSlide(activeIndex) ? (
                            <video controls autoPlay className="max-h-full max-w-full">
                                <source src={videoUrl!} />
                            </video>
                        ) : (
                            <Image
                                src={sortedImages[activeIndex].url}
                                alt={`${title} ${activeIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        )}

                        {slideCount > 1 && (
                            <>
                                <button
                                    onClick={previousSlide}
                                    className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {slideCount > 1 && (
                        <div className="absolute bottom-6 right-1/2 flex translate-x-1/2 gap-2 rounded-2xl bg-black/40 p-2 backdrop-blur-xl">
                            {sortedImages.map((img, index) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveIndex(index)}
                                    className={`relative h-12 w-12 overflow-hidden rounded-lg transition-all ${activeIndex === index ? "ring-2 ring-white" : "opacity-60"
                                        }`}
                                >
                                    <Image src={img.url} alt="" fill className="object-cover" />
                                </button>
                            ))}
                            {videoUrl && (
                                <button
                                    onClick={() => setActiveIndex(sortedImages.length)}
                                    className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white/10 transition-all ${activeIndex === sortedImages.length ? "ring-2 ring-white" : "opacity-60"
                                        }`}
                                >
                                    <Play className="h-5 w-5 text-white" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}


