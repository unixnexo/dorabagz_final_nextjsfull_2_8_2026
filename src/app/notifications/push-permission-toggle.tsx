"use client";

import { usePushNotifications } from "@/hooks/use-push-notifications";

export function PushPermissionToggle() {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  if (permission === "unsupported") {
    return <p style={{ fontSize: 13, color: "#666" }}>مرورگر شما از اعلان‌های وب پشتیبانی نمی‌کند.</p>;
  }

  if (permission === "denied") {
    return (
      <p style={{ fontSize: 13, color: "#666" }}>
        اعلان‌ها مسدود شده‌اند. برای فعال‌سازی، دسترسی اعلان را از تنظیمات مرورگر تغییر دهید.
      </p>
    );
  }

  return (
    <div style={{ margin: "16px 0" }}>
      {isSubscribed ? (
        <button onClick={() => unsubscribe()} disabled={isLoading}>
          {isLoading ? "در حال پردازش..." : "غیرفعال کردن اعلان‌های مرورگر"}
        </button>
      ) : (
        <button onClick={() => subscribe()} disabled={isLoading}>
          {isLoading ? "در حال پردازش..." : "فعال کردن اعلان‌های مرورگر"}
        </button>
      )}
    </div>
  );
}
