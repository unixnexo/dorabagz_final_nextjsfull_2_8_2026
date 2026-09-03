// "use client";

// import { useEffect, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { createPortal } from "react-dom";
// import { ChevronUp, X } from "lucide-react";

// import { Button } from "@/components/ui/button";

// const stories = [
//     {
//         id: 1,
//         title: "پیشنهاد ویژه",
//         image: "/site/1.jpg",
//         description:
//             "پیشنهاد ویژه این هفته را از دست نده. تعدادی از محصولات منتخب فروشگاه با قیمت ویژه ارائه شده‌اند.",
//     },
//     {
//         id: 2,
//         title: "استایل جدید",
//         image: "/site/2.jpg",
//         description:
//             "استایل‌های جدید فصل را ببین و محصولات جدید اضافه‌شده به فروشگاه را بررسی کن.",
//     },
//     {
//         id: 3,
//         title: "محصولات جدید",
//         image: "/site/3.jpg",
//         description:
//             "محصولات جدید فروشگاه همین حالا در دسترس هستند.",
//     },
//     {
//         id: 4,
//         title: "تخفیف‌ها",
//         image: "/site/4.jpg",
//         description:
//             "تعدادی از محصولات منتخب با تخفیف محدود در دسترس هستند.",
//     },
//     {
//         id: 5,
//         title: "اکسسوری",
//         image: "/site/1.jpg",
//         description:
//             "اکسسوری‌های جدید و کاربردی برای کامل کردن استایل روزمره.",
//     },
//     {
//         id: 6,
//         title: "کفش‌ها",
//         image: "/site/2.jpg",
//         description:
//             "مدل‌های جدید کفش را مشاهده کن.",
//     },
// ];

// export function Stories() {
//     const [activeStory, setActiveStory] = useState<number | null>(null);
//     const [detailsOpen, setDetailsOpen] = useState(false);
//     const [mounted, setMounted] = useState(false);

//     const activeStoryData = stories.find(
//         (story) => story.id === activeStory
//     );

//     useEffect(() => {
//         setMounted(true);
//     }, []);

//     useEffect(() => {
//         if (activeStory === null) return;

//         setDetailsOpen(false);

//         const timer = setTimeout(() => {
//             setActiveStory(null);
//         }, 10000);

//         return () => clearTimeout(timer);
//     }, [activeStory]);

//     useEffect(() => {
//         if (activeStory === null) return;

//         const originalOverflow = document.body.style.overflow;
//         document.body.style.overflow = "hidden";

//         return () => {
//             document.body.style.overflow = originalOverflow;
//         };
//     }, [activeStory]);

//     const viewer = (
//         <AnimatePresence>
//             {activeStory !== null && activeStoryData && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="fixed inset-0 z-[9999] bg-black"
//                 >
//                     <motion.div
//                         initial={{ scale: 0.96, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0.98, opacity: 0 }}
//                         transition={{
//                             type: "spring",
//                             stiffness: 300,
//                             damping: 28,
//                         }}
//                         className="relative mx-auto h-full w-full max-w-[500px] overflow-hidden bg-black"
//                     >
//                         {/* Progress */}
//                         <div className="absolute inset-x-3 top-3 z-30">
//                             <div className="h-[3px] overflow-hidden rounded-full bg-white/30">
//                                 <motion.div
//                                     initial={{ width: "0%" }}
//                                     animate={{ width: "100%" }}
//                                     transition={{
//                                         duration: 10,
//                                         ease: "linear",
//                                     }}
//                                     className="h-full rounded-full bg-white"
//                                 />
//                             </div>
//                         </div>

//                         {/* Header */}
//                         <div className="absolute inset-x-4 top-7 z-30 flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                                 <div className="size-9 overflow-hidden rounded-full border border-white/30">
//                                     <img
//                                         src={activeStoryData.image}
//                                         alt=""
//                                         className="h-full w-full object-cover"
//                                     />
//                                 </div>

//                                 <span className="text-[14px] font-semibold text-white">
//                                     فروشگاه
//                                 </span>
//                             </div>

//                             <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => setActiveStory(null)}
//                                 className="size-9 rounded-full bg-black/20 text-white hover:bg-black/30 hover:text-white"
//                             >
//                                 <X className="size-5" />
//                             </Button>
//                         </div>

//                         {/* Story */}
//                         <img
//                             src={activeStoryData.image}
//                             alt={activeStoryData.title}
//                             className="h-full w-full object-cover"
//                         />

