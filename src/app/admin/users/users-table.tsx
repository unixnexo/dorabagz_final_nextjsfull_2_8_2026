// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   listUsersAction,
//   setUserActiveAction,
//   unlockUserAction,
// } from "@/server/user/admin-actions";
// import { startImpersonationAction } from "@/server/user/impersonation-actions";

// export function AdminUsersTable() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["admin-users", page, search],
//     queryFn: async () => {
//       const result = await listUsersAction({ page, pageSize: 20, search: search || undefined });
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   async function handleToggleActive(userId: string, current: boolean) {
//     await setUserActiveAction(userId, !current);
//     queryClient.invalidateQueries({ queryKey: ["admin-users"] });
//   }

//   async function handleUnlock(userId: string) {
//     await unlockUserAction(userId);
//     queryClient.invalidateQueries({ queryKey: ["admin-users"] });
//   }

//   async function handleImpersonate(userId: string) {
//     const result = await startImpersonationAction(userId);
//     if (result.success) {
//       window.location.href = result.data.redirectTo;
//     } else {
//       alert(result.error);
//     }
//   }

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="جستجو بر اساس شماره یا نام..."
//         value={search}
//         onChange={(e) => {
//           setSearch(e.target.value);
//           setPage(1);
//         }}
//         style={{ width: "100%", padding: 8, marginBottom: 16 }}
//       />

//       {isLoading && <p>در حال بارگذاری...</p>}
//       {isError && <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>}

//       {data && (
//         <>
//           <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th>شماره موبایل</th>
//                 <th>نام</th>
//                 <th>نقش</th>
//                 <th>وضعیت</th>
//                 <th>قفل</th>
//                 <th>عملیات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items.map((u) => (
//                 <tr key={u.id}>
//                   <td>
//                     <Link href={`/admin/users/${u.id}`}>{u.phoneNumber}</Link>
//                   </td>
//                   <td>{u.fullName ?? "-"}</td>
//                   <td>{u.role}</td>
//                   <td>{u.isActive ? "فعال" : "غیرفعال"}</td>
//                   <td>{u.isLocked ? "قفل" : "-"}</td>
//                   <td style={{ display: "flex", gap: 4 }}>
//                     <button onClick={() => handleToggleActive(u.id, u.isActive)}>
//                       {u.isActive ? "غیرفعال کردن" : "فعال کردن"}
//                     </button>
//                     {u.isLocked && <button onClick={() => handleUnlock(u.id)}>باز کردن قفل</button>}
//                     {u.role === "USER" && (
//                       <button onClick={() => handleImpersonate(u.id)}>ورود به حساب</button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
//             <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
//               قبلی
//             </button>
//             <span>
//               صفحه {data.page} از {data.totalPages}
//             </span>
//             <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
//               بعدی
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    CircleUserRound,
    Ellipsis,
    LockKeyhole,
    LogIn,
    ShieldCheck,
    UserRoundCheck,
    UserRoundX,
    Unlock,
} from "lucide-react";

import {
    listUsersAction,
    setUserActiveAction,
    unlockUserAction,
} from "@/server/user/admin-actions";
import { startImpersonationAction } from "@/server/user/impersonation-actions";

import { UserSearchField } from "@/components/admin/users/user-search-field";
import { UsersFilterBar } from "@/components/admin/users/users-filter-bar";
import { UserListSkeleton } from "@/components/admin/users/user-list-skeleton";
import { UserActionMenu } from "@/components/admin/users/user-action-menu";
import type { AdminUserListItemDTO } from "@/types/user";
import { cn } from "@/lib/utils";

