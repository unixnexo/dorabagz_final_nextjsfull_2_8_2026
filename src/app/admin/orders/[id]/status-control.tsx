"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateOrderStatusAction } from "@/server/order/actions";
import type { OrderStatus } from "@/types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "در انتظار پرداخت",
  CONFIRMED: "پرداخت شده",
  COMPLETED: "تکمیل شده",
  CANCELLED: "لغو شده",
};

export function AdminOrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(newStatus: OrderStatus) {
    if (newStatus === "CANCELLED" && !confirm("این سفارش لغو شود؟")) return;

    setError(null);
    setIsSubmitting(true);
    const result = await adminUpdateOrderStatusAction(orderId, newStatus);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    setStatus(newStatus);
    router.refresh();
  }

  return (
    <div style={{ margin: "16px 0" }}>
      <label htmlFor="status">وضعیت سفارش: </label>
      <select
        id="status"
        value={status}
        disabled={isSubmitting}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
