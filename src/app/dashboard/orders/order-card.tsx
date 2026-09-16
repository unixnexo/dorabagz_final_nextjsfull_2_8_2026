"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronLeft } from "lucide-react";
import type { OrderListItemDTO } from "@/types/order";
import { OrderStatusBadge } from "./order-status-badge";

export function OrderCard({ order }: { order: OrderListItemDTO }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
        >
            <Link
                href={`/dashboard/orders/${order.id}`}
                className="group block rounded-[25px] bg-brand-secondary p-4 transition-transform active:scale-[0.985]"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-[16px] bg-[#f1f2f3]">
                            <Package className="size-[20px] text-black/60" />
                        </div>

                        <div>
                            <p className="text-[14px] font-semibold">سفارش #{order.id.slice(0, 8)}</p>

                            <p className="mt-1 text-[12px] text-black/40">
                                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                            </p>
                        </div>
                    </div>

                    <OrderStatusBadge status={order.status} />
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-black/[0.05] pt-3">
                    <div>
                        <p className="text-[11px] text-black/35">مبلغ سفارش</p>

                        <p className="mt-1 text-[15px] font-bold">
                            {order.totalAmount.toLocaleString("fa-IR")}
                            <span className="mr-1 text-[11px] font-normal text-black/40">تومن</span>
                        </p>
                    </div>

                    <div className="text-left">
                        <p className="text-[11px] text-black/35">{order.itemCount} کالا</p>

                        <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-black/45">
                            مشاهده سفارش
                            <ChevronLeft className="size-4 transition-transform group-active:-translate-x-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}