//                         {/* Bottom gradient */}
//                         <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

//                         {/* Details trigger */}
//                         <motion.button
//                             type="button"
//                             onClick={() => setDetailsOpen(true)}
//                             initial={{ y: 20, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 0.15 }}
//                             className="absolute inset-x-4 bottom-6 z-30 flex items-center justify-between rounded-[22px] bg-white/15 px-4 py-3 text-right backdrop-blur-xl"
//                         >
//                             <div>
//                                 <p className="text-[14px] font-semibold text-white">
//                                     {activeStoryData.title}
//                                 </p>

//                                 <p className="mt-0.5 text-[12px] text-white/70">
//                                     برای مشاهده جزئیات بکش بالا
//                                 </p>
//                             </div>

//                             <ChevronUp className="size-5 text-white" />
//                         </motion.button>

//                         {/* Story details sheet */}
//                         <AnimatePresence>
//                             {detailsOpen && (
//                                 <>
//                                     <motion.button
//                                         type="button"
//                                         aria-label="بستن توضیحات"
//                                         onClick={() =>
//                                             setDetailsOpen(false)
//                                         }
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         exit={{ opacity: 0 }}
//                                         className="absolute inset-0 z-40 bg-black/30"
//                                     />

//                                     <motion.div
//                                         initial={{ y: "100%" }}
//                                         animate={{ y: 0 }}
//                                         exit={{ y: "100%" }}
//                                         transition={{
//                                             type: "spring",
//                                             stiffness: 300,
//                                             damping: 30,
//                                         }}
//                                         className="absolute inset-x-0 bottom-0 z-50 rounded-t-[32px] bg-[#f1f2f3] px-5 pb-8 pt-3"
//                                     >
//                                         {/* Handle */}
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 setDetailsOpen(false)
//                                             }
//                                             className="mx-auto mb-5 block h-1.5 w-12 rounded-full bg-black/15"
//                                         />

//                                         <div className="text-right">
//                                             <h2 className="text-[20px] font-bold">
//                                                 {activeStoryData.title}
//                                             </h2>

//                                             <p className="mt-3 text-[14px] leading-7 text-black/60">
//                                                 {
//                                                     activeStoryData.description
//                                                 }
//                                             </p>
//                                         </div>

//                                         <Button
//                                             type="button"
//                                             onClick={() =>
//                                                 setDetailsOpen(false)
//                                             }
//                                             className="mt-6 h-12 w-full rounded-2xl"
//                                         >
//                                             بستن
//                                         </Button>
//                                     </motion.div>
//                                 </>
//                             )}
//                         </AnimatePresence>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );

//     return (
//         <>
//             <div className="relative -mx-4">
//                 {/* Left fade */}
//                 <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-[#f1f2f3] to-transparent" />

//                 {/* Right fade */}
//                 <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-8 bg-gradient-to-l from-[#f1f2f3] to-transparent" />

