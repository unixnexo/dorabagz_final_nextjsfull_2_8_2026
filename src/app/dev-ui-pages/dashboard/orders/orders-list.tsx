"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Package,
    Clock3,
    CheckCircle2,
    XCircle,
    Truck,
} from "lucide-react";

import { listMyOrdersAction } from "@/server/order/actions";
import type { OrderStatus } from "@/types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "در انتظار پرداخت",
    CONFIRMED: "پرداخت شده",
    COMPLETED: "تکمیل شده",
    CANCELLED: "لغو شده",
};

const STATUS_CONFIG: Record<
    OrderStatus,
    {
        icon: typeof Clock3;
        className: string;
    }
> = {
    PENDING: {
        icon: Clock3,
        className: "bg-orange-50 text-orange-600",
    },
    CONFIRMED: {
        icon: Truck,
        className: "bg-blue-50 text-blue-600",
    },
    COMPLETED: {
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-600",
    },
    CANCELLED: {
        icon: XCircle,
        className: "bg-red-50 text-red-500",
    },
};

export function OrdersList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<OrderStatus | "">("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-orders", page, search, status],

        queryFn: async () => {
            const result = await listMyOrdersAction({
                page,
                pageSize: 20,
                search: search || undefined,
                status: status || undefined,
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        },
    });

    function changeStatus(value: OrderStatus | "") {
        setStatus(value);
        setPage(1);
    }

    return (
        <div className="px-4">
            {/* Search */}
            <div className="relative mb-3">
                <Search className="absolute right-4 top-1/2 size-[18px] -translate-y-1/2 text-black/35" />

                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="جستجوی شماره سفارش"
                    className="h-[52px] w-full rounded-[19px] border-0 bg-white pr-11 pl-4 text-[14px] outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/10"
                />
            </div>

            {/* Status filters */}
            <div
                className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 scrollbar-none"
                dir="rtl"
            >
                <StatusFilter
                    active={status === ""}
                    onClick={() => changeStatus("")}
                >
                    همه
                </StatusFilter>

                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(
                    (item) => (
                        <StatusFilter
                            key={item}
                            active={status === item}
                            onClick={() => changeStatus(item)}
                        >
                            {STATUS_LABELS[item]}
                        </StatusFilter>
                    )
                )}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-[142px] animate-pulse rounded-[25px] bg-white"
                        />
                    ))}
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="rounded-[25px] bg-white px-5 py-8 text-center">
                    <p className="text-[14px] text-red-500">
                        خطا در دریافت سفارش‌ها
                    </p>
                </div>
            )}

            {/* Results */}
            {data && (
                <>
                    {data.items.length === 0 ? (
                        <EmptyOrders />
                    ) : (
                        <motion.div
                            layout
                            className="space-y-3"
                        >
                            <AnimatePresence mode="popLayout">
                                {data.items.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                        <div className="mt-5 flex items-center justify-between rounded-[22px] bg-white px-3 py-2">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() =>
                                    setPage((current) => current - 1)
                                }
                                className="flex size-10 items-center justify-center rounded-full transition-colors active:scale-95 disabled:opacity-25"
                            >
                                <ChevronRight className="size-5" />
                            </button>

                            <span className="text-[13px] font-medium text-black/55">
                                صفحه {data.page} از {data.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={page >= data.totalPages}
                                onClick={() =>
                                    setPage((current) => current + 1)
                                }
                                className="flex size-10 items-center justify-center rounded-full transition-colors active:scale-95 disabled:opacity-25"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function StatusFilter({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all active:scale-95 ${active
                    ? "bg-[#171717] text-white"
                    : "bg-white text-black/50"
                }`}
        >
            {children}
        </button>
    );
}

function OrderCard({
    order,
}: {
    order: {
        id: string;
        status: OrderStatus;
        totalAmount: number;
        itemCount: number;
        createdAt: string | Date;
    };
}) {
    const config = STATUS_CONFIG[order.status];
    const StatusIcon = config.icon;

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
                className="group block rounded-[25px] bg-white p-4 transition-transform active:scale-[0.985]"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-[16px] bg-[#f1f2f3]">
                            <Package className="size-[20px] text-black/60" />
                        </div>

                        <div>
                            <p className="text-[14px] font-semibold">
                                سفارش #{order.id.slice(0, 8)}
                            </p>

                            <p className="mt-1 text-[12px] text-black/40">
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString("fa-IR")}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium ${config.className}`}
                    >
                        <StatusIcon className="size-3.5" />
                        {STATUS_LABELS[order.status]}
                    </div>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-black/[0.05] pt-3">
                    <div>
                        <p className="text-[11px] text-black/35">
                            مبلغ سفارش
                        </p>

                        <p className="mt-1 text-[15px] font-bold">
                            {order.totalAmount.toLocaleString("fa-IR")}
                            <span className="mr-1 text-[11px] font-normal text-black/40">
                                تومن
                            </span>
                        </p>
                    </div>

                    <div className="text-left">
                        <p className="text-[11px] text-black/35">
                            {order.itemCount} کالا
                        </p>

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

function EmptyOrders() {
    return (
        <div className="rounded-[28px] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#f1f2f3]">
                <Package className="size-7 text-black/35" />
            </div>

            <h2 className="mt-4 text-[16px] font-semibold">
                سفارشی پیدا نشد
            </h2>

            <p className="mt-1 text-[13px] text-black/40">
                هنوز سفارشی با این مشخصات ندارید.
            </p>
        </div>
    );
}