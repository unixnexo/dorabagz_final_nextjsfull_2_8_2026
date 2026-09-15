"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    UserRound,
    PackageCheck,
} from "lucide-react";

const tabs = [
    {
        id: "profile",
        label: "پروفایل",
        href: "/dashboard/profile",
        icon: UserRound,
    },
    {
        id: "orders",
        label: "سفارش‌ها",
        href: "/dashboard/orders",
        icon: PackageCheck,
    },
];

export function DashboardTabs({
    active,
}: {
    active: "profile" | "orders";
}) {
    return (
        <div className="rounded-[22px] bg-white p-1.5">
            <div className="relative grid grid-cols-2">
                {tabs.map((tab) => {
                    const isActive = active === tab.id;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className="relative h-[48px]"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dashboard-active-tab"
                                    transition={{
                                        type: "spring",
                                        stiffness: 450,
                                        damping: 32,
                                    }}
                                    className="absolute inset-0 rounded-[17px] bg-brand-secondary"
                                />
                            )}

                            <motion.div
                                animate={{
                                    opacity: isActive ? 1 : 0.4,
                                    scale: isActive ? 1 : 0.96,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                className="relative z-10 flex h-full items-center justify-center gap-2"
                            >
                                <Icon
                                    className="size-[18px]"
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                />

                                <span className="text-[13px] font-semibold">
                                    {tab.label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}