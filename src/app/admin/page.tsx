// /**
//  * ============================================================================
//  * PAGE: /admin (dashboard overview — system-state snapshot)
//  * ============================================================================
//  * RENDERING: Server Component — pure read, no interactivity needed beyond
//  * navigation (each card is a plain Link), so no client island required.
//  *
//  * DATA SOURCE: getAdminDashboardOverviewAction() (see src/server/dashboard/actions.ts)
//  *   output: AdminDashboardOverviewDTO (see src/types/dashboard.ts)
//  *     {
//  *       pendingOrders,      // Order rows with status = PENDING
//  *       totalUsers,         // every User row, any role
//  *       pendingReviews,     // ProductReview rows with status = PENDING (has text, awaiting approval)
//  *       totalCategories,    // non-deleted categories (parents + children combined)
//  *       totalProducts,      // non-deleted products
//  *       totalStories,       // non-deleted stories (active or expired)
//  *       activeCoupons,      // non-deleted coupons currently within their date window
//  *       discountedProducts, // distinct products covered by an active discount group right now
//  *     }
//  *
//  * DISTINCT FROM: /admin/reports (Module 6) — that page is income/sales
//  * analytics over a date range. This page is a system-state snapshot: a
//  * glance at "how much stuff is in the system / needs attention right now,"
//  * with each number linking straight to the page that manages it.
//  *
//  * UI NOTE FOR DESIGN AGENT: a grid of clickable cards, each showing one
//  * big number + a short label. All eight numbers are plain integers, no
//  * formatting needed beyond thousand-separators for large counts.
//  * ============================================================================
//  */
// import Link from "next/link";
// import { redirect } from "next/navigation";
// import { getSession } from "@/server/auth/session";
// import { getAdminDashboardOverviewAction } from "@/server/dashboard/actions";
// import type { AdminDashboardOverviewDTO } from "@/types/dashboard";

// const CARDS: { key: keyof AdminDashboardOverviewDTO; label: string; href: string }[] = [
//   { key: "pendingOrders", label: "سفارش‌های در انتظار پرداخت", href: "/admin/orders?status=PENDING" },
//   { key: "totalUsers", label: "تعداد کل کاربران", href: "/admin/users" },
//   { key: "pendingReviews", label: "نظرات در انتظار تایید", href: "/admin/reviews" },
//   { key: "totalCategories", label: "تعداد دسته‌بندی‌ها", href: "/admin/categories" },
//   { key: "totalProducts", label: "تعداد محصولات", href: "/admin/products" },
//   { key: "totalStories", label: "تعداد استوری‌ها", href: "/admin/stories" },
//   { key: "activeCoupons", label: "کدهای تخفیف فعال", href: "/admin/coupons" },
//   { key: "discountedProducts", label: "محصولات دارای تخفیف", href: "/admin/discounts" },
// ];

// export default async function AdminDashboardPage() {
//   const session = await getSession();
//   if (!session || session.role !== "ADMIN") redirect("/logic");

//   const result = await getAdminDashboardOverviewAction();

//   return (
//     <main dir="rtl" style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>داشبورد مدیریت</h1>

//       {!result.success && <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>}

//       {result.success && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//             gap: 16,
//             marginTop: 24,
//           }}
//         >
//           {CARDS.map((card) => (
//             <Link
//               key={card.key}
//               href={card.href}
//               style={{
//                 border: "1px solid #ddd",
//                 borderRadius: 8,
//                 padding: 20,
//                 display: "block",
//                 color: "inherit",
//                 textAlign: "center",
//               }}
//             >
//               <div style={{ fontSize: 32, fontWeight: "bold" }}>
//                 {result.data[card.key].toLocaleString("fa-IR")}
//               </div>
//               <div style={{ marginTop: 8, fontSize: 14, color: "#555" }}>{card.label}</div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }









