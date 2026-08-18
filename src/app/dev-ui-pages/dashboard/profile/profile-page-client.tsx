"use client";

import { useState } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { SearchCommand } from "@/components/search-command";
import { ProfileForm } from "./profile-form";
import { LogoutButton } from "@/components/logout-button";

import type { UserDTO } from "@/types/user";
import { DashboardTabs } from "./dashboard-tabs";

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
            <div className="mx-auto min-h-screen w-full max-w-[500px] px-4 pb-[110px] pt-6">

                {/* Header */}
                <header className="mb-6 px-1">
                    <p className="mb-1 text-[12px] font-medium text-black/35">
                        حساب من
                    </p>

                    <h1 className="text-[28px] font-bold tracking-[-0.6px]">
                        پروفایل
                    </h1>
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