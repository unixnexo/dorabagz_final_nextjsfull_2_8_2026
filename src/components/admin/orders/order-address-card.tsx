import { MapPin, Phone, Truck } from "lucide-react";
import type { OrderDetailDTO } from "@/types/order";
import { COURIER_LABELS_DETAILED } from "./order-status-config";

export function OrderAddressCard({ order }: { order: OrderDetailDTO }) {
    return (
        <div className="space-y-3 rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold text-[#1C1C1E]">
                    {order.receiverFullName}
                </p>
                <span dir="ltr" className="flex items-baseline gap-1 text-[12.5px] text-[#8E8E93]">
                    <Phone className="size-2.5" strokeWidth={2.25} />
                    {order.receiverPhone}
                </span>
            </div>

            <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8E8E93]" strokeWidth={2.25} />
                <div className="text-[13px] leading-relaxed text-[#1C1C1E]">
                    <p>
                        {order.province}، {order.city}
                    </p>
                    <p className="text-[#48484A]">{order.fullAddress}</p>
                    <p className="mt-0.5 text-[11.5px] text-[#8E8E93]">
                        کد پستی: {order.postalCode}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 border-t border-[#E5E5EA] pt-3">
                <Truck className="h-4 w-4 shrink-0 text-[#8E8E93]" strokeWidth={2.25} />
                <span className="text-[12.5px] font-medium text-[#1C1C1E]">
                    {COURIER_LABELS_DETAILED[order.courierType] ?? order.courierType}
                </span>
            </div>
        </div>
    );
}