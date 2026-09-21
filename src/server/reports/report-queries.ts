import "server-only";
import { prisma } from "@/lib/prisma";
import { resolveReportRange, type ReportRangeInput } from "@/lib/report-date-range";
import type {
  IncomeSummaryDTO,
  IncomeReportDTO,
  IncomeBreakdownPointDTO,
  TopProductDTO,
  TopCustomerDTO,
} from "@/types/report";
import type { OrderStatus } from "@prisma/client";

// Orders that count as real, collected income — PENDING (unpaid) and
// CANCELLED are excluded everywhere in this module, per your confirmed spec.
// const PAID_STATUSES = ["CONFIRMED", "COMPLETED"] as const;
const PAID_STATUSES: OrderStatus[] = ["CONFIRMED", "COMPLETED"];

// ---------------------------------------------------------------------------
// Always-visible summary: today / this month / this year.
// ---------------------------------------------------------------------------
export async function getIncomeSummary(now: Date = new Date()): Promise<IncomeSummaryDTO> {
  const today = resolveReportRange({ preset: "TODAY" }, now);
  const month = resolveReportRange({ preset: "THIS_MONTH" }, now);
  const year = resolveReportRange({ preset: "THIS_YEAR" }, now);

  const [todayAgg, monthAgg, yearAgg] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: PAID_STATUSES }, createdAt: { gte: today.start, lt: today.end } },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { status: { in: PAID_STATUSES }, createdAt: { gte: month.start, lt: month.end } },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { status: { in: PAID_STATUSES }, createdAt: { gte: year.start, lt: year.end } },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  return {
    todayIncome: todayAgg._sum.totalAmount ?? 0,
    todayOrderCount: todayAgg._count,
    monthIncome: monthAgg._sum.totalAmount ?? 0,
    monthOrderCount: monthAgg._count,
    yearIncome: yearAgg._sum.totalAmount ?? 0,
    yearOrderCount: yearAgg._count,
  };
}

// ---------------------------------------------------------------------------
// Flexible range report: total income/orders/units + a breakdown series
// (day-by-day or month-by-month depending on range length).
// ---------------------------------------------------------------------------
export async function getIncomeReport(input: ReportRangeInput): Promise<IncomeReportDTO> {
  const { start, end, granularity } = resolveReportRange(input);

  const orders = await prisma.order.findMany({
    where: { status: { in: PAID_STATUSES }, createdAt: { gte: start, lt: end } },
    include: { items: true },
  });

  const totalIncome = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const unitsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((itemSum, i) => itemSum + i.quantity, 0),
    0
  );

  // Bucket orders by day or month label.
  const buckets = new Map<string, { income: number; orderCount: number }>();
  for (const order of orders) {
    // const label =
    //   granularity === "DAY"
    //     ? order.createdAt.toISOString().slice(0, 10) // "2026-08-09"
    //     : order.createdAt.toISOString().slice(0, 7); // "2026-08"

    const day = order.createdAt.toLocaleDateString("en-CA", { timeZone: "Asia/Tehran" }); // 2026-08-10
    const label = granularity === "DAY" ? day : day.slice(0, 7);

    const bucket = buckets.get(label) ?? { income: 0, orderCount: 0 };
    bucket.income += order.totalAmount;
    bucket.orderCount += 1;
    buckets.set(label, bucket);
  }

  const breakdown: IncomeBreakdownPointDTO[] = Array.from(buckets.entries())
    .map(([label, v]) => ({ label, income: v.income, orderCount: v.orderCount }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    rangeStart: start.toISOString(),
    rangeEnd: end.toISOString(),
    totalIncome,
    totalOrders: orders.length,
    unitsSold,
    breakdown,
  };
}

// ---------------------------------------------------------------------------
// Top 10 best-selling products, ranked by units sold overall (per your
// spec: "by which product is sold overall the most") — all-time, not
// scoped to a date range, since "overall" implies the full history.
// ---------------------------------------------------------------------------
export async function getTopProducts(limit = 10): Promise<TopProductDTO[]> {
  // Group snapshot OrderItem rows by product. OrderItem only snapshots
  // productTitle (not productId directly) — we join through variant to
  // recover productId where the variant still exists; for items whose
  // variant was deleted, we fall back to grouping by productTitle alone
  // so deleted products still show up correctly in historical reports.
  const items = await prisma.orderItem.findMany({
    where: { order: { status: { in: PAID_STATUSES } } },
    select: {
      quantity: true,
      unitPrice: true,
      productTitle: true,
      variant: { select: { productId: true } },
    },
  });

  const grouped = new Map<string, TopProductDTO>();
  for (const item of items) {
    const key = item.variant?.productId ?? `title:${item.productTitle}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.unitsSold += item.quantity;
      existing.revenue += item.unitPrice * item.quantity;
    } else {
      grouped.set(key, {
        productId: item.variant?.productId ?? null,
        productTitle: item.productTitle,
        unitsSold: item.quantity,
        revenue: item.unitPrice * item.quantity,
      });
    }
  }

  return Array.from(grouped.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Top 10 highest-spending customers, all-time.
// ---------------------------------------------------------------------------
export async function getTopCustomers(limit = 10): Promise<TopCustomerDTO[]> {
  const grouped = await prisma.order.groupBy({
    by: ["userId"],
    where: { status: { in: PAID_STATUSES } },
    _sum: { totalAmount: true },
    _count: true,
    orderBy: { _sum: { totalAmount: "desc" } },
    take: limit,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map((g) => g.userId) } },
  });
  const userById = new Map(users.map((u) => [u.id, u]));

  return grouped.map((g) => {
    const user = userById.get(g.userId);
    return {
      userId: g.userId,
      phoneNumber: user?.phoneNumber ?? "-",
      fullName: user?.fullName ?? null,
      totalSpent: g._sum.totalAmount ?? 0,
      orderCount: g._count,
    };
  });
}