/**
 * ============================================================================
 * PAGE: /admin
 * ============================================================================
 * Admin dashboard overview — system-state snapshot.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  ChevronLeft,
  CircleCheck,
  Clock3,
  FolderTree,
  MessageSquareText,
  Package,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  Users,
} from "lucide-react";

import { getSession } from "@/server/auth/session";
import { getAdminDashboardOverviewAction } from "@/server/dashboard/actions";
import type { AdminDashboardOverviewDTO } from "@/types/dashboard";

type CardKey = keyof AdminDashboardOverviewDTO;

type DashboardCard = {
  key: CardKey;
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
  tone: "green" | "orange" | "blue" | "purple" | "gray";
  attention?: boolean;
};

const CARDS: DashboardCard[] = [
  {
    key: "pendingOrders",
    label: "سفارش‌های در انتظار پرداخت",
    href: "/admin/orders?status=PENDING",
    icon: Clock3,
    description: "سفارش‌هایی که نیاز به بررسی دارند",
    tone: "orange",
    attention: true,
  },
  {
    key: "totalUsers",
    label: "کل کاربران",
    href: "/admin/users",
    icon: Users,
    description: "تمام کاربران ثبت‌شده در فروشگاه",
    tone: "blue",
  },
  {
    key: "pendingReviews",
    label: "نظرات در انتظار تایید",
    href: "/admin/reviews",
    icon: MessageSquareText,
    description: "نظراتی که هنوز منتشر نشده‌اند",
    tone: "orange",
    attention: true,
  },
  {
    key: "totalCategories",
    label: "دسته‌بندی‌ها",
    href: "/admin/categories",
    icon: FolderTree,
    description: "دسته‌بندی‌های فعال فروشگاه",
    tone: "purple",
  },
  {
    key: "totalProducts",
    label: "محصولات",
    href: "/admin/products",
    icon: Package,
    description: "محصولات موجود در سیستم",
    tone: "green",
  },
  {
    key: "totalStories",
    label: "استوری‌ها",
    href: "/admin/stories",
    icon: Sparkles,
    description: "تمام استوری‌های ثبت‌شده",
    tone: "purple",
  },
  {
    key: "activeCoupons",
    label: "کدهای تخفیف فعال",
    href: "/admin/coupons",
    icon: TicketPercent,
    description: "کدهای تخفیف قابل استفاده",
    tone: "green",
  },
  {
    key: "discountedProducts",
    label: "محصولات دارای تخفیف",
    href: "/admin/discounts",
    icon: ShoppingBag,
    description: "محصولاتی که در حال حاضر تخفیف دارند",
    tone: "green",
  },
];

const TONE_STYLES = {
  green: {
    icon: "bg-[#0A7D5C]/10 text-[#0A7D5C]",
    dot: "bg-[#0A7D5C]",
    badge: "bg-[#0A7D5C]/10 text-[#0A7D5C]",
  },
  orange: {
    icon: "bg-[#F59E0B]/10 text-[#D97706]",
    dot: "bg-[#F59E0B]",
    badge: "bg-[#F59E0B]/10 text-[#B45309]",
  },
  blue: {
    icon: "bg-[#2563EB]/10 text-[#2563EB]",
    dot: "bg-[#2563EB]",
    badge: "bg-[#2563EB]/10 text-[#2563EB]",
  },
  purple: {
    icon: "bg-[#7C3AED]/10 text-[#7C3AED]",
    dot: "bg-[#7C3AED]",
    badge: "bg-[#7C3AED]/10 text-[#7C3AED]",
  },
  gray: {
    icon: "bg-black/[0.05] text-[#6B7280]",
    dot: "bg-[#6B7280]",
    badge: "bg-black/[0.05] text-[#6B7280]",
  },
};

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/logic");
  }

  const result = await getAdminDashboardOverviewAction();

  return (
    <main dir="rtl" className="pb-8">
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-5 sm:px-6 sm:pt-7">
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

        <header className="mb-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[#0A7D5C] px-5 py-6 shadow-[0_12px_30px_-14px_rgba(10,125,92,0.5)] sm:px-7 sm:py-7">
            {/* Decorative shapes */}
            <div className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/[0.07]" />
            <div className="pointer-events-none absolute -bottom-20 right-10 h-44 w-44 rounded-full bg-white/[0.05]" />
            <div className="pointer-events-none absolute right-1/2 top-0 h-24 w-24 translate-x-1/2 rounded-full bg-white/[0.03]" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Boxes className="h-4 w-4 text-white" />
                </div>

                <span className="text-[11px] font-medium text-white/70">
                  پنل مدیریت
                </span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1 className="text-[24px] font-bold tracking-tight text-white sm:text-[28px]">
                    داشبورد مدیریت
                  </h1>

                  <p className="mt-1.5 text-[12px] leading-6 text-white/70 sm:text-[13px]">
                    وضعیت کلی فروشگاه را در یک نگاه ببینید.
                  </p>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 sm:flex">
                  <CircleCheck className="h-6 w-6 text-white/90" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* ERROR */}
        {/* ================================================================ */}

        {!result.success && (
          <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <span className="text-sm font-bold">!</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-red-700">
                  دریافت اطلاعات با مشکل مواجه شد
                </p>

                <p className="mt-0.5 text-[11px] text-red-600/70">
                  لطفاً دوباره صفحه را بارگذاری کنید.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* OVERVIEW */}
        {/* ================================================================ */}

        {result.success && (
          <>
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h2 className="text-[16px] font-bold text-[#1C1C1E]">
                  نمای کلی سیستم
                </h2>

                <p className="mt-0.5 text-[11px] text-[#8E8E93]">
                  اطلاعات فعلی فروشگاه
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-[#0A7D5C]/10 px-2.5 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0A7D5C]/50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0A7D5C]" />
                </span>

                <span className="text-[10px] font-medium text-[#0A7D5C]">
                  به‌روز
                </span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* CARDS */}
            {/* ============================================================ */}

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {CARDS.map((card) => {
                const Icon = card.icon;
                const value = result.data[card.key];
                const tone = TONE_STYLES[card.tone];

                return (
                  <Link
                    key={card.key}
                    href={card.href}
                    className="group relative min-w-0 overflow-hidden rounded-[24px] border border-black/[0.04] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-12px_rgba(0,0,0,0.18)] active:scale-[0.985] sm:p-5"
                  >
                    {/* Attention indicator */}
                    {card.attention && value > 0 && (
                      <div className="absolute left-3 top-3">
                        <span className="relative flex h-2 w-2">
                          <span
                            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${tone.dot} opacity-50`}
                          />
                          <span
                            className={`relative inline-flex h-2 w-2 rounded-full ${tone.dot}`}
                          />
                        </span>
                      </div>
                    )}

                    {/* Top */}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] ${tone.icon} transition-transform duration-200 group-hover:scale-105`}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                      </div>

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.025] text-[#AEAEB2] transition-all duration-200 group-hover:bg-black/[0.05] group-hover:text-[#636366]">
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    {/* Number */}
                    <div className="mt-5">
                      <p className="text-[26px] font-bold leading-none tracking-tight text-[#1C1C1E] tabular-nums sm:text-[30px]">
                        {value.toLocaleString("fa-IR")}
                      </p>

                      <div className="mt-2">
                        <p className="line-clamp-1 text-[12px] font-semibold text-[#3A3A3C]">
                          {card.label}
                        </p>

                        <p className="mt-1 line-clamp-1 text-[10px] leading-4 text-[#AEAEB2]">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="mt-4 flex items-center justify-between border-t border-black/[0.04] pt-3">
                      <span
                        className={`text-[10px] font-medium ${tone.badge} rounded-full px-2 py-1`}
                      >
                        مشاهده
                      </span>

                      <ArrowLeft className="h-3 w-3 text-[#C7C7CC] transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-[#8E8E93]" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ============================================================ */}
            {/* ATTENTION SUMMARY */}
            {/* ============================================================ */}

            {(result.data.pendingOrders > 0 ||
              result.data.pendingReviews > 0) && (
                <section className="mt-6">
                  <div className="mb-3 px-1">
                    <h2 className="text-[15px] font-bold text-[#1C1C1E]">
                      نیازمند توجه
                    </h2>

                    <p className="mt-0.5 text-[11px] text-[#8E8E93]">
                      مواردی که بهتر است بررسی شوند
                    </p>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {result.data.pendingOrders > 0 && (
                      <Link
                        href="/admin/orders?status=PENDING"
                        className="group flex items-center justify-between rounded-[22px] border border-[#F59E0B]/10 bg-[#FFF9ED] px-4 py-3.5 transition-all duration-200 hover:border-[#F59E0B]/20 hover:shadow-sm active:scale-[0.99]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#F59E0B]/10 text-[#D97706]">
                            <Clock3 className="h-[18px] w-[18px]" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-[#92400E]">
                              سفارش‌های در انتظار پرداخت
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#B45309]/70">
                              بررسی سفارش‌های جدید
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-[17px] font-bold tabular-nums text-[#92400E]">
                            {result.data.pendingOrders.toLocaleString("fa-IR")}
                          </span>

                          <ChevronLeft className="h-4 w-4 text-[#D97706]/50 transition-transform group-hover:-translate-x-0.5" />
                        </div>
                      </Link>
                    )}

                    {result.data.pendingReviews > 0 && (
                      <Link
                        href="/admin/reviews"
                        className="group flex items-center justify-between rounded-[22px] border border-[#F59E0B]/10 bg-[#FFF9ED] px-4 py-3.5 transition-all duration-200 hover:border-[#F59E0B]/20 hover:shadow-sm active:scale-[0.99]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#F59E0B]/10 text-[#D97706]">
                            <MessageSquareText className="h-[18px] w-[18px]" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-[#92400E]">
                              نظرات در انتظار تایید
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#B45309]/70">
                              بررسی و انتشار نظرات
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-[17px] font-bold tabular-nums text-[#92400E]">
                            {result.data.pendingReviews.toLocaleString("fa-IR")}
                          </span>

                          <ChevronLeft className="h-4 w-4 text-[#D97706]/50 transition-transform group-hover:-translate-x-0.5" />
                        </div>
                      </Link>
                    )}
                  </div>
                </section>
              )}

            {/* ============================================================ */}
            {/* QUICK STATS */}
            {/* ============================================================ */}

            <section className="mt-6">
              <div className="rounded-[24px] border border-black/[0.04] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.035)] sm:p-5">
                <div className="mb-4">
                  <h2 className="text-[15px] font-bold text-[#1C1C1E]">
                    خلاصه فروشگاه
                  </h2>

                  <p className="mt-0.5 text-[11px] text-[#8E8E93]">
                    چند عدد کلیدی از وضعیت فعلی
                  </p>
                </div>

                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-black/[0.05]">
                  <QuickStat
                    icon={Users}
                    value={result.data.totalUsers}
                    label="کاربر"
                  />

                  <QuickStat
                    icon={Package}
                    value={result.data.totalProducts}
                    label="محصول"
                  />

                  <QuickStat
                    icon={TicketPercent}
                    value={result.data.activeCoupons}
                    label="تخفیف فعال"
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function QuickStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-2 text-center">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#0A7D5C]/10 text-[#0A7D5C]">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <p className="text-[17px] font-bold leading-none tracking-tight text-[#1C1C1E] tabular-nums">
        {value.toLocaleString("fa-IR")}
      </p>

      <p className="mt-1 text-[10px] text-[#8E8E93]">{label}</p>
    </div>
  );
}

