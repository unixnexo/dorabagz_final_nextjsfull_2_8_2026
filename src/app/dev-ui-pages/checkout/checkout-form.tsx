"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, MapPin, Tag, Truck } from "lucide-react";

import { getCartAction } from "@/server/cart/actions";
import {
    getMyAddressAction,
    saveMyAddressAction,
} from "@/server/address/actions";
import { previewCouponAction } from "@/server/coupon/apply-actions";
import { createOrderAction } from "@/server/order/checkout-action";
import {
    resolveCourierType,
    courierTypeLabel,
} from "@/lib/courier";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { CouponPreviewDTO } from "@/types/coupon";
import BackButton from "@/components/BackButton";
import Image from "next/image";

export function CheckoutForm() {
    const { data: cart, isLoading: cartLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const result = await getCartAction();

            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        },
    });

    const { data: savedAddress } = useQuery({
        queryKey: ["my-address"],
        queryFn: async () => {
            const result = await getMyAddressAction();
            return result.success ? result.data : null;
        },
    });

    const [receiverFullName, setReceiverFullName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [fullAddress, setFullAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [couponCode, setCouponCode] = useState("");
    const [couponPreview, setCouponPreview] =
        useState<CouponPreviewDTO | null>(null);

    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!savedAddress) return;

        setReceiverFullName(savedAddress.receiverFullName);
        setReceiverPhone(savedAddress.receiverPhone);
        setProvince(savedAddress.province);
        setCity(savedAddress.city);
        setFullAddress(savedAddress.fullAddress);
        setPostalCode(savedAddress.postalCode);
    }, [savedAddress]);

    async function handleApplyCoupon() {
        if (!couponCode.trim()) return;

        setIsApplyingCoupon(true);
        setCouponPreview(null);

        const result = await previewCouponAction({
            code: couponCode.trim(),
        });

        setIsApplyingCoupon(false);

        if (result.success) {
            setCouponPreview(result.data);
        } else {
            setCouponPreview({
                valid: false,
                error: result.error,
            });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError(null);
        setIsSubmitting(true);

        const addressResult = await saveMyAddressAction({
            receiverFullName,
            receiverPhone,
            province,
            city,
            fullAddress,
            postalCode,
        });

        if (!addressResult.success) {
            setIsSubmitting(false);
            setError(addressResult.error);
            return;
        }

        const orderResult = await createOrderAction({
            couponCode: couponPreview?.valid
                ? couponPreview.code
                : undefined,
        });

        setIsSubmitting(false);

        if (!orderResult.success) {
            setError(orderResult.error);
            return;
        }

        window.location.href = orderResult.data.paymentUrl;
    }

    if (cartLoading) {
        return <CheckoutLoading />;
    }

    if (!cart || cart.items.length === 0) {
        return <EmptyCheckout />;
    }

    const discount = couponPreview?.valid
        ? couponPreview.discountAmount
        : 0;

    const total = cart.totalPrice - discount;
    const courier = city ? resolveCourierType(city) : null;

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#f1f2f3] text-[#171717]"
        >
            <form
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-[500px] px-4 pb-36 pt-[92px]"
            >
                {/* Header */}
                <header className="fixed inset-x-0 top-0 z-50 mx-auto flex h-[88px] max-w-[500px] items-center justify-between bg-[#f1f2f3] px-4 pt-4">
                    <BackButton />

                    <div className="text-right">
                        <h1 className="text-[21px] font-bold tracking-tight">
                            تسویه حساب
                        </h1>

                        <p className="mt-0.5 text-[13px] text-black/45">
                            تکمیل سفارش و پرداخت
                        </p>
                    </div>
                </header>

                {/* Order summary */}
                <section>
                    <SectionTitle
                        icon={<span className="text-[15px]">🛍</span>}
                        title="خلاصه سفارش"
                    />

                    <div className="overflow-hidden rounded-[28px] bg-white">
                        {cart.items.map((item, index) => (
                            <div
                                key={item.variantId}
                                className={`flex gap-3 p-3.5 ${index !== 0
                                        ? "border-t border-black/[0.06]"
                                        : ""
                                    }`}
                            >
                                <div className="size-[72px] shrink-0 overflow-hidden rounded-[18px] bg-[#f5f5f5]">
                                    <Image
                                        src={item.mainImageUrl || "/site/product-placeholder.jpg"}
                                        alt={item.productTitle}
                                        width={72}
                                        height={72}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-[14px] font-semibold">
                                                {item.productTitle}
                                            </h3>

                                            <p className="mt-1 truncate text-[11px] text-black/40">
                                                {Object.values(
                                                    item.optionValues
                                                ).join(" / ") || "-"}
                                            </p>
                                        </div>

                                        <span className="shrink-0 text-[12px] text-black/40">
                                            × {item.quantity}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-[13px] font-bold">
                                        {(
                                            item.price * item.quantity
                                        ).toLocaleString("fa-IR")}{" "}
                                        <span className="text-[10px] font-normal text-black/40">
                                            تومن
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Coupon */}
                <section className="mt-6">
                    <SectionTitle
                        icon={<Tag className="size-4" />}
                        title="کد تخفیف"
                    />

                    <div className="rounded-[24px] bg-white p-3">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={handleApplyCoupon}
                                disabled={
                                    isApplyingCoupon ||
                                    !couponCode.trim()
                                }
                                className="h-11 shrink-0 rounded-[15px] px-5"
                            >
                                {isApplyingCoupon
                                    ? "..."
                                    : "اعمال"}
                            </Button>

                            <Input
                                value={couponCode}
                                onChange={(e) => {
                                    setCouponCode(e.target.value);
                                    setCouponPreview(null);
                                }}
                                placeholder="کد تخفیف"
                                className="h-11 rounded-[15px] border-0 bg-[#f1f2f3] text-right shadow-none"
                            />
                        </div>

                        {couponPreview && (
                            <div
                                className={`mt-3 rounded-[15px] px-3 py-2.5 text-[12px] ${couponPreview.valid
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-600"
                                    }`}
                            >
                                {couponPreview.valid
                                    ? `کد تخفیف اعمال شد؛ ${couponPreview.discountAmount.toLocaleString(
                                        "fa-IR"
                                    )} تومن تخفیف`
                                    : couponPreview.error}
                            </div>
                        )}
                    </div>
                </section>

                {/* Address */}
                <section className="mt-6">
                    <SectionTitle
                        icon={<MapPin className="size-4" />}
                        title="آدرس ارسال"
                    />

                    <div className="space-y-3 rounded-[28px] bg-white p-4">
                        <Input
                            value={receiverFullName}
                            onChange={(e) =>
                                setReceiverFullName(e.target.value)
                            }
                            placeholder="نام گیرنده"
                            required
                        />

                        <Input
                            value={receiverPhone}
                            onChange={(e) =>
                                setReceiverPhone(e.target.value)
                            }
                            placeholder="شماره موبایل گیرنده"
                            inputMode="tel"
                            required
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                value={province}
                                onChange={(e) =>
                                    setProvince(e.target.value)
                                }
                                placeholder="استان"
                                required
                            />

                            <Input
                                value={city}
                                onChange={(e) =>
                                    setCity(e.target.value)
                                }
                                placeholder="شهر"
                                required
                            />
                        </div>

                        <Textarea
                            value={fullAddress}
                            onChange={(e) =>
                                setFullAddress(e.target.value)
                            }
                            placeholder="آدرس کامل"
                            rows={3}
                            required
                            className="resize-none"
                        />

                        <Input
                            value={postalCode}
                            onChange={(e) =>
                                setPostalCode(e.target.value)
                            }
                            placeholder="کد پستی"
                            inputMode="numeric"
                            required
                        />
                    </div>
                </section>

                {/* Courier */}
                {courier && (
                    <section className="mt-6">
                        <SectionTitle
                            icon={<Truck className="size-4" />}
                            title="روش ارسال"
                        />

                        <div className="flex items-center gap-3 rounded-[24px] bg-white p-4">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-[#f1f2f3]">
                                <Truck className="size-5 text-black/60" />
                            </div>

                            <div>
                                <p className="text-[14px] font-semibold">
                                    {courierTypeLabel(courier)}
                                </p>

                                <p className="mt-0.5 text-[11px] text-black/40">
                                    هزینه ارسال پس‌کرایه است
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Price summary */}
                <section className="mt-6 rounded-[28px] bg-white p-5">
                    <div className="flex justify-between text-[13px]">
                        <span className="text-black/45">
                            جمع محصولات
                        </span>

                        <span>
                            {cart.totalPrice.toLocaleString("fa-IR")} تومن
                        </span>
                    </div>

                    {discount > 0 && (
                        <div className="mt-3 flex justify-between text-[13px] text-green-600">
                            <span>تخفیف</span>

                            <span>
                                -{" "}
                                {discount.toLocaleString("fa-IR")} تومن
                            </span>
                        </div>
                    )}

                    <div className="my-4 h-px bg-black/[0.06]" />

                    <div className="flex items-end justify-between">
                        <span className="text-[15px] font-semibold">
                            مبلغ قابل پرداخت
                        </span>

                        <div>
                            <span className="text-[21px] font-bold">
                                {total.toLocaleString("fa-IR")}
                            </span>

                            <span className="mr-1 text-[11px] text-black/40">
                                تومن
                            </span>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="mt-4 rounded-[18px] bg-red-50 px-4 py-3 text-[13px] leading-6 text-red-600">
                        {error}
                    </div>
                )}

                {/* Fixed payment CTA */}
                <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.05] bg-[#f1f2f3]/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-[500px] items-center gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-black/40">
                                مبلغ قابل پرداخت
                            </p>

                            <p className="truncate text-[16px] font-bold">
                                {total.toLocaleString("fa-IR")}{" "}
                                <span className="text-[10px] font-normal text-black/40">
                                    تومن
                                </span>
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-13 flex-1 rounded-[18px] text-[15px] font-semibold"
                        >
                            {isSubmitting ? (
                                "در حال انتقال..."
                            ) : (
                                <>
                                    پرداخت و ثبت سفارش
                                    <ChevronLeft className="mr-1 size-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </main>
    );
}

function SectionTitle({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <div className="mb-3 flex items-center gap-2 px-1">
            <div className="flex size-7 items-center justify-center rounded-[10px] bg-white text-black/60">
                {icon}
            </div>

            <h2 className="text-[15px] font-semibold">
                {title}
            </h2>
        </div>
    );
}

function CheckoutLoading() {
    return (
        <main
            dir="rtl"
            className="flex min-h-screen items-center justify-center bg-[#f1f2f3]"
        >
            <div className="text-center">
                <div className="mx-auto size-7 animate-spin rounded-full border-2 border-black/10 border-t-black/60" />
                <p className="mt-3 text-[13px] text-black/45">
                    در حال آماده‌سازی سفارش...
                </p>
            </div>
        </main>
    );
}

function EmptyCheckout() {
    return (
        <main
            dir="rtl"
            className="flex min-h-screen items-center justify-center bg-[#f1f2f3] px-5"
        >
            <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[22px] bg-white">
                    <span className="text-2xl">🛍</span>
                </div>

                <h1 className="text-[17px] font-semibold">
                    سبد خرید شما خالی است
                </h1>

                <Button
                    type="button"
                    className="mt-5 rounded-full"
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    بازگشت به فروشگاه
                </Button>
            </div>
        </main>
    );
}