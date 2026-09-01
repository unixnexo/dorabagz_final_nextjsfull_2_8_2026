// /**
//  * ============================================================================
//  * PAGE: /dashboard/orders
//  * ============================================================================
//  * RENDERING: Client Component — same reasoning as other dashboard/admin
//  * pages: needs search/filter/pagination interactivity, no SEO value.
//  *
//  * ACCESS: any logged-in user (their own orders only).
//  *
//  * DATA SOURCE: listMyOrdersAction({page?, pageSize?, search?, status?})
//  *   (see src/server/order/actions.ts)
//  *   output: PaginatedResult<OrderListItemDTO> (see src/types/order.ts)
//  *     { id, status, totalAmount, itemCount, courierType, paymentStatus, createdAt }
//  *
//  * Each row links to /dashboard/orders/[id] for full detail + repay/cancel actions.
//  *
//  * UI NOTE FOR DESIGN AGENT: table/list with status badge (color-coded:
//  * PENDING/CONFIRMED/COMPLETED/CANCELLED), search box (matches order id),
//  * status filter dropdown, pagination.
//  * ============================================================================
//  */
// import { Metadata } from "next";
// import { OrdersList } from "./orders-list";

// export const metadata: Metadata = {
//     title: "سفارش‌های من",
//     description: "مشاهده و پیگیری سفارش‌های شما در فروشگاه اینترنتی درا بگز.",
//     robots: {
//         index: false,
//         follow: false,
//     },
// };

// export default function MyOrdersPage() {
//   return (
//     <div>
//       {/* <h1>سفارش‌های من</h1> */}
//       <OrdersList />
//     </div>
//   );
// }











import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user/get-current-user";
import { OrdersList } from "./orders-list";
import { DashboardTabs } from "../profile/dashboard-tabs";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { SearchCommand } from "@/components/search-command";
import { BottomNav } from "@/components/bottom-nav";

export default async function MyOrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f1f2f3] pb-28 text-[#171717]">
      <div className="mx-auto min-h-screen w-full max-w-[500px]">
        <header className="px-4 pb-4 pt-6">
          {/* Header */}
          <header className="mb-6 px-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-11 rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl hover:bg-[#eeeeee]"
            >
              <Link href="/notifications">
                <Bell className="!size-5 text-black/70" />
              </Link>
            </Button>

            <BackButton />
          </header>

          <DashboardTabs active="orders" />
        </header>

        <OrdersList />
      </div>
    </main>
  );
}
