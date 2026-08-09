"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/server/notification/actions";
import type { NotificationDTO } from "@/types/notification";

export function NotificationsList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const result = await listNotificationsAction({ page, pageSize: 20 });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  async function handleMarkAllRead() {
    await markAllNotificationsReadAction();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  async function handleClick(notification: NotificationDTO) {
    if (!notification.isRead) {
      await markNotificationReadAction(notification.id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
    if (notification.linkUrl) {
      router.push(notification.linkUrl);
    }
  }

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (isError) return <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>;
  if (!data || data.items.length === 0) return <p>اعلانی وجود ندارد.</p>;

  return (
    <div>
      <button onClick={handleMarkAllRead} style={{ marginBottom: 16 }}>
        علامت‌گذاری همه به‌عنوان خوانده‌شده
      </button>

      <div>
        {data.items.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            style={{
              padding: 12,
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background: n.isRead ? "transparent" : "#f0f6ff",
              fontWeight: n.isRead ? "normal" : "bold",
            }}
          >
            <p style={{ margin: 0 }}>{n.title}</p>
            <p style={{ margin: "4px 0 0", fontWeight: "normal", fontSize: 14 }}>{n.body}</p>
            <p style={{ margin: "4px 0 0", fontWeight: "normal", fontSize: 12, color: "#888" }}>
              {new Date(n.createdAt).toLocaleString("fa-IR")}
            </p>
          </div>
        ))}
      </div>

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
    </div>
  );
}
