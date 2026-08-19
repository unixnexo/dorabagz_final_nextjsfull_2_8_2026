"use client";

import { Loader2, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import type { AdminUserListItemDTO } from "@/types/user";

export function UserActionMenu({
    user,
    isLoading,
    onToggleActive,
    onUnlock,
    onImpersonate,
}: {
    user: AdminUserListItemDTO;
    isLoading: boolean;
    onToggleActive: () => void;
    onUnlock: () => void;
    onImpersonate: () => void;
}) {
    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    disabled={isLoading}
                    aria-label="عملیات کاربر"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[#636366] transition-colors active:bg-black/[0.08] disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2
                            className="h-4 w-4 animate-spin"
                            strokeWidth={2}
                        />
                    ) : (
                        <MoreHorizontal
                            className="h-4 w-4"
                            strokeWidth={2.25}
                        />
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-52 rounded-2xl border-0 bg-white p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
            >
                <DropdownMenuItem asChild className="rounded-xl">
                    <Link href={`/admin/users/${user.id}`}>
                        مشاهده جزئیات
                    </Link>
                </DropdownMenuItem>

                {user.role === "USER" && (
                    <DropdownMenuItem
                        onClick={onImpersonate}
                        className="rounded-xl"
                    >
                        ورود به حساب کاربر
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="my-1 bg-[#F2F2F7]" />

                <DropdownMenuItem
                    onClick={onToggleActive}
                    className="rounded-xl"
                >
                    {user.isActive
                        ? "غیرفعال کردن کاربر"
                        : "فعال کردن کاربر"}
                </DropdownMenuItem>

                {user.isLocked && (
                    <DropdownMenuItem
                        onClick={onUnlock}
                        className="rounded-xl"
                    >
                        باز کردن قفل حساب
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}