import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLiveNotifications } from "@/hooks/use-live-notifications";

/**
 * Mocks navigator.serviceWorker.addEventListener/removeEventListener so
 * we can simulate the service worker posting a "PUSH_RECEIVED" message
 * without a real service worker or a real push event -- this tests the
 * hook's own logic (message filtering, count increment, callback firing),
 * not the browser's push machinery itself.
 */
function mockServiceWorker() {
  const listeners: ((event: MessageEvent) => void)[] = [];

  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      addEventListener: (type: string, listener: (event: MessageEvent) => void) => {
        if (type === "message") listeners.push(listener);
      },
      removeEventListener: (type: string, listener: (event: MessageEvent) => void) => {
        if (type === "message") {
          const idx = listeners.indexOf(listener);
          if (idx >= 0) listeners.splice(idx, 1);
        }
      },
    },
  });

  return {
    simulateMessage: (data: unknown) => {
      const event = { data } as MessageEvent;
      listeners.forEach((l) => l(event));
    },
  };
}

describe("useLiveNotifications", () => {
  let sw: ReturnType<typeof mockServiceWorker>;

  beforeEach(() => {
    sw = mockServiceWorker();
  });

  it("starts with the provided initialUnreadCount", () => {
    const { result } = renderHook(() => useLiveNotifications(3));
    expect(result.current.unreadCount).toBe(3);
  });

  it("increments unreadCount by 1 when a PUSH_RECEIVED message arrives", () => {
    const { result } = renderHook(() => useLiveNotifications(0));

    act(() => {
      sw.simulateMessage({ type: "PUSH_RECEIVED", title: "t", body: "b", linkUrl: "/x" });
    });

    expect(result.current.unreadCount).toBe(1);
  });

  it("ignores messages that aren't type PUSH_RECEIVED", () => {
    const { result } = renderHook(() => useLiveNotifications(0));

    act(() => {
      sw.simulateMessage({ type: "SOME_OTHER_MESSAGE" });
    });

    expect(result.current.unreadCount).toBe(0);
  });

  it("calls onNotification with the payload when a push is relayed", () => {
    const onNotification = vi.fn();
    renderHook(() => useLiveNotifications(0, onNotification));

    act(() => {
      sw.simulateMessage({
        type: "PUSH_RECEIVED",
        title: "سفارش تایید شد",
        body: "سفارش شما پرداخت شد.",
        linkUrl: "/dashboard/orders/1",
      });
    });

    expect(onNotification).toHaveBeenCalledWith({
      title: "سفارش تایید شد",
      body: "سفارش شما پرداخت شد.",
      linkUrl: "/dashboard/orders/1",
    });
  });

  it("accumulates count correctly across multiple relayed pushes", () => {
    const { result } = renderHook(() => useLiveNotifications(2));

    act(() => {
      sw.simulateMessage({ type: "PUSH_RECEIVED", title: "a", body: "a", linkUrl: "/a" });
      sw.simulateMessage({ type: "PUSH_RECEIVED", title: "b", body: "b", linkUrl: "/b" });
    });

    expect(result.current.unreadCount).toBe(4);
  });

  it("allows resetting the count manually via setUnreadCount", () => {
    const { result } = renderHook(() => useLiveNotifications(5));

    act(() => {
      result.current.setUnreadCount(0);
    });

    expect(result.current.unreadCount).toBe(0);
  });
});
