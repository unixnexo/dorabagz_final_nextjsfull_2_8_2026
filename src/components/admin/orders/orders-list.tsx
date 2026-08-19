import type { OrderListItemDTO } from "@/types/order";
import { OrderListCard } from "./order-list-card";

export function OrdersList({
    orders,
    isLoading,
    isError,
}: {
    orders: OrderListItemDTO[] | undefined;
    isLoading: boolean;
    isError: boolean;
}) {
    if (isError) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] font-medium text-[#FF3B30]">
                    خطا در دریافت اطلاعات
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-2.5">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-[92px] animate-pulse rounded-3xl bg-white/70" />
                ))}
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] text-[#8E8E93]">سفارشی پیدا نشد</p>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {orders.map((order) => (
                <OrderListCard key={order.id} order={order} />
            ))}
        </div>
    );
}