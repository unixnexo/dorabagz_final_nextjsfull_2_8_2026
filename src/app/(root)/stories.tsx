// "use client";

// import { useEffect, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { X } from "lucide-react";

// import { Button } from "@/components/ui/button";

// const stories = [
//     {
//         id: 1,
//         title: "پیشنهاد ویژه",
//         image: "/site/1.jpg",
//     },
//     {
//         id: 2,
//         title: "استایل جدید",
//         image: "/site/2.jpg",
//     },
//     {
//         id: 3,
//         title: "محصولات جدید",
//         image: "/site/3.jpg",
//     },
//     {
//         id: 4,
//         title: "تخفیف‌ها",
//         image: "/site/4.jpg",
//     },
//     {
//         id: 5,
//         title: "اکسسوری",
//         image: "/site/1.jpg",
//     },
//     {
//         id: 6,
//         title: "کفش‌ها",
//         image: "/site/2.jpg",
//     },
// ];

// export function Stories() {
//     const storiesRef = useRef<HTMLDivElement>(null);
//     const [activeStory, setActiveStory] = useState<number | null>(null);

//     useEffect(() => {
//         if (activeStory === null) return;

//         const timer = setTimeout(() => {
//             setActiveStory(null);
//         }, 10000);

//         return () => clearTimeout(timer);
//     }, [activeStory]);

//     return (
//         <>
//             <div className="relative -mx-4">
//                 {/* Left fade */}
//                 <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-[#f1f2f3] to-transparent" />

//                 {/* Right fade */}
//                 <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-8 bg-gradient-to-l from-[#f1f2f3] to-transparent" />

//                 <div
//                     ref={storiesRef}
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
//                             {/* Instagram-style ring */}
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

//             {/* Story viewer */}
//             <AnimatePresence>
//                 {activeStory !== null && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="fixed inset-0 z-50 bg-black"
//                     >
//                         <motion.div
//                             initial={{ scale: 0.94, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             exit={{ scale: 0.96, opacity: 0 }}
//                             transition={{
//                                 type: "spring",
//                                 stiffness: 300,
//                                 damping: 28,
//                             }}
//                             className="relative mx-auto h-full w-full max-w-[500px] overflow-hidden bg-black"
//                         >
//                             {/* Story progress */}
//                             <div className="absolute inset-x-3 top-3 z-20">
//                                 <div className="h-[3px] overflow-hidden rounded-full bg-white/30">
//                                     <motion.div
//                                         initial={{ width: "0%" }}
//                                         animate={{ width: "100%" }}
//                                         transition={{
//                                             duration: 10,
//                                             ease: "linear",
//                                         }}
//                                         className="h-full rounded-full bg-white"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Header */}
//                             <div className="absolute inset-x-4 top-7 z-20 flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className="size-9 overflow-hidden rounded-full border border-white/30">
//                                         <img
//                                             src={
//                                                 stories.find(
//                                                     (story) =>
//                                                         story.id === activeStory
//                                                 )?.image
//                                             }
//                                             alt=""
//                                             className="h-full w-full object-cover"
//                                         />
//                                     </div>

//                                     <span className="text-[14px] font-semibold text-white">
//                                         فروشگاه
//                                     </span>
//                                 </div>

//                                 <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={() => setActiveStory(null)}
//                                     className="size-9 rounded-full bg-black/20 text-white hover:bg-black/30 hover:text-white"
//                                 >
//                                     <X className="size-5" />
//                                 </Button>
//                             </div>

//                             {/* Story image */}
//                             <img
//                                 src={
//                                     stories.find(
//                                         (story) => story.id === activeStory
//                                     )?.image
//                                 }
//                                 alt=""
//                                 className="h-full w-full object-cover"
//                             />

//                             {/* Bottom gradient */}
//                             <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// }






