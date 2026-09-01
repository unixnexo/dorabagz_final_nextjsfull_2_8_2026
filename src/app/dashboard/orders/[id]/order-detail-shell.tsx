"use client";

import { motion } from "framer-motion";
import type { OrderDetailDTO } from "@/types/order";

import BackButton from "@/components/BackButton";
import { OrderStatusBadge } from "@/app/dashboard/orders/order-status-badge";
import { PaymentSuccessBanner, StockIssueBanner } from "./order-detail-banners";
import { OrderItemsCard } from "./order-items-card";
import { OrderAddressCard } from "./order-address-card";
import { OrderPaymentCard } from "./order-payment-card";
import { OrderActions } from "./order-actions";
import { OrderReviewForm } from "./order-review-form";

type OrderDetailShellProps = {
    order: OrderDetailDTO;
    success: boolean;
    stockIssue: boolean;
};

export function OrderDetailShell({ order, success, stockIssue }: OrderDetailShellProps) {
    return (
        <main dir="rtl" className="min-h-screen bg-[#f1f2f3] pb-10 text-[#171717]">
            <div className="mx-auto w-full max-w-[500px] px-4 pb-6 pt-[92px]">
                {/* Header */}
                <header className="fixed inset-x-0 top-0 z-40 mx-auto flex h-[88px] max-w-[500px] items-center justify-between bg-[#f1f2f3] px-4 pt-4">
                    <BackButton />

                    <div className="text-right">
                        <h1 className="text-[19px] font-bold tracking-tight">
                            سفارش #{order.id.slice(0, 8)}
                        </h1>
                        <p className="mt-0.5 text-[12.5px] text-black/45">
                            {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                    </div>
                </header>

                {stockIssue && <StockIssueBanner />}
                {success && !stockIssue && <PaymentSuccessBanner />}

                <FadeIn delay={0} className="mb-4 flex items-center justify-between rounded-[25px] bg-white p-4">
                    <span className="text-[13px] font-medium text-black/50">وضعیت سفارش</span>
                    <OrderStatusBadge status={order.status} />
                </FadeIn>

                <FadeIn delay={0.03} className="mb-4">
                    <OrderPaymentCard paymentStatus={order.paymentStatus} paymentRefId={order.paymentRefId} />
                </FadeIn>

                <FadeIn delay={0.06} className="mb-4">
                    <SectionHeading title="اقلام سفارش" />
                    <OrderItemsCard order={order} />
                </FadeIn>

                <FadeIn delay={0.09} className="mb-4">
                    <SectionHeading title="آدرس ارسال" />
                    <OrderAddressCard order={order} />
                </FadeIn>

                <FadeIn delay={0.12} className="mb-4">
                    <OrderActions orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />
                </FadeIn>

                {order.status === "COMPLETED" && !order.hasReview && (
                    <FadeIn delay={0.15}>
                        <OrderReviewForm orderId={order.id} />
                    </FadeIn>
                )}
            </div>
        </main>
    );
}

function SectionHeading({ title }: { title: string }) {
    return <h2 className="mb-2 px-1 text-[14px] font-semibold text-black/70">{title}</h2>;
}

function FadeIn({
    children,
    delay,
    className,
}: {
    children: React.ReactNode;
    delay: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}