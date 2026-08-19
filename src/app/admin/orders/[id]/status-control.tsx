// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { adminUpdateOrderStatusAction } from "@/server/order/actions";
// import type { OrderStatus } from "@/types/order";

// const STATUS_LABELS: Record<OrderStatus, string> = {
//   PENDING: "در انتظار پرداخت",
//   CONFIRMED: "پرداخت شده",
//   COMPLETED: "تکمیل شده",
//   CANCELLED: "لغو شده",
// };

// export function AdminOrderStatusControl({
//   orderId,
//   currentStatus,
// }: {
//   orderId: string;
//   currentStatus: OrderStatus;
// }) {
//   const router = useRouter();
//   const [status, setStatus] = useState<OrderStatus>(currentStatus);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleChange(newStatus: OrderStatus) {
//     if (newStatus === "CANCELLED" && !confirm("این سفارش لغو شود؟")) return;

//     setError(null);
//     setIsSubmitting(true);
//     const result = await adminUpdateOrderStatusAction(orderId, newStatus);
//     setIsSubmitting(false);

//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     setStatus(newStatus);
//     router.refresh();
//   }

//   return (
//     <div style={{ margin: "16px 0" }}>
//       <label htmlFor="status">وضعیت سفارش: </label>
//       <select
//         id="status"
//         value={status}
//         disabled={isSubmitting}
//         onChange={(e) => handleChange(e.target.value as OrderStatus)}
//       >
//         {Object.entries(STATUS_LABELS).map(([value, label]) => (
//           <option key={value} value={value}>
//             {label}
//           </option>
//         ))}
//       </select>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateOrderStatusAction } from "@/server/order/actions";
import type { OrderStatus } from "@/types/order";

import { OrderStatusButton } from "@/components/admin/orders/order-status-button";
import { StatusPickerSheet } from "@/components/admin/orders/status-picker-sheet";
import { CancelOrderDialog } from "@/components/admin/orders/cancel-order-dialog";

export function AdminOrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function applyStatus(newStatus: OrderStatus): Promise<boolean> {
    setError(null);
    setIsSubmitting(true);
    const result = await adminUpdateOrderStatusAction(orderId, newStatus);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return false;
    }
    setStatus(newStatus);
    router.refresh();
    return true;
  }

  function handleSelect(newStatus: OrderStatus) {
    if (newStatus === status) {
      setPickerOpen(false);
      return;
    }

    if (newStatus === "CANCELLED") {
      setPickerOpen(false);
      setError(null);
      setCancelDialogOpen(true);
      return;
    }

    setPickerOpen(false);
    void applyStatus(newStatus);
  }

  async function handleConfirmCancel() {
    const succeeded = await applyStatus("CANCELLED");
    if (succeeded) setCancelDialogOpen(false);
  }

  return (
    <div>
      <OrderStatusButton
        status={status}
        disabled={isSubmitting}
        onClick={() => setPickerOpen(true)}
      />

      {error && !cancelDialogOpen && (
        <p className="mt-2 rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
          {error}
        </p>
      )}

      <StatusPickerSheet
        open={pickerOpen}
        currentStatus={status}
        onOpenChange={setPickerOpen}
        onSelect={handleSelect}
      />

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={(open) => {
          setCancelDialogOpen(open);
          if (!open) setError(null);
        }}
        onConfirm={handleConfirmCancel}
        isSubmitting={isSubmitting}
        error={cancelDialogOpen ? error : null}
      />
    </div>
  );
}

