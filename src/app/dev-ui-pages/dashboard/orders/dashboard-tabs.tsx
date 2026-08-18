"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserRound, Package } from "lucide-react";

type DashboardTab = "profile" | "orders";

export function DashboardTabs({
    active,
}: {
    active: DashboardTab;
}) {
    return (
        <div className="relative flex h-[52px] rounded-[20px] bg-white p-1 shadow-sm">
            <Link
                href="/dashboard/profile"
                className="relative flex flex-1 items-center justify-center gap-2 rounded-[16px] text-[14px] font-medium"
            >
                {active === "profile" && (
                    <motion.div
                        layoutId="dashboard-tab"
                        transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                        }}
                        className="absolute inset-0 rounded-[16px] bg-[#171717]"
                    />
                )}

                <span
                    className={`relative z-10 flex items-center gap-2 ${active === "profile"
                            ? "text-white"
                            : "text-black/45"
                        }`}
                >
                    <UserRound className="size-[17px]" />
                    پروفایل
                </span>
            </Link>

            <Link
                href="/dashboard/orders"
                className="relative flex flex-1 items-center justify-center gap-2 rounded-[16px] text-[14px] font-medium"
            >
                {active === "orders" && (
                    <motion.div
                        layoutId="dashboard-tab"
                        transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                        }}
                        className="absolute inset-0 rounded-[16px] bg-[#171717]"
                    />
                )}

                <span
                    className={`relative z-10 flex items-center gap-2 ${active === "orders"
                            ? "text-white"
                            : "text-black/45"
                        }`}
                >
                    <Package className="size-[17px]" />
                    سفارش‌ها
                </span>
            </Link>
        </div>
    );
}