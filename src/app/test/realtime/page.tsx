/**
 * ============================================================================
 * PAGE: /test/realtime (ISOLATED TEST PAGE -- does not touch any real
 * app UI. Safe to delete once you've wired the real header/cart-badge
 * yourself; nothing else in the app imports from this page.)
 * ============================================================================
 * Demonstrates and lets you manually verify both pieces you asked for:
 *
 * 1. CART COUNT -- no new endpoint needed. getCartAction() (already
 *    existed, src/server/cart/actions.ts) returns the logged-in user's
 *    full cart, including totalItems (sum of quantities) -- exactly
 *    what you described wanting to call on login and on cart-page visit,
 *    to reconcile against your own client-tracked local state. This page
 *    calls it on mount and on demand (button) so you can see the shape
 *    of what it returns.
 *
 * 2. LIVE NOTIFICATION TOAST -- driven by Web Push (Module 5), not
 *    polling. When a push notification arrives, the service worker
 *    (public/sw.js) now ALSO relays it to any open tab via postMessage
 *    (in addition to showing the native OS notification, unchanged).
 *    useLiveNotifications (src/hooks/use-live-notifications.ts) listens
 *    for that relay and updates a local unread-count + fires a callback
 *    the instant it happens -- this page uses that callback to show a
 *    react-hot-toast toast.
 *
 * TO ACTUALLY TEST THE LIVE TOAST: you must be logged in AND have
 * enabled push notifications (the button below, same as the toggle on
 * the real /notifications page). Then trigger any real notification
 * event (e.g. as admin, change an order's status -- see
 * src/server/notification/events.ts for the full list of what triggers
 * a push) and this tab should show a toast + increment the badge
 * INSTANTLY, without reloading or polling.
 *
 * DATA SHAPES (for other agents wiring the real UI):
 *   getCartAction() -> ActionResult<CartSummaryDTO>  (src/types/cart.ts)
 *     CartSummaryDTO = { items: CartItemDTO[], totalItems: number, totalPrice: number }
 *     totalItems is the number to show in a cart badge.
 *
 *   getUnreadNotificationCountAction() -> ActionResult<number>
 *     (src/server/notification/actions.ts) -- call this ONCE on initial
 *     page load / app mount to seed the badge with the real current
 *     count (covers notifications that arrived while the tab was
 *     closed). Pass that number into useLiveNotifications as
 *     initialUnreadCount -- after that, the hook keeps it live itself.
 *
 *   useLiveNotifications(initialUnreadCount, onNotification?)
 *     -> { unreadCount, setUnreadCount }
 *     onNotification receives { title, body, linkUrl } the instant a
 *     push is relayed -- use it to fire a toast, refetch a list, etc.
 *     Reset unreadCount to 0 yourself (via setUnreadCount(0)) whenever
 *     the user visits /notifications or hits "mark all read" -- this
 *     hook does not do that automatically, it only ever increments.
 * ============================================================================
 */
"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getCartAction } from "@/server/cart/actions";
import { getUnreadNotificationCountAction } from "@/server/notification/actions";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useLiveNotifications } from "@/hooks/use-live-notifications";
import type { CartSummaryDTO } from "@/types/cart";

export default function RealtimeTestPage() {
  const [cart, setCart] = useState<CartSummaryDTO | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [initialUnreadCount, setInitialUnreadCount] = useState<number | null>(null);

  const { permission, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  const { unreadCount, setUnreadCount } = useLiveNotifications(initialUnreadCount ?? 0, (payload) => {
    toast.success(`${payload.title}\n${payload.body}`, { duration: 6000 });
  });

  async function refetchCart() {
    const result = await getCartAction();
    if (result.success) {
      setCart(result.data);
      setCartError(null);
    } else {
      setCart(null);
      setCartError(result.error);
    }
  }

  useEffect(() => {
    refetchCart();
    getUnreadNotificationCountAction().then((result) => {
      if (result.success) setInitialUnreadCount(result.data);
    });
  }, []);

  return (
    <main dir="rtl" style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <Toaster position="top-center" />

      <h1>صفحه تست — سبد خرید و اعلان‌های زنده</h1>
      <p style={{ color: "#888", fontSize: 13 }}>
        این یک صفحه تست جداست، به هیچ بخش دیگری از سایت وصل نیست و با خیال راحت قابل حذف است.
      </p>

      <section style={{ border: "1px solid #ddd", padding: 16, marginTop: 24 }}>
        <h2>۱. سبد خرید (getCartAction)</h2>
        <button onClick={refetchCart}>دریافت دوباره سبد خرید</button>

        {cartError && <p style={{ color: "red" }}>{cartError}</p>}

        {cart && (
          <div style={{ marginTop: 12 }}>
            <p>
              تعداد کل اقلام (totalItems): <strong>{cart.totalItems}</strong>
            </p>
            <p>جمع قیمت: {cart.totalPrice.toLocaleString("fa-IR")} تومان</p>
            <p>تعداد ردیف‌های متفاوت: {cart.items.length}</p>
          </div>
        )}
      </section>

      <section style={{ border: "1px solid #ddd", padding: 16, marginTop: 24 }}>
        <h2>۲. اعلان‌های زنده (useLiveNotifications)</h2>

        <p>
          تعداد اعلان‌های خوانده‌نشده: <strong>{unreadCount}</strong>
        </p>
        <button onClick={() => setUnreadCount(0)}>صفر کردن شمارنده (شبیه‌سازی "خواندن همه")</button>

        <div style={{ marginTop: 12 }}>
          {permission === "unsupported" && <p>مرورگر شما از اعلان‌های وب پشتیبانی نمی‌کند.</p>}
          {permission === "denied" && <p>اعلان‌ها مسدود شده‌اند — از تنظیمات مرورگر فعال کنید.</p>}
          {(permission === "default" || permission === "granted") && (
            <button onClick={() => (isSubscribed ? unsubscribe() : subscribe())} disabled={isLoading}>
              {isLoading
                ? "در حال پردازش..."
                : isSubscribed
                  ? "غیرفعال کردن اعلان‌های مرورگر"
                  : "فعال کردن اعلان‌های مرورگر"}
            </button>
          )}
        </div>

        <p style={{ marginTop: 12, fontSize: 13, color: "#888" }}>
          برای تست واقعی: اعلان‌ها را فعال کنید، سپس یک رویداد واقعی ایجاد کننده اعلان را انجام دهید
          (مثلاً از پنل ادمین وضعیت یک سفارش را تغییر دهید) — این تب باید بلافاصله toast نشان دهد و
          شمارنده بالا برود، بدون رفرش یا poll.
        </p>
      </section>
    </main>
  );
}
