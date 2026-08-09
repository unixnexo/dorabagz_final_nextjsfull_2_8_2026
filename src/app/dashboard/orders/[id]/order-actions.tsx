"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { repayOrderAction, cancelMyOrderAction } from "@/server/order/actions";
import type { OrderStatus, PaymentStatus } from "@/types/order";

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
  const [error, setError] = useState<string | null>(null);

  // Repay is offered whenever the order is still PENDING and payment isn't
  // currently mid-flight successfully — i.e. it failed, or never completed.
  const canRepay = status === "PENDING" && paymentStatus !== "SUCCESS";
  // Cancel is only allowed before payment succeeds — per your spec, once
  // CONFIRMED only admin can cancel.
  const canCancel = status === "PENDING";

  async function handleRepay() {
    setError(null);
    setIsSubmitting(true);
    const result = await repayOrderAction(orderId);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    window.location.href = result.data.paymentUrl;
  }

  async function handleCancel() {
    if (!confirm("این سفارش لغو شود؟")) return;
    setError(null);
    setIsSubmitting(true);
    const result = await cancelMyOrderAction(orderId);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  if (!canRepay && !canCancel) return null;

  return (
    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
      {canRepay && (
        <button onClick={handleRepay} disabled={isSubmitting}>
          {isSubmitting ? "در حال انتقال..." : "پرداخت مجدد"}
        </button>
      )}
      {canCancel && (
        <button onClick={handleCancel} disabled={isSubmitting}>
          لغو سفارش
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
