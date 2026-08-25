"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    Home,
    Search,
    Heart,
    ShoppingCart,
} from "lucide-react";

type BottomNavProps = {
    searchOpen: boolean;
    onSearchClick: () => void;
};

const navItems = [
    {
        href: "/",
        icon: Home,
        label: "خانه",
        type: "link",
    },
    {
        icon: Search,
        label: "جستجو",
        type: "search",
    },
    {
        href: "/favorites",
        icon: Heart,
        label: "علاقه‌مندی‌ها",
        type: "link",
    },
    {
        href: "/cart",
        icon: ShoppingCart,
        label: "سبد خرید",
        type: "link",
    },
];

export function BottomNav({
    searchOpen,
    onSearchClick,
}: BottomNavProps) {
    const pathname = usePathname();

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[500px] px-4 pb-[calc(12px+env(safe-area-inset-bottom))]"
            dir="ltr"
        >
            <div className="flex h-[74px] items-center justify-around rounded-[28px] bg-[#282E30] shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
                {navItems.map((item) => {
                    const isSearch = item.type === "search";

                    const isActive = searchOpen
                        ? isSearch
                        : isSearch
                            ? false
                            : item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href!);

                    const Icon = item.icon;

                    const content = (
                        <>
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-active"
                                    className="absolute h-[64px] w-[90%] rounded-[22px] bg-white"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 32,
                                        mass: 0.7,
                                    }}
                                />
                            )}

                            <motion.div
                                className="relative z-10 flex items-center justify-center"
                                animate={{
                                    scale: isActive ? 1 : 0.95,
                                    y: isActive ? 0 : 1,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            >
                                <Icon
                                    className={`size-[26px] ${isActive
                                        ? "text-black"
                                        : "text-white"
                                        }`}
                                    strokeWidth={isActive ? 2 : 1.7}
                                />
                            </motion.div>
                        </>
                    );

                    if (isSearch) {
                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={onSearchClick}
                                className="relative flex h-full flex-1 items-center justify-center outline-none"
                            >
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href!}
                            className="relative flex h-full flex-1 items-center justify-center outline-none"
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}