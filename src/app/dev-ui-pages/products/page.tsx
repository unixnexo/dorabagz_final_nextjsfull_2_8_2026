"use client";

import {
    Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { HomeHeader } from "./home-header";

const categories = [
    {
        title: "پوشاک",
        image: "/site/1.png",
    },
    {
        title: "کفش",
        image: "/site/2.png",
    },
    {
        title: "کیف",
        image: "/site/3.png",
    },
    {
        title: "اکسسوری",
        image: "/site/4.png",
    },
    {
        title: "کوله پشتی",
        image: "/site/5.png",
    },
    {
        title: "لوازم یدکی",
        image: "/site/6.png",
    },
];

const products = [
    {
        id: 1,
        title: "تیشرت لوگو دار",
        price: "2500000",
        image: "/site/1.jpg",
    },
    {
        id: 2,
        title: "شلوارک جین",
        price: "1890000",
        image: "/site/2.jpg",
    },
    {
        id: 3,
        title: "هودی ساده",
        price: "6500000",
        image: "/site/3.jpg",
    },
    {
        id: 4,
        title: "کیف دستی",
        price: "3200000",
        image: "/site/4.jpg",
    },
];

export default function HomePage() {

    const categoriesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = categoriesRef.current;

        if (!el || el.scrollWidth <= el.clientWidth) return;

        const timer = setTimeout(() => {
            const start = el.scrollLeft;
            const distance = -50;
            const duration = 1100;
            const startTime = performance.now();

            const easeInOut = (t: number) =>
                t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeInOut(progress);

                el.scrollLeft = start + distance * eased;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(() => {
                        const returnStart = el.scrollLeft;
                        const returnTime = performance.now();

                        const animateBack = (time: number) => {
                            const elapsedBack = time - returnTime;
                            const progressBack = Math.min(
                                elapsedBack / duration,
                                1
                            );
                            const easedBack = easeInOut(progressBack);

                            el.scrollLeft =
                                returnStart + (start - returnStart) * easedBack;

                            if (progressBack < 1) {
                                requestAnimationFrame(animateBack);
                            }
                        };

                        requestAnimationFrame(animateBack);
                    }, 300);
                }
            };

            requestAnimationFrame(animate);
        }, 800);

        return () => clearTimeout(timer);
    }, []);


    return (
        <main
            className="min-h-screen pt-[88px] text-[#171717]"
        >
            <div className="min-h-screen w-full overflow-hidden">

                {/* Header */}
                <HomeHeader />

                {/* Main content */}
                <div className="relative z-20 rounded-t-[32px] bg-[#f1f2f3] px-4 pb-10 pt-5">

                    {/* Categories */}
                    <div className="relative -mx-4">
                        {/* Left fade */}
                        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#f1f2f3] to-transparent rounded-t-lg" />

                        {/* Right fade */}
                        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#f1f2f3] to-transparent rounded-t-lg" />

                        <div
                            ref={categoriesRef}
                            className="flex gap-2.5 overflow-x-auto px-4 scrollbar-none"
                            dir="rtl"
                        >
                            {categories.map((category) => (
                                <button
                                    key={category.title}
                                    className="group flex w-[calc((100vw-57.5px)/4)] min-w-[calc((100vw-57.5px)/4)] max-w-[120px] flex-col items-center"
                                >
                                    <Card className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[22px] border-0 bg-white shadow-none transition-transform group-active:scale-95">
                                        <img
                                            src={category.image}
                                            alt={category.title}
                                            className="h-[78%] w-[78%] object-contain"
                                        />
                                    </Card>

                                    <span className="mt-2 w-full truncate text-center text-[13px] font-medium">
                                        {category.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <section className="mt-7">
                        <div className="grid grid-cols-2 gap-3">

                            {products.map((product) => (
                                <Card
                                    key={product.id}
                                    className="group overflow-hidden rounded-[25px] border-0 bg-transparent shadow-none"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[0.88] overflow-hidden rounded-[25px] bg-white">

                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                        />

                                        {/* Favorite */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
                                        >
                                            <Heart className="h-[19px] w-[19px] stroke-[1.8]" />
                                        </Button>
                                    </div>

                                    {/* Product info */}
                                    <div className="px-1 pt-2.5">
                                        <h3 className="truncate text-[15px] font-medium">
                                            {product.title}
                                        </h3>

                                        <div className="mt-1 flex items-center gap-1">
                                            <span className="text-[15px] font-bold">
                                                {Number(product.price).toLocaleString("en-US")}
                                            </span>

                                            <span className="text-[12px] text-muted-foreground">
                                                تومن
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}

                        </div>
                    </section>

                </div>

            </div>

            <BottomNav />
        </main>
    );
}