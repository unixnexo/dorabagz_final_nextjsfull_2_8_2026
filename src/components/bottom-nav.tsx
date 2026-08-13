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

const navItems = [
    {
        href: "/dev-ui-pages/products",
        icon: Home,
        label: "خانه",
    },
    {
        href: "/dev-ui-pages/product-detail",
        icon: Search,
        label: "جستجو",
    },
    {
        href: "/favorites",
        icon: Heart,
        label: "علاقه‌مندی‌ها",
    },
    {
        href: "/cart",
        icon: ShoppingCart,
        label: "سبد خرید",
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[500px] px-4 pb-[calc(12px+env(safe-area-inset-bottom))]" dir="ltr">
            <div className="flex h-[74px] items-center justify-around rounded-[28px] bg-[#282E30] shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex h-full flex-1 items-center justify-center outline-none"
                        >
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
                                    className={`size-[26px] ${isActive ? "text-black" : "text-white"
                                        }`}
                                    strokeWidth={isActive ? 2 : 1.7}
                                />
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}