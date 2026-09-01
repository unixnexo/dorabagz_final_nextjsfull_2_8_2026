import { MapPin, Truck } from "lucide-react";
import type { OrderDetailDTO } from "@/types/order";
import { COURIER_LABELS } from "./courier-labels";

export function OrderAddressCard({ order }: { order: OrderDetailDTO }) {
    return (
        <div className="space-y-3 rounded-[25px] bg-white p-4">
            <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f1f2f3]">
                    <MapPin className="size-4 text-black/60" />
                </div>

                <div className="min-w-0">
                    <p className="text-[14px] font-semibold">
                        {order.receiverFullName}{" "}
                        <span className="font-normal text-black/40">— {order.receiverPhone}</span>
                    </p>
                    <p className="mt-1 text-[13px] leading-6 text-black/55">
                        {order.province}، {order.city}
                        <br />
                        {order.fullAddress}
                    </p>
                    <p className="mt-1 text-[12px] text-black/40">کد پستی: {order.postalCode}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-[18px] bg-[#f1f2f3] px-3.5 py-3">
                <Truck className="size-4 shrink-0 text-black/50" />
                <p className="text-[12.5px] font-medium text-black/60">
                    {COURIER_LABELS[order.courierType]}
                </p>
            </div>
        </div>
    );
}