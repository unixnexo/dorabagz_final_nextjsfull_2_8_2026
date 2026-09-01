// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { repayOrderAction, cancelMyOrderAction } from "@/server/order/actions";
// import type { OrderStatus, PaymentStatus } from "@/types/order";

// export function OrderActions({
//   orderId,
//   status,
//   paymentStatus,
// }: {
//   orderId: string;
//   status: OrderStatus;
//   paymentStatus: PaymentStatus | null;
// }) {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Repay is offered whenever the order is still PENDING and payment isn't
//   // currently mid-flight successfully — i.e. it failed, or never completed.
//   const canRepay = status === "PENDING" && paymentStatus !== "SUCCESS";
//   // Cancel is only allowed before payment succeeds — per your spec, once
//   // CONFIRMED only admin can cancel.
//   const canCancel = status === "PENDING";

//   async function handleRepay() {
//     setError(null);
//     setIsSubmitting(true);
//     const result = await repayOrderAction(orderId);
//     setIsSubmitting(false);
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     window.location.href = result.data.paymentUrl;
//   }

//   async function handleCancel() {
//     if (!confirm("این سفارش لغو شود؟")) return;
//     setError(null);
//     setIsSubmitting(true);
//     const result = await cancelMyOrderAction(orderId);
//     setIsSubmitting(false);
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     router.refresh();
//   }

//   if (!canRepay && !canCancel) return null;

//   return (
//     <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
//       {canRepay && (
//         <button onClick={handleRepay} disabled={isSubmitting}>
//           {isSubmitting ? "در حال انتقال..." : "پرداخت مجدد"}
//         </button>
//       )}
//       {canCancel && (
//         <button onClick={handleCancel} disabled={isSubmitting}>
//           لغو سفارش
//         </button>
//       )}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { repayOrderAction, cancelMyOrderAction } from "@/server/order/actions";
import type { OrderStatus, PaymentStatus } from "@/types/order";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function OrderActions({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const canRepay = status === "PENDING" && paymentStatus !== "SUCCESS";
  const canCancel = status === "PENDING";

  async function handleRepay() {
    setIsSubmitting(true);
    const result = await repayOrderAction(orderId);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    window.location.href = result.data.paymentUrl;
  }

  async function handleCancel() {
    setIsSubmitting(true);
    const result = await cancelMyOrderAction(orderId);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setCancelDialogOpen(false);
    router.refresh();
  }

  if (!canRepay && !canCancel) return null;

  return (
    <div className="flex gap-2.5">
      {canRepay && (
        <button
          type="button"
          onClick={handleRepay}
          disabled={isSubmitting}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#171717] text-[13.5px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          <RotateCcw className="size-4" />
          {isSubmitting ? "در حال انتقال..." : "پرداخت مجدد"}
        </button>
      )}

      {canCancel && (
        <button
          type="button"
          onClick={() => setCancelDialogOpen(true)}
          disabled={isSubmitting}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[16px] bg-white text-[13.5px] font-semibold text-red-500 transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          <XCircle className="size-4" />
          لغو سفارش
        </button>
      )}

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>سفارش لغو شود؟</AlertDialogTitle>
            <AlertDialogDescription>
              این سفارش لغو خواهد شد و این عملیات قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              لغو سفارش
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

