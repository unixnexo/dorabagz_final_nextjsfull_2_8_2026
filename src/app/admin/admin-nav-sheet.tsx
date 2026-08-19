"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronLeft } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { ADMIN_NAV_ITEMS } from "./admin-nav-items";
import { cn } from "@/lib/utils";

export function AdminNavSheet() {
    const pathname = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="باز کردن منو"
                    className="flex size-11 items-center justify-center rounded-2xl bg-black/[0.04] active:bg-black/[0.08] transition-colors"
                >
                    <Menu className="h-5 w-5 text-[#1C1C1E]" strokeWidth={2.25} />
                </button>
            </SheetTrigger>

            {/* RTL layout -> the leading edge is the right side */}
            <SheetContent
                side="right"
                className="w-[86%] max-w-[360px] rounded-r-none rounded-l-3xl border-0 bg-[#F2F2F7] p-0"
            >
                <SheetHeader className="px-6 pb-2 pt-8 text-right">
                    <SheetTitle className="absolute right-4 top-4 text-right text-[22px] font-bold text-[#1C1C1E]">
                        پنل مدیریت
                    </SheetTitle>
                </SheetHeader>

                <nav className="mt-8 px-4">
                    <ul className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        {ADMIN_NAV_ITEMS.map((item, index) => {
                            const isActive = pathname.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <li key={item.href}>
                                    <SheetClose asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3.5 active:bg-black/[0.03] transition-colors",
                                                index !== ADMIN_NAV_ITEMS.length - 1 &&
                                                "border-b border-[#E5E5EA]"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                                    isActive ? "bg-[#0A7D5C]" : "bg-black/[0.05]"
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "h-4 w-4",
                                                        isActive ? "text-white" : "text-[#636366]"
                                                    )}
                                                    strokeWidth={2.25}
                                                />
                                            </span>
                                            <span
                                                className={cn(
                                                    "flex-1 text-[15px]",
                                                    isActive
                                                        ? "font-semibold text-[#0A7D5C]"
                                                        : "text-[#1C1C1E]"
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                            <ChevronLeft
                                                className="h-4 w-4 text-[#C7C7CC]"
                                                strokeWidth={2.25}
                                            />
                                        </Link>
                                    </SheetClose>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
}