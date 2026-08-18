"use client";

import { usePathname } from "next/navigation";
import { AdminNavSheet } from "./admin-nav-sheet";
import { getAdminPageTitle } from "./admin-nav-items";
import BackButton from "@/components/BackButton";

export function AdminHeader() {
    const pathname = usePathname();
    const title = getAdminPageTitle(pathname);

    return (
        <header className="sticky top-0 z-40 bg-[#F2F2F7]/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-5 pb-3 pt-[calc(env(safe-area-inset-top)+14px)]">
                {/* <h1 className="text-[28px] font-bold leading-none text-[#1C1C1E]">
                    {title}
                </h1> */}
                <BackButton />
                <AdminNavSheet />
            </div>
        </header>
    );
}