//                 <div
//                     dir="rtl"
//                     className="flex gap-3 overflow-x-auto px-4 scrollbar-none"
//                 >
//                     {stories.map((story) => (
//                         <button
//                             key={story.id}
//                             type="button"
//                             onClick={() => setActiveStory(story.id)}
//                             className="group flex w-[72px] min-w-[72px] flex-col items-center"
//                         >
//                             <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2.5px]">
//                                 <div className="rounded-full bg-[#f1f2f3] p-[2px]">
//                                     <div className="size-[64px] overflow-hidden rounded-full bg-white">
//                                         <img
//                                             src={story.image}
//                                             alt={story.title}
//                                             className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <span className="mt-1.5 w-full truncate text-center text-[11px] font-medium">
//                                 {story.title}
//                             </span>
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {mounted &&
//                 typeof document !== "undefined" &&
//                 createPortal(viewer, document.body)}
//         </>
//     );
// }







"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { ChevronUp, X, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { listActiveStoriesAction, markStoryViewedAction } from "@/server/story/actions";
import type { StoryDTO } from "@/types/story";

const STORY_DURATION_MS = 10000;

export function Stories() {
    const [stories, setStories] = useState<StoryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Tracks which story ids we've already sent a view-ping for during
    // THIS page load, so re-opening a story you already viewed in this
    // session doesn't spam markStoryViewedAction (the action itself is
    // an upsert and safe to call repeatedly, this is just to avoid
    // firing needless requests).
    const pingedRef = useRef<Set<string>>(new Set());

    const activeStory = activeIndex !== null ? stories[activeIndex] : undefined;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const result = await listActiveStoriesAction();
            if (!cancelled && result.success) setStories(result.data);
            if (!cancelled) setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Mark-as-viewed + reset the details sheet whenever the active story
    // changes (including on auto-advance to the next one).
    useEffect(() => {
        if (!activeStory) return;

        setDetailsOpen(false);

        if (!pingedRef.current.has(activeStory.id)) {
            pingedRef.current.add(activeStory.id);
            markStoryViewedAction(activeStory.id);
            // Reflect the view locally too, so the ring updates immediately
            // without waiting for a refetch.
            setStories((prev) =>
                prev.map((s) => (s.id === activeStory.id ? { ...s, isViewed: true } : s))
            );
        }
    }, [activeStory]);

    // Auto-advance timer: goes to the next story, or closes the viewer if
    // this was the last one.
    useEffect(() => {
        if (activeIndex === null) return;

        const timer = setTimeout(() => {
            setActiveIndex((current) => {
                if (current === null) return null;
                const next = current + 1;
                return next < stories.length ? next : null;
            });
        }, STORY_DURATION_MS);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex]);

    useEffect(() => {
        if (activeIndex === null) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [activeIndex]);

    const goToNext = () => {
        setActiveIndex((current) => {
            if (current === null) return null;
            const next = current + 1;
            return next < stories.length ? next : null;
        });
    };

    const goToPrev = () => {
        setActiveIndex((current) => {
            if (current === null || current === 0) return current;
            return current - 1;
        });
    };

    const viewer = (
        <AnimatePresence>
            {activeStory && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] bg-black"
                >
                    <motion.div
                        key={activeStory.id}
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 28,
                        }}
                        className="relative mx-auto h-full w-full max-w-[500px] overflow-hidden bg-black"
                    >
                        {/* Progress bar row — one segment per story, filled
                            for past stories, animating for the current one */}
                        <div className="absolute inset-x-3 top-3 z-30 flex gap-1">
                            {stories.map((s, i) => (
                                <div
                                    key={s.id}
                                    className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
                                >
                                    {i < (activeIndex ?? 0) && (
                                        <div className="h-full w-full bg-white" />
                                    )}
                                    {i === activeIndex && (
                                        <motion.div
                                            key={activeStory.id}
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{
                                                duration: STORY_DURATION_MS / 1000,
                                                ease: "linear",
                                            }}
                                            className="h-full rounded-full bg-white"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Header */}
                        <div className="absolute inset-x-4 top-7 z-30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-9 overflow-hidden rounded-full border border-white/30 bg-white/10">
                                    {activeStory.mediaType === "IMAGE" && (
                                        <img
                                            src={activeStory.mediaUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>

                                <span className="text-[14px] font-semibold text-white">
                                    فروشگاه
                                </span>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setActiveIndex(null)}
                                className="size-9 rounded-full bg-black/20 text-white hover:bg-black/30 hover:text-white"
                            >
                                <X className="size-5" />
                            </Button>
                        </div>

                        {/* Tap zones for prev/next — left third goes back,
                            right two-thirds advances, matches common IG/story UX */}
                        {/* Tap zones — RTL story behavior */}
                        <button
                            type="button"
                            aria-label="استوری بعدی"
                            onClick={goToNext}
                            className="absolute inset-y-0 left-0 z-20 w-1/3"
                        />

                        <button
                            type="button"
                            aria-label="استوری قبلی"
                            onClick={goToPrev}
                            className="absolute inset-y-0 right-0 z-20 w-2/3"
                        />

                        {/* Story media */}
                        {activeStory.mediaType === "VIDEO" ? (
                            <video
                                src={activeStory.mediaUrl}
                                autoPlay
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <img
                                src={activeStory.mediaUrl}
                                alt={activeStory.description ?? ""}
                                className="h-full w-full object-cover"
                            />
                        )}

                        {/* Bottom gradient */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Details trigger — only shown if there's a
                            description or linked products to actually show */}
                        {(activeStory.description || activeStory.linkedProducts.length > 0) && (
                            <motion.button
                                type="button"
                                onClick={() => setDetailsOpen(true)}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="absolute inset-x-4 bottom-6 z-30 flex items-center justify-between rounded-[22px] bg-white/15 px-4 py-3 text-right backdrop-blur-xl"
                            >
                                <div>
                                    <p className="text-[14px] font-semibold text-white">
                                        {activeStory.linkedProducts.length > 0
                                            ? "مشاهده محصولات"
                                            : "جزئیات بیشتر"}
                                    </p>

                                    <p className="mt-0.5 text-[12px] text-white/70">
                                        برای مشاهده جزئیات بکش بالا
                                    </p>
                                </div>

                                <ChevronUp className="size-5 text-white" />
                            </motion.button>
                        )}

                        {/* Story details sheet */}
                        <AnimatePresence>
                            {detailsOpen && (
                                <>
                                    <motion.button
                                        type="button"
                                        aria-label="بستن توضیحات"
                                        onClick={() => setDetailsOpen(false)}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-40 bg-black/30"
                                    />

                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                        className="absolute inset-x-0 bottom-0 z-50 max-h-[75%] overflow-auto rounded-t-[32px] bg-[#f1f2f3] px-5 pb-8 pt-3"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setDetailsOpen(false)}
                                            className="mx-auto mb-5 block h-1.5 w-12 rounded-full bg-black/15"
                                        />

                                        {activeStory.description && (
                                            <div className="text-right">
                                                <p className="text-[14px] leading-7 text-black/70">
                                                    {activeStory.description}
                                                </p>
                                            </div>
                                        )}

                                        {activeStory.linkedProducts.length > 0 && (
                                            <div className={activeStory.description ? "mt-5" : ""}>
                                                <h3 className="mb-3 text-right text-[15px] font-bold">
                                                    محصولات این استوری
                                                </h3>

                                                <div className="space-y-2">
                                                    {activeStory.linkedProducts.map((product) => (
                                                        // <Link
                                                        //     key={product.id}
                                                        //     href={`/products/${product.slug}`}
                                                        //     className="flex items-center gap-3 rounded-[18px] bg-white p-2.5 transition-transform active:scale-[0.98]"
                                                        // >
                                                        <Link
                                                            key={product.id}
                                                            href={`/products/${product.slug}`}
                                                            onClick={() => {
                                                                setDetailsOpen(false);
                                                                setActiveIndex(null);
                                                            }}
                                                            className="flex items-center gap-3 rounded-[18px] bg-white p-2.5 transition-transform active:scale-[0.98]"
                                                        >
                                                            <div className="size-14 shrink-0 overflow-hidden rounded-2xl bg-muted">
                                                                {product.mainImageUrl ? (
                                                                    <img
                                                                        src={product.mainImageUrl}
                                                                        alt={product.title}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center">
                                                                        <ShoppingBag className="size-5 text-black/20" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <span className="truncate text-[14px] font-medium">
                                                                {product.title}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <Button
                                            type="button"
                                            onClick={() => setDetailsOpen(false)}
                                            className="mt-6 h-12 w-full rounded-2xl"
                                        >
                                            بستن
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Nothing to show: no stories, or still loading — render nothing rather
    // than an empty scroll strip with fade edges.
    if (!loading && stories.length === 0) return null;

    return (
        <>
            <div className="relative -mx-4">
                <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-[#f1f2f3] to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-8 bg-gradient-to-l from-[#f1f2f3] to-transparent" />

                <div
                    dir="rtl"
                    className="flex gap-3 overflow-x-auto px-4 scrollbar-none"
                >
                    {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex w-[72px] min-w-[72px] flex-col items-center">
                                <div className="size-[68px] animate-pulse rounded-full bg-black/5" />
                                <div className="mt-1.5 h-3 w-12 animate-pulse rounded bg-black/5" />
                            </div>
                        ))
                        : stories.map((story, index) => (
                            <button
                                key={story.id}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className="group flex w-[72px] min-w-[72px] flex-col items-center"
                            >
                                <div
                                    className={`rounded-full p-[2.5px] ${story.isViewed
                                            ? "bg-black/15"
                                            : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                                        }`}
                                >
                                    <div className="rounded-full bg-[#f1f2f3] p-[2px]">
                                        <div className="size-[64px] overflow-hidden rounded-full bg-white">
                                            {story.mediaType === "IMAGE" ? (
                                                <img
                                                    src={story.mediaUrl}
                                                    alt={story.description ?? ""}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95"
                                                />
                                            ) : (
                                                <video
                                                    src={story.mediaUrl}
                                                    muted
                                                    className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <span className="mt-1.5 w-full truncate text-center text-[11px] font-medium">
                                    {story.description ? story.description.slice(0, 12) : "استوری"}
                                </span>
                            </button>
                        ))}
                </div>
            </div>

            {mounted &&
                typeof document !== "undefined" &&
                createPortal(viewer, document.body)}
        </>
    );
}