export function AdminUsersTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [role, setRole] = useState("");
    const [activeFilter, setActiveFilter] = useState<
        "all" | "active" | "inactive"
    >("all");

    const [actionError, setActionError] = useState<string | null>(null);
    const [actionUserId, setActionUserId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);


    const queryClient = useQueryClient();

    const isActive =
        activeFilter === "all"
            ? undefined
            : activeFilter === "active";

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-users", page, debouncedSearch, role, activeFilter],
        queryFn: async () => {
            const result = await listUsersAction({
                page,
                pageSize: 20,
                search: debouncedSearch || undefined,
                role: role || undefined,
                isActive,
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        },
    });

    function invalidateUsers() {
        queryClient.invalidateQueries({
            queryKey: ["admin-users"],
        });
    }

    async function handleToggleActive(
        userId: string,
        current: boolean
    ) {
        setActionError(null);
        setActionUserId(userId);

        const result = await setUserActiveAction(userId, !current);

        setActionUserId(null);

        if (!result.success) {
            setActionError(result.error);
            return;
        }

        invalidateUsers();
    }

    async function handleUnlock(userId: string) {
        setActionError(null);
        setActionUserId(userId);

        const result = await unlockUserAction(userId);

        setActionUserId(null);

        if (!result.success) {
            setActionError(result.error);
            return;
        }

        invalidateUsers();
    }

    async function handleImpersonate(userId: string) {
        setActionError(null);
        setActionUserId(userId);

        const result = await startImpersonationAction(userId);

        if (!result.success) {
            setActionUserId(null);
            setActionError(result.error);
            return;
        }

        window.location.href = result.data.redirectTo;
    }

    function resetToFirstPage() {
        setPage(1);
    }

    function handleSearchChange(value: string) {
        setSearch(value);
        resetToFirstPage();
    }

    function handleRoleChange(value: string) {
        setRole(value);
        resetToFirstPage();
    }

    function handleActiveFilterChange(
        value: "all" | "active" | "inactive"
    ) {
        setActiveFilter(value);
        resetToFirstPage();
    }

    return (
        <div>
            <div className="space-y-3 pt-4">
                <UserSearchField
                    value={search}
                    onChange={handleSearchChange}
                />

                <UsersFilterBar
                    role={role}
                    activeFilter={activeFilter}
                    onRoleChange={handleRoleChange}
                    onActiveFilterChange={handleActiveFilterChange}
                />
            </div>

            {actionError && (
                <div className="mt-3 rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
                    {actionError}
                </div>
            )}

            <div className="mt-4">
                {isLoading ? (
                    <UserListSkeleton />
                ) : isError ? (
                    <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <p className="text-[13.5px] font-medium text-[#FF3B30]">
                            خطا در دریافت کاربران
                        </p>
                    </div>
                ) : !data || data.items.length === 0 ? (
                    <EmptyUsersState />
                ) : (
                    <>
                        <div className="space-y-2.5">
                            {data.items.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    isActionLoading={
                                        actionUserId === user.id
                                    }
                                    onToggleActive={() =>
                                        handleToggleActive(
                                            user.id,
                                            user.isActive
                                        )
                                    }
                                    onUnlock={() =>
                                        handleUnlock(user.id)
                                    }
                                    onImpersonate={() =>
                                        handleImpersonate(user.id)
                                    }
                                />
                            ))}
                        </div>

                        <UsersPagination
                            page={data.page}
                            totalPages={data.totalPages}
                            onPrevious={() =>
                                setPage((current) => current - 1)
                            }
                            onNext={() =>
                                setPage((current) => current + 1)
                            }
                        />
                    </>
                )}
            </div>
        </div>
    );
}

