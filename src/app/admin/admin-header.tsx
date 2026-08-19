"use client";

import { usePathname } from "next/navigation";
import { AdminNavSheet } from "./admin-nav-sheet";
import { getAdminPageTitle } from "./admin-nav-items";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Home } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export function AdminHeader() {
    const pathname = usePathname();
    const title = getAdminPageTitle(pathname);

    return (
        <header className="sticky top-0 z-40 bg-[#F2F2F7]/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-5 pb-3 pt-[calc(env(safe-area-inset-top)+14px)]">
                <AdminNavSheet />
                <div className="flex items-center space-x-3 space-x-reverse">
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="flex size-11 items-center justify-center rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70 hover:text-black active:scale-90 active:bg-white/80"
                    >
                        <Link href="/">
                            <Home className="!size-[18px] text-black/70" />
                        </Link>
                    </Button>
                    <LogoutButton variant="icon" />
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="flex size-11 items-center justify-center rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70 hover:text-black active:scale-90 active:bg-white/80"
                    >
                        <Link href="/notifications">
                            <Bell className="!size-[18px] text-black/70" />
                        </Link>
                    </Button>
                    <BackButton fixed={false} />
                </div>
            </div>
        </header>
    );
}