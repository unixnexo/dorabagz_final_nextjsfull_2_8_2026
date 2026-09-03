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
import { Bell, CircleHelp } from "lucide-react";
import { SearchCommand } from "@/components/search-command";
import { BottomNav } from "@/components/bottom-nav";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export default async function MyOrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f1f2f3] pb-28 text-[#171717]">
      <div className="mx-auto min-h-screen w-full max-w-[500px]">
        <header className="px-4 pb-4 pt-4">
          {/* Header */}
          <header className="mb-6 px-1 space-x-2 space-x-reverse">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-14 rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl hover:bg-[#eeeeee]"
            >
              <Link href="/notifications">
                <Bell className="!size-6 text-black/70" />
              </Link>
            </Button>

            {/* Help */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-14 rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl hover:bg-[#eeeeee]"
                >
                  <CircleHelp className="!size-6 text-black/70" />
                </Button>
              </DrawerTrigger>

              <DrawerContent
                className="mx-auto max-w-[500px] rounded-t-[32px] border-0 bg-muted px-4"
              >
                <DrawerHeader className="px-1 pb-5 pt-3">
                  <DrawerTitle className="text-right text-[20px] font-bold mt-6">
                    راهنما و پشتیبانی
                  </DrawerTitle>
                </DrawerHeader>

                <div className="space-y-2 pb-4">
                  <Link
                    href="/faq"
                    className="flex h-[64px] items-center justify-between rounded-[20px] bg-white px-4 transition-transform active:scale-[0.98]"
                  >
                    <div>
                      <p className="text-[15px] font-semibold">
                        سوالات متداول
                      </p>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        پاسخ سوالات رایج
                      </p>
                    </div>

                    <CircleHelp className="size-5 text-black/40" />
                  </Link>

                  <Link
                    href="/contact"
                    className="flex h-[64px] items-center justify-between rounded-[20px] bg-white px-4 transition-transform active:scale-[0.98]"
                  >
                    <div>
                      <p className="text-[15px] font-semibold">
                        تماس با ما
                      </p>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        ارتباط با پشتیبانی
                      </p>
                    </div>

                    <CircleHelp className="size-5 text-black/40" />
                  </Link>
                </div>
              </DrawerContent>
            </Drawer>

            <BackButton />
          </header>

          <DashboardTabs active="orders" />
        </header>

        <OrdersList />
      </div>
    </main>
  );
}
