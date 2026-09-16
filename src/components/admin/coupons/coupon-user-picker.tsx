"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { listUsersAction } from "@/server/user/admin-actions";

export function CouponUserPicker({
    selectedUserId,
    selectedUserPhone,
    onChange,
}: {
    selectedUserId: string | null;
    selectedUserPhone: string | null;
    onChange: (userId: string | null, phone: string | null) => void;
}) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["users-for-coupon", debouncedSearch],
        queryFn: async () => {
            const result = await listUsersAction({ page: 1, pageSize: 20, search: search || undefined });
            if (!result.success) throw new Error(result.error);
            return result.data.items;
        },
        enabled: pickerOpen,
    });

    return (
        <div>
            <label className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]">
                مخصوص یک کاربر خاص (اختیاری)
            </label>

            {selectedUserId ? (
                <div className="flex items-center gap-2 rounded-2xl bg-black/[0.04] px-3.5 py-2.5">
                    <User className="h-4 w-4 shrink-0 text-[#8E8E93]" strokeWidth={2.25} />
                    <span className="flex-1 truncate text-[13px] text-[#1C1C1E]">{selectedUserPhone}</span>
                    <button
                        type="button"
                        onClick={() => onChange(null, null)}
                        aria-label="حذف"
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C7C7CC]"
                    >
                        <X className="h-3 w-3 text-white" strokeWidth={2.5} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-right text-[13px] text-[#C7C7CC]"
                >
                    همه کاربران — برای انتخاب بزنید
                </button>
            )}

            <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
                <SheetContent side="bottom" className="max-h-[80dvh] rounded-t-3xl px-4 pb-6 pt-4">
                    <SheetHeader className="mb-3 text-right">
                        <SheetTitle className="text-[15px] font-semibold text-[#1C1C1E]">
                            انتخاب کاربر
                        </SheetTitle>
                    </SheetHeader>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="جستجو با شماره یا نام..."
                        className="mb-3 w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-[13px] text-[#1C1C1E] outline-none placeholder:text-[#C7C7CC]"
                    />

                    <div className="max-h-[55vh] space-y-1.5 overflow-y-auto">
                        {isLoading && (
                            <div className="space-y-1.5">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="h-[46px] animate-pulse rounded-2xl bg-black/[0.04]" />
                                ))}
                            </div>
                        )}

                        {isError && (
                            <p className="py-6 text-center text-[12.5px] font-medium text-[#FF3B30]">
                                خطا در دریافت کاربران
                            </p>
                        )}

                        {!isLoading && !isError && data?.map((u) => (
                            <button
                                key={u.id}
                                type="button"
                                onClick={() => {
                                    onChange(u.id, u.phoneNumber);
                                    setPickerOpen(false);
                                }}
                                className="flex w-full items-center justify-between gap-2 rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-right text-[13px] text-[#1C1C1E]"
                            >
                                <span className="truncate tabular-nums">{u.phoneNumber}</span>
                                {u.fullName && (
                                    <span className="shrink-0 text-[11px] text-[#8E8E93]">{u.fullName}</span>
                                )}
                            </button>
                        ))}

                        {!isLoading && !isError && data && data.length === 0 && (
                            <p className="py-6 text-center text-[12.5px] text-[#8E8E93]">
                                کاربری پیدا نشد
                            </p>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
