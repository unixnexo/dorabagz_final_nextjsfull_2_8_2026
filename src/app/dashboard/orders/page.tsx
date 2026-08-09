/**
 * ============================================================================
 * PAGE: /dashboard/orders
 * ============================================================================
 * RENDERING: Client Component — same reasoning as other dashboard/admin
 * pages: needs search/filter/pagination interactivity, no SEO value.
 *
 * ACCESS: any logged-in user (their own orders only).
 *
 * DATA SOURCE: listMyOrdersAction({page?, pageSize?, search?, status?})
 *   (see src/server/order/actions.ts)
 *   output: PaginatedResult<OrderListItemDTO> (see src/types/order.ts)
 *     { id, status, totalAmount, itemCount, courierType, paymentStatus, createdAt }
 *
 * Each row links to /dashboard/orders/[id] for full detail + repay/cancel actions.
 *
 * UI NOTE FOR DESIGN AGENT: table/list with status badge (color-coded:
 * PENDING/CONFIRMED/COMPLETED/CANCELLED), search box (matches order id),
 * status filter dropdown, pagination.
 * ============================================================================
 */
import { OrdersList } from "./orders-list";

export default function MyOrdersPage() {
  return (
    <main dir="rtl" style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>سفارش‌های من</h1>
      <OrdersList />
    </main>
  );
}
