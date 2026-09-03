"use client";

import { useEffect, useRef, useState } from "react";
import { Shirt } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import type { CategoryTreeDTO, CategoryDTO } from "@/types/category";
import { useProductFilters } from "@/lib/use-product-filters";

type CategoryBarProps = {
    categories: CategoryTreeDTO[];
};

function CategoryImage({ imageUrl, title, active }: { imageUrl: string | null; title: string; active: boolean }) {
    if (imageUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        );
    }
    return <Shirt className={`h-[38%] w-[38%] ${active ? "text-white" : "text-black/30"}`} strokeWidth={1.5} />;
}

export function CategoryBar({ categories }: CategoryBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { filters, applyFilters } = useProductFilters();
    const [openCategory, setOpenCategory] = useState<CategoryTreeDTO | null>(null);

    // One-time hint-scroll nudge on mount: gently scrolls the strip to hint
    // it's horizontally scrollable, then eases back. Skipped entirely if
    // there's nothing to scroll (content fits the viewport).
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || el.scrollWidth <= el.clientWidth) return;

        const timer = setTimeout(() => {
            const start = el.scrollLeft;
            const distance = -50;
            const duration = 1100;
            const startTime = performance.now();

            const easeInOut = (t: number) =>
                t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                el.scrollLeft = start + distance * easeInOut(progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(() => {
                        const returnStart = el.scrollLeft;
                        const returnTime = performance.now();

                        const animateBack = (time: number) => {
                            const elapsedBack = time - returnTime;
                            const progressBack = Math.min(elapsedBack / duration, 1);
                            el.scrollLeft = returnStart + (start - returnStart) * easeInOut(progressBack);
                            if (progressBack < 1) requestAnimationFrame(animateBack);
                        };

                        requestAnimationFrame(animateBack);
                    }, 300);
                }
            };

            requestAnimationFrame(animate);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // A category is "active" for the ring/fill treatment if it's the
    // selected categoryId itself, OR if the selected categoryId is one of
    // its children — so picking a sub-category still highlights the parent
    // pill in this top-level scroller.
    const isActive = (category: CategoryTreeDTO) =>
        filters.categoryId === category.id ||
        category.children.some((c) => c.id === filters.categoryId);

    const handleTap = (category: CategoryTreeDTO) => {
        if (category.children.length > 0) {
            setOpenCategory(category);
            return;
        }
        applyFilters({ categoryId: isActive(category) ? undefined : category.id });
    };

    const selectChild = (categoryId: string | undefined) => {
        applyFilters({ categoryId });
        setOpenCategory(null);
    };

    return (
        <>
            <div className="relative -mx-4">
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#f1f2f3] to-transparent rounded-t-lg" />
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#f1f2f3] to-transparent rounded-t-lg" />

                <div
                    ref={scrollRef}
                    className="flex gap-2.5 overflow-x-auto px-4 scrollbar-none"
                    dir="rtl"
                >
                    {categories.map((category) => {
                        const active = isActive(category);
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleTap(category)}
                                className="group flex w-[calc((100vw-57.5px)/4)] min-w-[calc((100vw-57.5px)/4)] max-w-[120px] flex-col items-center"
                            >
                                <Card
                                    className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[22px] border-0 shadow-none transition-transform group-active:scale-95 ${
                                        active ? "bg-black" : "bg-white"
                                    }`}
                                >
                                    <CategoryImage imageUrl={category.imageUrl} title={category.title} active={active} />

                                    {/* Small dot indicator if this category has
                                        sub-categories, so it's clear tapping
                                        opens a picker rather than filtering
                                        immediately */}
                                    {category.children.length > 0 && (
                                        <span
                                            className={`absolute bottom-1.5 flex h-[14px] items-center rounded-full px-1.5 text-[9px] font-bold ${
                                                active ? "bg-white text-black" : "bg-black/80 text-white"
                                            }`}
                                        >
                                            {category.children.length}+
                                        </span>
                                    )}
                                </Card>

                                <span className="mt-2 w-full truncate text-center text-[13px] font-medium">
                                    {category.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sub-category picker */}
            <Drawer open={openCategory !== null} onOpenChange={(open) => !open && setOpenCategory(null)}>
                <DrawerContent className="mx-auto max-w-[500px] rounded-t-[32px] border-0 bg-muted px-4">
                    <DrawerHeader className="px-1 pb-4 pt-3">
                        <DrawerTitle className="text-right text-[20px] font-bold">
                            {openCategory?.title}
                        </DrawerTitle>
                    </DrawerHeader>

                    {openCategory && (
                        <div className="grid grid-cols-3 gap-3 pb-8" dir="rtl">
                            {/* "All" tile — picks the whole parent category,
                                not narrowed to any one child */}
                            <button
                                type="button"
                                onClick={() => selectChild(openCategory.id)}
                                className="flex flex-col items-center"
                            >
                                <Card
                                    className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] border-0 shadow-none transition-transform active:scale-95 ${
                                        filters.categoryId === openCategory.id ? "bg-black" : "bg-white"
                                    }`}
                                >
                                    <CategoryImage
                                        imageUrl={openCategory.imageUrl}
                                        title={openCategory.title}
                                        active={filters.categoryId === openCategory.id}
                                    />
                                </Card>
                                <span className="mt-1.5 truncate text-center text-[12px] font-medium">
                                    همه {openCategory.title}
                                </span>
                            </button>

                            {openCategory.children.map((child: CategoryDTO) => (
                                <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => selectChild(child.id)}
                                    className="flex flex-col items-center"
                                >
                                    <Card
                                        className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] border-0 shadow-none transition-transform active:scale-95 ${
                                            filters.categoryId === child.id ? "bg-black" : "bg-white"
                                        }`}
                                    >
                                        <CategoryImage
                                            imageUrl={child.imageUrl}
                                            title={child.title}
                                            active={filters.categoryId === child.id}
                                        />
                                    </Card>
                                    <span className="mt-1.5 truncate text-center text-[12px] font-medium">
                                        {child.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}