"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { ChevronUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const stories = [
    {
        id: 1,
        title: "پیشنهاد ویژه",
        image: "/site/1.jpg",
        description:
            "پیشنهاد ویژه این هفته را از دست نده. تعدادی از محصولات منتخب فروشگاه با قیمت ویژه ارائه شده‌اند.",
    },
    {
        id: 2,
        title: "استایل جدید",
        image: "/site/2.jpg",
        description:
            "استایل‌های جدید فصل را ببین و محصولات جدید اضافه‌شده به فروشگاه را بررسی کن.",
    },
    {
        id: 3,
        title: "محصولات جدید",
        image: "/site/3.jpg",
        description:
            "محصولات جدید فروشگاه همین حالا در دسترس هستند.",
    },
    {
        id: 4,
        title: "تخفیف‌ها",
        image: "/site/4.jpg",
        description:
            "تعدادی از محصولات منتخب با تخفیف محدود در دسترس هستند.",
    },
    {
        id: 5,
        title: "اکسسوری",
        image: "/site/1.jpg",
        description:
            "اکسسوری‌های جدید و کاربردی برای کامل کردن استایل روزمره.",
    },
    {
        id: 6,
        title: "کفش‌ها",
        image: "/site/2.jpg",
        description:
            "مدل‌های جدید کفش را مشاهده کن.",
    },
];

export function Stories() {
    const [activeStory, setActiveStory] = useState<number | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const activeStoryData = stories.find(
        (story) => story.id === activeStory
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (activeStory === null) return;

        setDetailsOpen(false);

        const timer = setTimeout(() => {
            setActiveStory(null);
        }, 10000);

        return () => clearTimeout(timer);
    }, [activeStory]);

    useEffect(() => {
        if (activeStory === null) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [activeStory]);

    const viewer = (
        <AnimatePresence>
            {activeStory !== null && activeStoryData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] bg-black"
                >
                    <motion.div
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
                        {/* Progress */}
                        <div className="absolute inset-x-3 top-3 z-30">
                            <div className="h-[3px] overflow-hidden rounded-full bg-white/30">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 10,
                                        ease: "linear",
                                    }}
                                    className="h-full rounded-full bg-white"
                                />
                            </div>
                        </div>

                        {/* Header */}
                        <div className="absolute inset-x-4 top-7 z-30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-9 overflow-hidden rounded-full border border-white/30">
                                    <img
                                        src={activeStoryData.image}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <span className="text-[14px] font-semibold text-white">
                                    فروشگاه
                                </span>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setActiveStory(null)}
                                className="size-9 rounded-full bg-black/20 text-white hover:bg-black/30 hover:text-white"
                            >
                                <X className="size-5" />
                            </Button>
                        </div>

                        {/* Story */}
                        <img
                            src={activeStoryData.image}
                            alt={activeStoryData.title}
                            className="h-full w-full object-cover"
                        />

                        {/* Bottom gradient */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Details trigger */}
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
                                    {activeStoryData.title}
                                </p>

                                <p className="mt-0.5 text-[12px] text-white/70">
                                    برای مشاهده جزئیات بکش بالا
                                </p>
                            </div>

                            <ChevronUp className="size-5 text-white" />
                        </motion.button>

                        {/* Story details sheet */}
                        <AnimatePresence>
                            {detailsOpen && (
                                <>
                                    <motion.button
                                        type="button"
                                        aria-label="بستن توضیحات"
                                        onClick={() =>
                                            setDetailsOpen(false)
                                        }
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
                                        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[32px] bg-[#f1f2f3] px-5 pb-8 pt-3"
                                    >
                                        {/* Handle */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDetailsOpen(false)
                                            }
                                            className="mx-auto mb-5 block h-1.5 w-12 rounded-full bg-black/15"
                                        />

                                        <div className="text-right">
                                            <h2 className="text-[20px] font-bold">
                                                {activeStoryData.title}
                                            </h2>

                                            <p className="mt-3 text-[14px] leading-7 text-black/60">
                                                {
                                                    activeStoryData.description
                                                }
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setDetailsOpen(false)
                                            }
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

    return (
        <>
            <div className="relative -mx-4">
                {/* Left fade */}
                <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-[#f1f2f3] to-transparent" />

                {/* Right fade */}
                <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-8 bg-gradient-to-l from-[#f1f2f3] to-transparent" />

                <div
                    dir="rtl"
                    className="flex gap-3 overflow-x-auto px-4 scrollbar-none"
                >
                    {stories.map((story) => (
                        <button
                            key={story.id}
                            type="button"
                            onClick={() => setActiveStory(story.id)}
                            className="group flex w-[72px] min-w-[72px] flex-col items-center"
                        >
                            <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2.5px]">
                                <div className="rounded-full bg-[#f1f2f3] p-[2px]">
                                    <div className="size-[64px] overflow-hidden rounded-full bg-white">
                                        <img
                                            src={story.image}
                                            alt={story.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95"
                                        />
                                    </div>
                                </div>
                            </div>

                            <span className="mt-1.5 w-full truncate text-center text-[11px] font-medium">
                                {story.title}
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

