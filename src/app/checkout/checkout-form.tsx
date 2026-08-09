"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCartAction } from "@/server/cart/actions";
import { getMyAddressAction, saveMyAddressAction } from "@/server/address/actions";
import { previewCouponAction } from "@/server/coupon/apply-actions";
import { createOrderAction } from "@/server/order/checkout-action";
import { resolveCourierType, courierTypeLabel } from "@/lib/courier";
import type { CouponPreviewDTO } from "@/types/coupon";

export function CheckoutForm() {
  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const result = await getCartAction();
      if (!result.success) throw new Error(result.error);
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
  const [couponPreview, setCouponPreview] = useState<CouponPreviewDTO | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill from saved address once it loads — per your spec, "hit and prefill."
  useEffect(() => {
    if (savedAddress) {
      setReceiverFullName(savedAddress.receiverFullName);
      setReceiverPhone(savedAddress.receiverPhone);
      setProvince(savedAddress.province);
      setCity(savedAddress.city);
      setFullAddress(savedAddress.fullAddress);
      setPostalCode(savedAddress.postalCode);
    }
  }, [savedAddress]);

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponPreview(null);
    const result = await previewCouponAction({ code: couponCode });
    setIsApplyingCoupon(false);
    if (result.success) {
      setCouponPreview(result.data);
    } else {
      setCouponPreview({ valid: false, error: result.error });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Always save/update the address first (per spec: one address, always
    // overwritten in place).
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
      couponCode: couponPreview?.valid ? couponPreview.code : undefined,
    });

    setIsSubmitting(false);
    if (!orderResult.success) {
      setError(orderResult.error);
      return;
    }

    // Redirect the whole browser to ZarinPal — not a Next.js router push,
    // this is an external URL.
    window.location.href = orderResult.data.paymentUrl;
  }

  if (cartLoading) return <p>در حال بارگذاری...</p>;
  if (!cart || cart.items.length === 0) return <p>سبد خرید شما خالی است.</p>;

  const discount = couponPreview?.valid ? couponPreview.discountAmount : 0;
  const total = cart.totalPrice - discount;
  const courier = city ? resolveCourierType(city) : null;

  return (
    <form onSubmit={handleSubmit}>
      <h2>خلاصه سفارش</h2>
      <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.variantId}>
              <td>{item.productTitle}</td>
              <td>{Object.values(item.optionValues).join(" / ") || "-"}</td>
              <td>{item.quantity}</td>
              <td>{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>جمع جزء: {cart.totalPrice.toLocaleString("fa-IR")} تومان</p>
      {discount > 0 && <p>تخفیف: {discount.toLocaleString("fa-IR")}- تومان</p>}
      <h3>مبلغ قابل پرداخت: {total.toLocaleString("fa-IR")} تومان</h3>

      <fieldset style={{ margin: "16px 0", padding: 12 }}>
        <legend>کد تخفیف</legend>
        <input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="کد تخفیف را وارد کنید"
        />
        <button type="button" onClick={handleApplyCoupon} disabled={isApplyingCoupon} style={{ marginRight: 8 }}>
          {isApplyingCoupon ? "در حال بررسی..." : "اعمال کد"}
        </button>
        {couponPreview && (
          <p style={{ color: couponPreview.valid ? "green" : "red" }}>
            {couponPreview.valid
              ? `کد تخفیف اعمال شد: ${couponPreview.discountAmount.toLocaleString("fa-IR")} تومان تخفیف`
              : couponPreview.error}
          </p>
        )}
      </fieldset>

      <fieldset style={{ margin: "16px 0", padding: 12 }}>
        <legend>آدرس ارسال</legend>

        <label htmlFor="receiverFullName">نام گیرنده</label>
        <input
          id="receiverFullName"
          value={receiverFullName}
          onChange={(e) => setReceiverFullName(e.target.value)}
          style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
        />

        <label htmlFor="receiverPhone">شماره موبایل گیرنده</label>
        <input
          id="receiverPhone"
          value={receiverPhone}
          onChange={(e) => setReceiverPhone(e.target.value)}
          style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
        />

        <label htmlFor="province">استان</label>
        <input
          id="province"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
        />

        <label htmlFor="city">شهر</label>
        <input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
        />
        {courier && <p style={{ fontSize: 13, color: "#666" }}>روش ارسال: {courierTypeLabel(courier)}</p>}

        <label htmlFor="fullAddress">آدرس کامل</label>
        <textarea
          id="fullAddress"
          value={fullAddress}
          onChange={(e) => setFullAddress(e.target.value)}
          rows={3}
          style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
        />

        <label htmlFor="postalCode">کد پستی</label>
        <input
          id="postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
        />
      </fieldset>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال انتقال به درگاه پرداخت..." : "پرداخت"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
