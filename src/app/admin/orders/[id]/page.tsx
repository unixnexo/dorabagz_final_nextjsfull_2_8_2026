// /**
//  * ============================================================================
//  * PAGE: /admin/orders/[id]
//  * ============================================================================
//  * RENDERING: Server Component shell + a client island for the status
//  * dropdown (adminUpdateOrderStatusAction).
//  *
//  * DATA SOURCE: adminGetOrderAction(id) -> OrderDetailDTO (src/types/order.ts)
//  *
//  * Admin can move status: PENDING <-> CONFIRMED <-> COMPLETED, and cancel
//  * from any state (CONFIRMED -> CANCELLED is the admin-only cancellation
//  * path per your spec — once paid, only admin can cancel).
//  *
//  * NOTE: cancelling a CONFIRMED order does NOT auto-restore stock — that's
//  * a deliberate choice (a late cancellation usually means a real-world
//  * return/refund conversation, and auto-restoring could double-sell if the
//  * item is already physically out for delivery). Admin can manually adjust
//  * stock via the product edit page if appropriate.
//  *
//  * UI NOTE FOR DESIGN AGENT: same order summary as the user's order page,
//  * plus a status-change control (dropdown or buttons) and full address for
//  * fulfillment purposes.
//  * ============================================================================
//  */
// import { notFound, redirect } from "next/navigation";
// import { getSession } from "@/server/auth/session";
// import { adminGetOrderAction } from "@/server/order/actions";
// import { AdminOrderStatusControl } from "./status-control";

// const COURIER_LABELS: Record<string, string> = {
//   SNAPP_BOX: "اسنپ‌باکس (پس‌کرایه)",
//   TIPAX: "تیپاکس (پس‌کرایه)",
// };

// export default async function AdminOrderDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const session = await getSession();
//   if (!session || session.role !== "ADMIN") redirect("/logic");

//   const { id } = await params;
//   const result = await adminGetOrderAction(id);
//   if (!result.success) notFound();

//   const order = result.data;

//   return (
//     <main dir="rtl" style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>سفارش #{order.id.slice(0, 8)}</h1>

//       <AdminOrderStatusControl orderId={order.id} currentStatus={order.status} />

//       <p>وضعیت پرداخت: {order.paymentStatus ?? "-"}</p>
//       {order.paymentRefId && <p>کد پیگیری پرداخت: {order.paymentRefId}</p>}

//       <h2>اقلام سفارش</h2>
//       <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
//         <tbody>
//           {order.items.map((item) => (
//             <tr key={item.id}>
//               <td>{item.productTitle}</td>
//               <td>{item.optionSummary ?? "-"}</td>
//               <td>{item.quantity}</td>
//               <td>{(item.unitPrice * item.quantity).toLocaleString("fa-IR")} تومان</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <p>جمع جزء: {order.subtotal.toLocaleString("fa-IR")} تومان</p>
//       {order.discountAmount > 0 && (
//         <p>
//           تخفیف {order.couponCode ? `(${order.couponCode})` : ""}: {order.discountAmount.toLocaleString("fa-IR")}- تومان
//         </p>
//       )}
//       <h3>مبلغ کل: {order.totalAmount.toLocaleString("fa-IR")} تومان</h3>

//       <h2>آدرس ارسال</h2>
//       <p>
//         {order.receiverFullName} — {order.receiverPhone}
//       </p>
//       <p>
//         {order.province}، {order.city}
//       </p>
//       <p>{order.fullAddress}</p>
//       <p>کد پستی: {order.postalCode}</p>
//       <p>روش ارسال: {COURIER_LABELS[order.courierType]}</p>
//     </main>
//   );
// }








/**
 * PAGE: /admin/orders/[id]
 * See src/server/order/actions.ts for data source details.
 * Layout (header + nav sheet) is provided by app/admin/layout.tsx.
 */
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { adminGetOrderAction } from "@/server/order/actions";

import { OrderDetailHeader } from "@/components/admin/orders/order-detail-header";
import { AdminOrderStatusControl } from "./status-control";
import { OrderPaymentCard } from "@/components/admin/orders/order-payment-card";
import { OrderItemsCard } from "@/components/admin/orders/order-items-card";
import { AdminSectionHeading } from "@/components/admin/orders/admin-section-heading";
import { OrderAddressCard } from "@/components/admin/orders/order-address-card";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/logic");

  const { id } = await params;
  const result = await adminGetOrderAction(id);
  if (!result.success) notFound();

  const order = result.data;

  return (
    <div className="space-y-5 pb-6">
      <OrderDetailHeader order={order} />

      <AdminOrderStatusControl orderId={order.id} currentStatus={order.status} />

      <OrderPaymentCard order={order} />

      <section>
        <AdminSectionHeading title="اقلام سفارش" />
        <OrderItemsCard order={order} />
      </section>

      <section>
        <AdminSectionHeading title="آدرس ارسال" />
        <OrderAddressCard order={order} />
      </section>
    </div>
  );
}

