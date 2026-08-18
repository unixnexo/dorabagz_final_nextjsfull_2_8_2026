import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user/get-current-user";
import { DashboardTabs } from "./dashboard-tabs";
import { OrdersList } from "./orders-list";


export default async function MyOrdersPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#f1f2f3] pb-28 text-[#171717]"
        >
            <div className="mx-auto min-h-screen w-full max-w-[500px]">
                <header className="px-4 pb-4 pt-6">
                    <div className="mb-5">
                        <h1 className="text-[28px] font-bold tracking-tight">
                            سفارش‌های من
                        </h1>

                        <p className="mt-1 text-[14px] text-black/45">
                            سفارش‌ها و وضعیت خریدهای شما
                        </p>
                    </div>

                    <DashboardTabs active="orders" />
                </header>

                <OrdersList />
            </div>
        </main>
    );
}