function UserCard({
    user,
    isActionLoading,
    onToggleActive,
    onUnlock,
    onImpersonate,
}: {
    user: AdminUserListItemDTO;
    isActionLoading: boolean;
    onToggleActive: () => void;
    onUnlock: () => void;
    onImpersonate: () => void;
}) {
    return (
        <div className="rounded-3xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
                <Link
                    href={`/admin/users/${user.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                >
                    <UserAvatar
                        fullName={user.fullName}
                        isLocked={user.isLocked}
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                            <p className="truncate text-[14px] font-semibold text-[#1C1C1E]">
                                {user.fullName || "بدون نام"}
                            </p>

                            {user.isLocked && (
                                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#FF3B30]/10 px-2 py-1 text-[10.5px] font-medium text-[#FF3B30]">
                                    <LockKeyhole
                                        className="h-3 w-3"
                                        strokeWidth={2.25}
                                    />
                                    قفل
                                </span>
                            )}
                        </div>

                        <p
                            dir="ltr"
                            className="mt-0.5 truncate text-right text-[12.5px] text-[#8E8E93]"
                        >
                            {user.phoneNumber}
                        </p>
                    </div>
                </Link>

                <UserActionMenu
                    user={user}
                    isLoading={isActionLoading}
                    onToggleActive={onToggleActive}
                    onUnlock={onUnlock}
                    onImpersonate={onImpersonate}
                />
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-[#F2F2F7] pt-3">
                <StatusPill
                    active={user.isActive}
                />

                <RolePill role={user.role} />

                <span className="mr-auto text-[11.5px] text-[#AEAEB2]">
                    {formatDate(user.createdAt)}
                </span>
            </div>
        </div>
    );
}

function UserAvatar({
    fullName,
    isLocked,
}: {
    fullName: string | null;
    isLocked: boolean;
}) {
    return (
        <div
            className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                isLocked
                    ? "bg-[#FF3B30]/10"
                    : "bg-[#0A7D5C]/10"
            )}
        >
            {isLocked ? (
                <LockKeyhole
                    className="h-5 w-5 text-[#FF3B30]"
                    strokeWidth={2}
                />
            ) : fullName ? (
                <span className="text-[15px] font-bold text-[#0A7D5C]">
                    {getInitials(fullName)}
                </span>
            ) : (
                <CircleUserRound
                    className="h-5 w-5 text-[#0A7D5C]"
                    strokeWidth={2}
                />
            )}
        </div>
    );
}

function StatusPill({ active }: { active: boolean }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium",
                active
                    ? "bg-[#0A7D5C]/10 text-[#0A7D5C]"
                    : "bg-black/[0.05] text-[#8E8E93]"
            )}
        >
            <span
                className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    active ? "bg-[#0A7D5C]" : "bg-[#AEAEB2]"
                )}
            />
            {active ? "فعال" : "غیرفعال"}
        </span>
    );
}

function RolePill({ role }: { role: string }) {
    const isAdmin = role === "ADMIN";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-medium",
                isAdmin
                    ? "bg-[#5856D6]/10 text-[#5856D6]"
                    : "bg-black/[0.05] text-[#636366]"
            )}
        >
            {isAdmin && (
                <ShieldCheck
                    className="h-3 w-3"
                    strokeWidth={2.1}
                />
            )}
            {roleLabel(role)}
        </span>
    );
}

function UsersPagination({
    page,
    totalPages,
    onPrevious,
    onNext,
}: {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-4 flex items-center justify-between rounded-3xl bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <button
                type="button"
                onClick={onPrevious}
                disabled={page <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.05] text-[#1C1C1E] transition-colors active:bg-black/[0.08] disabled:opacity-30"
                aria-label="صفحه قبل"
            >
                <ChevronRight
                    className="h-4 w-4"
                    strokeWidth={2.25}
                />
            </button>

            <span className="text-[12.5px] font-medium text-[#636366]">
                صفحه {page} از {totalPages}
            </span>

            <button
                type="button"
                onClick={onNext}
                disabled={page >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.05] text-[#1C1C1E] transition-colors active:bg-black/[0.08] disabled:opacity-30"
                aria-label="صفحه بعد"
            >
                <ChevronLeft
                    className="h-4 w-4"
                    strokeWidth={2.25}
                />
            </button>
        </div>
    );
}

function EmptyUsersState() {
    return (
        <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.05]">
                <CircleUserRound
                    className="h-5 w-5 text-[#C7C7CC]"
                    strokeWidth={2}
                />
            </div>

            <p className="mt-3 text-[13.5px] font-medium text-[#8E8E93]">
                کاربری پیدا نشد
            </p>

            <p className="mt-1 text-[12px] text-[#AEAEB2]">
                عبارت جستجو یا فیلترها را تغییر دهید
            </p>
        </div>
    );
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 1);
    }

    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`;
}

function roleLabel(role: string) {
    switch (role) {
        case "ADMIN":
            return "مدیر";
        case "USER":
            return "کاربر";
        default:
            return role;
    }
}

function formatDate(value: string | Date) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

