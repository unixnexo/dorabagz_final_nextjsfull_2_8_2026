// /**
//  * ============================================================================
//  * PAGE: /admin/orders
//  * ============================================================================
//  * RENDERING: Client Component — same reasoning as other admin pages.
//  *
//  * DATA SOURCE: adminListOrdersAction({page?, pageSize?, search?, status?})
//  *   (see src/server/order/actions.ts)
//  *   output: PaginatedResult<OrderListItemDTO> (src/types/order.ts)
//  *
//  * Search matches order id, receiver name, or receiver phone.
//  *
//  * UI NOTE FOR DESIGN AGENT: table with status badge, courier type (so
//  * admin knows Snapp Box vs Tipax for fulfillment), search, status filter,
//  * pagination. Each row links to /admin/orders/[id] for detail + status change.
//  * ============================================================================
//  */
// import { AdminOrdersTable } from "./orders-table";

// export default function AdminOrdersPage() {
//   return (
//     <main dir="rtl" style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>مدیریت سفارش‌ها</h1>
//       <AdminOrdersTable />
//     </main>
//   );
// }






/**
 * PAGE: /admin/orders
 * See src/server/order/actions.ts for data source details.
 * Layout (header + nav sheet) is provided by app/admin/layout.tsx.
 */
import { AdminOrdersTable } from "./orders-table";

export default function AdminOrdersPage() {
  return <AdminOrdersTable />;
}
