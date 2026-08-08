"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listUsersAction,
  setUserActiveAction,
  unlockUserAction,
} from "@/server/user/admin-actions";
import { startImpersonationAction } from "@/server/user/impersonation-actions";

export function AdminUsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: async () => {
      const result = await listUsersAction({ page, pageSize: 20, search: search || undefined });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  async function handleToggleActive(userId: string, current: boolean) {
    await setUserActiveAction(userId, !current);
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  }

  async function handleUnlock(userId: string) {
    await unlockUserAction(userId);
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  }

  async function handleImpersonate(userId: string) {
    const result = await startImpersonationAction(userId);
    if (result.success) {
      window.location.href = result.data.redirectTo;
    } else {
      alert(result.error);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="جستجو بر اساس شماره یا نام..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ width: "100%", padding: 8, marginBottom: 16 }}
      />

      {isLoading && <p>در حال بارگذاری...</p>}
      {isError && <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>}

      {data && (
        <>
          <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>شماره موبایل</th>
                <th>نام</th>
                <th>نقش</th>
                <th>وضعیت</th>
                <th>قفل</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link href={`/admin/users/${u.id}`}>{u.phoneNumber}</Link>
                  </td>
                  <td>{u.fullName ?? "-"}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? "فعال" : "غیرفعال"}</td>
                  <td>{u.isLocked ? "قفل" : "-"}</td>
                  <td style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => handleToggleActive(u.id, u.isActive)}>
                      {u.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    </button>
                    {u.isLocked && <button onClick={() => handleUnlock(u.id)}>باز کردن قفل</button>}
                    {u.role === "USER" && (
                      <button onClick={() => handleImpersonate(u.id)}>ورود به حساب</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              قبلی
            </button>
            <span>
              صفحه {data.page} از {data.totalPages}
            </span>
            <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
              بعدی
            </button>
          </div>
        </>
      )}
    </div>
  );
}
