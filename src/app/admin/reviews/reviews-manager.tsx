// "use client";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   listPendingReviewsAction,
//   approveReviewAction,
//   rejectReviewAction,
// } from "@/server/review/admin-actions";
// import { listSiteSatisfactionRatingsAction } from "@/server/review/site-satisfaction-actions";

// export function ReviewsManager() {
//   const queryClient = useQueryClient();

//   const { data: pending, isLoading: pendingLoading } = useQuery({
//     queryKey: ["pending-reviews"],
//     queryFn: async () => {
//       const result = await listPendingReviewsAction();
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   const { data: satisfaction, isLoading: satisfactionLoading } = useQuery({
//     queryKey: ["site-satisfaction-ratings"],
//     queryFn: async () => {
//       const result = await listSiteSatisfactionRatingsAction();
//       return result.success ? result.data : [];
//     },
//   });

//   async function handleApprove(reviewId: string) {
//     await approveReviewAction(reviewId);
//     queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
//   }

//   async function handleReject(reviewId: string) {
//     if (!confirm("این نظر حذف شود؟ این عمل قابل بازگشت نیست و به کاربر اطلاع داده نمی‌شود.")) return;
//     await rejectReviewAction(reviewId);
//     queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
//   }

//   return (
//     <div>
//       <section style={{ marginBottom: 32 }}>
//         <h2>نظرات در انتظار تایید</h2>
//         {pendingLoading && <p>در حال بارگذاری...</p>}
//         {pending && pending.length === 0 && <p>نظر جدیدی در انتظار تایید نیست.</p>}
//         {pending && pending.length > 0 && (
//           <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th>امتیاز</th>
//                 <th>متن</th>
//                 <th>محصولات سفارش</th>
//                 <th>شماره کاربر</th>
//                 <th>تاریخ</th>
//                 <th>عملیات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pending.map((r) => (
//                 <tr key={r.id}>
//                   <td>{"★".repeat(r.rating)}</td>
//                   <td>{r.text}</td>
//                   <td>{r.productTitles.join("، ")}</td>
//                   <td>{r.userPhoneNumber}</td>
//                   <td>{new Date(r.createdAt).toLocaleDateString("fa-IR")}</td>
//                   <td style={{ display: "flex", gap: 4 }}>
//                     <button onClick={() => handleApprove(r.id)}>تایید</button>
//                     <button onClick={() => handleReject(r.id)}>رد و حذف</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>

//       <section>
//         <h2>رضایت‌سنجی سایت (فقط قابل مشاهده برای مدیر)</h2>
//         {satisfactionLoading && <p>در حال بارگذاری...</p>}
//         {satisfaction && satisfaction.length === 0 && <p>هنوز رضایت‌سنجی ثبت نشده است.</p>}
//         {satisfaction && satisfaction.length > 0 && (
//           <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th>امتیاز</th>
//                 <th>متن</th>
//                 <th>شماره کاربر</th>
//                 <th>تاریخ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {satisfaction.map((r) => (
//                 <tr key={r.id}>
//                   <td>{"★".repeat(r.rating)}</td>
//                   <td>{r.text ?? "-"}</td>
//                   <td>{r.phoneNumber}</td>
//                   <td>{new Date(r.createdAt).toLocaleDateString("fa-IR")}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listPendingReviewsAction,
  approveReviewAction,
  rejectReviewAction,
} from "@/server/review/admin-actions";
import { listSiteSatisfactionRatingsAction } from "@/server/review/site-satisfaction-actions";
import type { PendingReviewDTO } from "@/types/review";
import { AdminSectionHeading } from "@/components/admin/orders/admin-section-heading";
import { PendingReviewsList } from "@/components/admin/reviews/pending-reviews-list";
import { InternalSectionHeading } from "@/components/admin/reviews/internal-section-heading";
import { SatisfactionRatingsList } from "@/components/admin/reviews/satisfaction-ratings-list";
import { RejectReviewDialog } from "@/components/admin/reviews/reject-review-dialog";


export function ReviewsManager() {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingReviewDTO | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

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
    setBusyId(reviewId);
    await approveReviewAction(reviewId);
    setBusyId(null);
    queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
  }

  async function handleConfirmReject() {
    if (!rejectTarget) return;
    setIsRejecting(true);
    await rejectReviewAction(rejectTarget.id);
    setIsRejecting(false);
    setRejectTarget(null);
    queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
  }

  return (
    <div className="pb-4">
      <section className="pt-4">
        <AdminSectionHeading
          title="نظرات در انتظار تایید"
          subtitle={pending ? `${pending.length.toLocaleString("fa-IR")} مورد` : undefined}
        />
        <PendingReviewsList
          reviews={pending}
          isLoading={pendingLoading}
          busyId={busyId}
          onApprove={handleApprove}
          onReject={setRejectTarget}
        />
      </section>

      <section className="mt-7">
        <InternalSectionHeading
          title="رضایت‌سنجی سایت"
          count={satisfaction?.length}
        />
        <p className="mb-2.5 px-1 text-[11px] text-[#8E8E93]">
          فقط قابل مشاهده برای مدیر — هرگز به‌صورت عمومی نمایش داده نمی‌شود
        </p>
        <SatisfactionRatingsList
          ratings={satisfaction}
          isLoading={satisfactionLoading}
        />
      </section>

      <RejectReviewDialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        onConfirm={handleConfirmReject}
        isSubmitting={isRejecting}
      />
    </div>
  );
}

