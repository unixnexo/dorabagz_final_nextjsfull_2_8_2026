/**
 * Report DTOs — all "income"/revenue figures are computed from
 * Order.totalAmount for orders with status CONFIRMED or COMPLETED only
 * (i.e. actually paid) — PENDING and CANCELLED orders are excluded
 * everywhere in this module, per your confirmed spec.
 */

/** Always-visible summary — today / this month / this year, computed in
 *  the server's local sense of "today" (see report-queries.ts for the
 *  exact boundary logic). */
export type IncomeSummaryDTO = {
  todayIncome: number; // Toman
  todayOrderCount: number;
  monthIncome: number;
  monthOrderCount: number;
  yearIncome: number;
  yearOrderCount: number;
};

export type ReportRangePreset = "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "THIS_YEAR" | "CUSTOM";

/** One point in the income-over-time breakdown, granularity chosen based
 *  on the range length (day-by-day for short ranges, month-by-month for
 *  long ones — see report-queries.ts). */
export type IncomeBreakdownPointDTO = {
  label: string; // e.g. "2026-08-09" or "2026-08" depending on granularity
  income: number;
  orderCount: number;
};

export type IncomeReportDTO = {
  rangeStart: string; // ISO date
  rangeEnd: string; // ISO date
  totalIncome: number;
  totalOrders: number;
  unitsSold: number; // sum of OrderItem.quantity across included orders
  breakdown: IncomeBreakdownPointDTO[];
};

export type TopProductDTO = {
  productId: string | null; // null if the product was later deleted
  productTitle: string; // snapshot title, works even if product was deleted
  unitsSold: number;
  revenue: number; // Toman
};

export type TopCustomerDTO = {
  userId: string;
  phoneNumber: string;
  fullName: string | null;
  totalSpent: number; // Toman
  orderCount: number;
};
