import { Package } from "lucide-react";

export function OrdersEmptyState() {
    return (
        <div className="rounded-[28px] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#f1f2f3]">
                <Package className="size-7 text-black/35" />
            </div>

            <h2 className="mt-4 text-[16px] font-semibold">سفارشی پیدا نشد</h2>

            <p className="mt-1 text-[13px] text-black/40">هنوز سفارشی با این مشخصات ندارید.</p>
        </div>
    );
}