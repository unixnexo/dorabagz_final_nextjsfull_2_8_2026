"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js on mount. Renders nothing — this is a side-effect-only
 * component placed once in the root layout. Registration failures are
 * logged but never break the page (push/PWA is a progressive enhancement,
 * not a requirement to use the site).
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("Service worker registration failed:", err);
    });
  }, []);

  return null;
}
