"use client";

import { useState } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { SearchCommand } from "@/components/search-command";
import { ProfileForm } from "./profile-form";
import { LogoutButton } from "@/components/logout-button";

import type { UserDTO } from "@/types/user";
import { DashboardTabs } from "./dashboard-tabs";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";

export function ProfilePageClient({
    user,
}: {
    user: UserDTO;
}) {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#f1f2f3] text-[#171717]"
        >
            <div className="mx-auto min-h-screen w-full max-w-[500px] px-4 pb-[110px] pt-5">

                {/* Header */}
                <header className="mb-6 px-1">
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="size-11 rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl hover:bg-[#eeeeee]"
                    >
                        <Link href="/notifications">
                            <Bell className="!size-5 text-black/70" />
                        </Link>
                    </Button>

                    <BackButton />
                </header>

                {/* Tabs */}
                <DashboardTabs active="profile" />

                {/* Profile */}
                <div className="mt-5">
                    <ProfileForm user={user} />
                </div>

                {/* Logout */}
                <div className="mt-4 rounded-[28px] bg-white p-2">
                    <LogoutButton />
                </div>
            </div>

            <SearchCommand
                open={searchOpen}
                onOpenChange={setSearchOpen}
            />

            <BottomNav
                searchOpen={searchOpen}
                onSearchClick={() => setSearchOpen(true)}
            />
        </main>
    );
}