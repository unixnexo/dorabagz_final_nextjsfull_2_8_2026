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
import { Bell, CircleHelp } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

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
            <div className="mx-auto min-h-screen w-full max-w-[500px] px-4 pb-[110px] pt-4">

                {/* Header */}
                <header className="mb-6 px-1 space-x-2 space-x-reverse">
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="size-14 rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl hover:bg-[#eeeeee]"
                    >
                        <Link href="/notifications">
                            <Bell className="!size-6 text-black/70" />
                        </Link>
                    </Button>

                    {/* Help */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-14 rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl hover:bg-[#eeeeee]"
                            >
                                <CircleHelp className="!size-6 text-black/70" />
                            </Button>
                        </DrawerTrigger>

                        <DrawerContent
                            className="mx-auto max-w-[500px] rounded-t-[32px] border-0 bg-muted px-4"
                        >
                            <DrawerHeader className="px-1 pb-5 pt-3">
                                <DrawerTitle className="text-right text-[20px] font-bold mt-6">
                                    راهنما و پشتیبانی
                                </DrawerTitle>
                            </DrawerHeader>

                            <div className="space-y-2 pb-4">
                                <Link
                                    href="/faq"
                                    className="flex h-[64px] items-center justify-between rounded-[20px] bg-white px-4 transition-transform active:scale-[0.98]"
                                >
                                    <div>
                                        <p className="text-[15px] font-semibold">
                                            سوالات متداول
                                        </p>
                                        <p className="mt-1 text-[12px] text-muted-foreground">
                                            پاسخ سوالات رایج
                                        </p>
                                    </div>

                                    <CircleHelp className="size-5 text-black/40" />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="flex h-[64px] items-center justify-between rounded-[20px] bg-white px-4 transition-transform active:scale-[0.98]"
                                >
                                    <div>
                                        <p className="text-[15px] font-semibold">
                                            تماس با ما
                                        </p>
                                        <p className="mt-1 text-[12px] text-muted-foreground">
                                            ارتباط با پشتیبانی
                                        </p>
                                    </div>

                                    <CircleHelp className="size-5 text-black/40" />
                                </Link>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <BackButton size="big" />
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