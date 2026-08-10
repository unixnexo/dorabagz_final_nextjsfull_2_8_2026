"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listPendingReviewsAction,
  approveReviewAction,
  rejectReviewAction,
} from "@/server/review/admin-actions";
import { listSiteSatisfactionRatingsAction } from "@/server/review/site-satisfaction-actions";

export function ReviewsManager() {
  const queryClient = useQueryClient();

  const { data: pending, isLoading: pendingLoading } = useQuery({
    queryKey: ["pending-reviews"],
    queryFn: async () => {
      const result = await listPendingReviewsAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const { data: satisfaction, isLoading: satisfactionLoading } = useQuery({
    queryKey: ["site-satisfaction-ratings"],
    queryFn: async () => {
      const result = await listSiteSatisfactionRatingsAction();
      return result.success ? result.data : [];
    },
  });

  async function handleApprove(reviewId: string) {
    await approveReviewAction(reviewId);
    queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
  }

  async function handleReject(reviewId: string) {
    if (!confirm("این نظر حذف شود؟ این عمل قابل بازگشت نیست و به کاربر اطلاع داده نمی‌شود.")) return;
    await rejectReviewAction(reviewId);
    queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
  }

  return (
    <div>
      <section style={{ marginBottom: 32 }}>
        <h2>نظرات در انتظار تایید</h2>
        {pendingLoading && <p>در حال بارگذاری...</p>}
        {pending && pending.length === 0 && <p>نظر جدیدی در انتظار تایید نیست.</p>}
        {pending && pending.length > 0 && (
          <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>امتیاز</th>
                <th>متن</th>
                <th>محصولات سفارش</th>
                <th>شماره کاربر</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((r) => (
                <tr key={r.id}>
                  <td>{"★".repeat(r.rating)}</td>
                  <td>{r.text}</td>
                  <td>{r.productTitles.join("، ")}</td>
                  <td>{r.userPhoneNumber}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString("fa-IR")}</td>
                  <td style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => handleApprove(r.id)}>تایید</button>
                    <button onClick={() => handleReject(r.id)}>رد و حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>رضایت‌سنجی سایت (فقط قابل مشاهده برای مدیر)</h2>
        {satisfactionLoading && <p>در حال بارگذاری...</p>}
        {satisfaction && satisfaction.length === 0 && <p>هنوز رضایت‌سنجی ثبت نشده است.</p>}
        {satisfaction && satisfaction.length > 0 && (
          <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>امتیاز</th>
                <th>متن</th>
                <th>شماره کاربر</th>
                <th>تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {satisfaction.map((r) => (
                <tr key={r.id}>
                  <td>{"★".repeat(r.rating)}</td>
                  <td>{r.text ?? "-"}</td>
                  <td>{r.phoneNumber}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
