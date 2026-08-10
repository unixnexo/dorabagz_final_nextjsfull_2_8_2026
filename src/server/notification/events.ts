import "server-only";
import { notify } from "./notify";
import { notifyAllAdmins } from "./notify-admins";

/**
 * Central catalog of every notification event in the app. Each function
 * here is called from the relevant module's server action (see the call
 * sites noted in each comment) — keeping the actual notification COPY and
 * CHANNEL CHOICE in one file makes it easy to review/tweak wording later
 * without hunting through order/user/coupon action files.
 *
 * Channel choices per your spec:
 *   - Order status changes (confirmed/completed/cancelled) -> BOTH (push + SMS)
 *   - Payment success -> BOTH
 *   - Payment failure -> BOTH
 *   - New order placed (to admin) -> BOTH
 *   - Everything else -> PUSH only (my default judgment call, e.g. account
 *     unlocked, coupon-limit-reached admin heads-up)
 */

// ---------------------------------------------------------------------------
// Orders (called from src/server/order/*)
// ---------------------------------------------------------------------------

export async function notifyOrderPlaced(orderId: string, orderShortId: string) {
  await notifyAllAdmins({
    title: "سفارش جدید",
    body: `یک سفارش جدید با شماره ${orderShortId} ثبت شد.`,
    linkUrl: `/admin/orders/${orderId}`,
    channel: "BOTH",
  });
}

export async function notifyPaymentSucceeded(userId: string, orderId: string, orderShortId: string) {
  await notify({
    userId,
    title: "پرداخت موفق",
    body: `پرداخت سفارش ${orderShortId} با موفقیت انجام شد.`,
    linkUrl: `/dashboard/orders/${orderId}`,
    channel: "BOTH",
  });
}

export async function notifyPaymentFailed(userId: string, orderId: string, orderShortId: string) {
  await notify({
    userId,
    title: "پرداخت ناموفق",
    body: `پرداخت سفارش ${orderShortId} ناموفق بود. می‌توانید دوباره تلاش کنید.`,
    linkUrl: `/dashboard/orders/${orderId}`,
    channel: "BOTH",
  });
}

export async function notifyOrderStatusChanged(
  userId: string,
  orderId: string,
  orderShortId: string,
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED"
) {
  const statusLabels: Record<string, string> = {
    CONFIRMED: "پرداخت شد",
    COMPLETED: "تکمیل و ارسال شد",
    CANCELLED: "لغو شد",
  };
  await notify({
    userId,
    title: "به‌روزرسانی سفارش",
    body: `سفارش ${orderShortId} ${statusLabels[status]}.`,
    linkUrl: `/dashboard/orders/${orderId}`,
    channel: "BOTH",
  });
}

// ---------------------------------------------------------------------------
// Users (called from src/server/user/*)
// ---------------------------------------------------------------------------

export async function notifyAccountUnlocked(userId: string) {
  await notify({
    userId,
    title: "حساب کاربری باز شد",
    body: "قفل حساب کاربری شما توسط مدیر برداشته شد. اکنون می‌توانید وارد شوید.",
    channel: "PUSH",
  });
}

// ---------------------------------------------------------------------------
// Reviews (called from src/server/review/*)
// ---------------------------------------------------------------------------

/** Sent once an order moves to COMPLETED — nudges the buyer to review it.
 *  Push only (not SMS — this is a nice-to-have prompt, not the "important
 *  event" tier you asked to reserve SMS for). */
export async function notifyPleaseReviewOrder(userId: string, orderId: string) {
  await notify({
    userId,
    title: "نظر شما برای ما مهم است",
    body: "سفارش شما تحویل داده شد. لطفاً چند لحظه وقت بگذارید و به آن امتیاز دهید.",
    linkUrl: `/dashboard/orders/${orderId}`,
    channel: "PUSH",
  });
}

/** Sent to all admins when a review WITH TEXT is submitted and needs
 *  approval before going public (rating-only reviews skip this entirely
 *  — they're auto-approved, per your spec). */
export async function notifyReviewPendingApproval() {
  await notifyAllAdmins({
    title: "نظر جدید در انتظار تایید",
    body: "یک نظر جدید ثبت شده و منتظر تایید شماست.",
    linkUrl: `/admin/reviews`,
    channel: "PUSH",
  });
}

// ---------------------------------------------------------------------------
// Coupons (called from src/server/coupon/*) — admin-facing heads-up
// ---------------------------------------------------------------------------

export async function notifyCouponLimitReached(couponCode: string) {
  await notifyAllAdmins({
    title: "ظرفیت کد تخفیف تمام شد",
    body: `ظرفیت استفاده از کد تخفیف ${couponCode} به پایان رسید.`,
    linkUrl: `/admin/coupons`,
    channel: "PUSH",
  });
}
