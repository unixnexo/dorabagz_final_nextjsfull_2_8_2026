// /**
//  * ============================================================================
//  * PAGE: /dashboard/orders/[id]
//  * ============================================================================
//  * RENDERING: Server Component shell (fetch + auth check), repay/cancel
//  * buttons are a small client island since they need interactivity.
//  *
//  * ACCESS: the order's owner only (getMyOrderAction scopes to the current user).
//  *
//  * DATA SOURCE: getMyOrderAction(orderId) -> OrderDetailDTO (src/types/order.ts)
//  *   {
//  *     id, status, receiverFullName, receiverPhone, province, city,
//  *     fullAddress, postalCode, courierType,
//  *     items: OrderItemDTO[],  // { id, variantId, productTitle, optionSummary, unitPrice, quantity, productSlug, productImage }
//  *     subtotal, discountAmount, totalAmount, couponCode,
//  *     paymentStatus, paymentRefId, createdAt, updatedAt
//  *   }
//  *
//  * ACTIONS available from this page (client island, order-actions.tsx):
//  *   repayOrderAction(orderId) -> { paymentUrl } — shown when status=PENDING
//  *     and paymentStatus is FAILED or null (payment never completed)
//  *   cancelMyOrderAction(orderId) -> only allowed while status=PENDING —
//  *     once CONFIRMED, only admin can cancel (per your spec)
//  *
//  * QUERY PARAMS (set by the payment callback redirect):
//  *   ?success=1     -> payment just succeeded
//  *   ?stockIssue=1  -> payment succeeded but stock ran out in the race
//  *                     window; order was auto-cancelled, refund owed —
//  *                     show this clearly, it's a rare but real case
//  *
//  * UI NOTE FOR DESIGN AGENT: order summary (items, subtotal, discount,
//  * total, coupon code if used), shipping address + courier method, status
//  * badge, payment status, repay button (only when applicable), cancel
//  * button (only when PENDING), and a special banner for stockIssue=1.
//  * ============================================================================
//  */
// import { notFound, redirect } from "next/navigation";
// import Link from "next/link";
// import { getCurrentUser } from "@/server/user/get-current-user";
// import { getMyOrderAction } from "@/server/order/actions";
// import { OrderActions } from "./order-actions";
// import { SiteSatisfactionPopup } from "@/components/site-satisfaction-popup";
// import { OrderReviewForm } from "./order-review-form";

// const STATUS_LABELS: Record<string, string> = {
//   PENDING: "در انتظار پرداخت",
//   CONFIRMED: "پرداخت شده",
//   COMPLETED: "تکمیل شده",
//   CANCELLED: "لغو شده",
// };

// const COURIER_LABELS: Record<string, string> = {
//   SNAPP_BOX: "اسنپ‌باکس (پس‌کرایه)",
//   TIPAX: "تیپاکس (پس‌کرایه)",
// };

// export default async function OrderDetailPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ id: string }>;
//   searchParams: Promise<{ success?: string; stockIssue?: string }>;
// }) {
//   const user = await getCurrentUser();
//   if (!user) redirect("/login");

//   const { id } = await params;
//   const { success, stockIssue } = await searchParams;

//   const result = await getMyOrderAction(id);
//   if (!result.success) notFound();

//   const order = result.data;

//   return (
//     <main dir="rtl" style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>سفارش #{order.id.slice(0, 8)}</h1>

//       {/* Per your spec, this is the ONE trigger point for the site-
//           satisfaction popup: right after a successful payment redirect. */}
//       {success === "1" && <SiteSatisfactionPopup />}

//       {success === "1" && (
//         <p style={{ background: "#d4edda", padding: 12 }}>پرداخت با موفقیت انجام شد.</p>
//       )}
//       {stockIssue === "1" && (
//         <p style={{ background: "#f8d7da", padding: 12 }}>
//           پرداخت شما با موفقیت انجام شد، اما متاسفانه موجودی یکی از کالاها در همین فاصله تمام شد. این
//           سفارش لغو شده و مبلغ پرداختی توسط پشتیبانی به شما بازگردانده خواهد شد.
//         </p>
//       )}

//       <p>وضعیت سفارش: {STATUS_LABELS[order.status]}</p>
//       <p>وضعیت پرداخت: {order.paymentStatus ?? "-"}</p>
//       {order.paymentRefId && <p>کد پیگیری پرداخت: {order.paymentRefId}</p>}

//       <h2>اقلام سفارش</h2>
//       <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
//         <tbody>
//           {order.items.map((item) => (
//             <tr key={item.id}>
//               <td>
//                 {item.productImage && (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={item.productImage}
//                     alt=""
//                     style={{ width: 40, height: 40, objectFit: "cover", verticalAlign: "middle", marginLeft: 8 }}
//                   />
//                 )}
//                 {item.productSlug ? (
//                   <Link href={`/products/${item.productSlug}`}>{item.productTitle}</Link>
//                 ) : (
//                   item.productTitle
//                 )}
//               </td>
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
//       <h3>مبلغ پرداخت شده: {order.totalAmount.toLocaleString("fa-IR")} تومان</h3>

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

//       <OrderActions orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />

//       {order.status === "COMPLETED" && !order.hasReview && <OrderReviewForm orderId={order.id} />}
//     </main>
//   );
// }









import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user/get-current-user";
import { getMyOrderAction } from "@/server/order/actions";
import { OrderDetailShell } from "./order-detail-shell";
import { SiteSatisfactionPopup } from "@/components/site-satisfaction-popup";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; stockIssue?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const { success, stockIssue } = await searchParams;

  const result = await getMyOrderAction(id);
  if (!result.success) notFound();

  const order = result.data;

  return (
    <>
      {/* Per spec, this is the ONE trigger point for the site-satisfaction
                popup: right after a successful payment redirect. */}
      {success === "1" && <SiteSatisfactionPopup /> }

      <OrderDetailShell order={order} success={success === "1"} stockIssue={stockIssue === "1"} />
    </>
  );
}
