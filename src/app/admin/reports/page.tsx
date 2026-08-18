// /**
//  * ============================================================================
//  * PAGE: /admin/reports
//  * ============================================================================
//  * RENDERING: Client Component — same reasoning as other admin pages (range
//  * picker interactivity, no SEO value).
//  *
//  * DATA SOURCES: see src/server/reports/actions.ts
//  *
//  *   getIncomeSummaryAction() -> IncomeSummaryDTO (src/types/report.ts)
//  *     { todayIncome, todayOrderCount, monthIncome, monthOrderCount,
//  *       yearIncome, yearOrderCount }
//  *     Always-visible top-of-page summary, computed fresh each load.
//  *
//  *   getIncomeReportAction({preset, startDate?, endDate?}) -> IncomeReportDTO
//  *     preset: "TODAY"|"THIS_WEEK"|"THIS_MONTH"|"THIS_YEAR"|"CUSTOM"
//  *     For CUSTOM, startDate/endDate are required (ISO date strings, e.g. "2026-08-01").
//  *     Output: { rangeStart, rangeEnd, totalIncome, totalOrders, unitsSold,
//  *               breakdown: [{label, income, orderCount}] }
//  *     `breakdown` granularity auto-adjusts: day-by-day for ranges up to
//  *     ~62 days, month-by-month for longer ones (so a full-year view isn't
//  *     365 tiny bars).
//  *
//  *   getTopProductsAction() -> TopProductDTO[] (top 10, all-time, ranked by
//  *     units sold — { productId, productTitle, unitsSold, revenue })
//  *
//  *   getTopCustomersAction() -> TopCustomerDTO[] (top 10, all-time, ranked
//  *     by total spend — { userId, phoneNumber, fullName, totalSpent, orderCount })
//  *
//  * IMPORTANT: "income" everywhere in this module = sum of Order.totalAmount
//  * for orders with status CONFIRMED or COMPLETED only. PENDING (unpaid) and
//  * CANCELLED orders are excluded — per your confirmed spec.
//  *
//  * UI NOTE FOR DESIGN AGENT: three summary cards at top (today/month/year),
//  * a preset selector (today/week/month/year/custom) + date pickers when
//  * custom is selected, driving a chart or table of the breakdown series,
//  * and two top-10 tables (products, customers). This page is a great
//  * candidate for actual charts (bar/line) once redesigned — currently
//  * rendered as plain tables/numbers to keep this module backend-focused.
//  * ============================================================================
//  */
// import { ReportsDashboard } from "./reports-dashboard";

// export default function AdminReportsPage() {
//   return (
//     <main dir="rtl" style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>گزارش‌های سیستم</h1>
//       <ReportsDashboard />
//     </main>
//   );
// }








/**
 * PAGE: /admin/reports
 * See src/server/reports/actions.ts for data source details.
 * Layout (header + nav sheet) is provided by app/admin/layout.tsx.
 */
import { ReportsDashboard } from "./reports-dashboard";

export default function AdminReportsPage() {
  return <ReportsDashboard />;
}

