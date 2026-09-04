// /**
//  * Service worker: handles two jobs.
//  *   1. Web Push — receives push events from the server (see
//  *      src/server/notification/web-push-client.ts) and shows a native
//  *      OS/browser notification.
//  *   2. PWA requirement — a registered service worker is one of the two
//  *      requirements (along with the manifest) for "Add to Home Screen" /
//  *      installability. No offline caching is implemented here on purpose
//  *      (you said you don't need it) — this worker does NOT intercept
//  *      fetch requests at all.
//  *
//  * Plain vanilla JS, no build step, no library — served as-is from /public.
//  */

// self.addEventListener("install", () => {
//   // Activate this worker immediately instead of waiting for old tabs to close.
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(self.clients.claim());
// });

// self.addEventListener("push", (event) => {
//   if (!event.data) return;

//   let payload;
//   try {
//     payload = event.data.json();
//   } catch {
//     payload = { title: "اعلان جدید", body: event.data.text() };
//   }

//   const title = payload.title || "اعلان جدید";
//   const options = {
//     body: payload.body || "",
//     icon: "/icons/icon-192.png",
//     badge: "/icons/icon-192.png",
//     data: { linkUrl: payload.linkUrl || "/notifications" },
//     dir: "rtl",
//     lang: "fa",
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

// // Tapping the notification focuses an existing tab if one is open at the
// // target URL, otherwise opens a new one.
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   const linkUrl = event.notification.data?.linkUrl || "/notifications";

//   event.waitUntil(
//     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
//       for (const client of clientList) {
//         if (client.url.includes(linkUrl) && "focus" in client) {
//           return client.focus();
//         }
//       }
//       if (self.clients.openWindow) {
//         return self.clients.openWindow(linkUrl);
//       }
//     })
//   );
// });








/**
 * Service worker: handles three jobs.
 *   1. Web Push — receives push events from the server (see
 *      src/server/notification/web-push-client.ts) and shows a native
 *      OS/browser notification.
 *   2. Live relay — ALSO forwards every push payload to any currently
 *      open tab via postMessage, so an open page can show an in-app
 *      toast the instant the push arrives, without polling. See
 *      src/hooks/use-live-notifications.ts for the client-side listener.
 *      This is additive: the native OS notification (job 1) still fires
 *      too — this doesn't replace it, it just also tells any open tab.
 *   3. PWA requirement — a registered service worker is one of the two
 *      requirements (along with the manifest) for "Add to Home Screen" /
 *      installability. No offline caching is implemented here on purpose
 *      (you said you don't need it) — this worker does NOT intercept
 *      fetch requests at all.
 *
 * Plain vanilla JS, no build step, no library — served as-is from /public.
 */

self.addEventListener("install", () => {
  // Activate this worker immediately instead of waiting for old tabs to close.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "اعلان جدید", body: event.data.text() };
  }

  const title = payload.title || "اعلان جدید";
  const body = payload.body || "";
  const linkUrl = payload.linkUrl || "/notifications";

  const options = {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { linkUrl },
    dir: "rtl",
    lang: "fa",
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      // Relay to every open tab this worker controls. A page's
      // use-live-notifications hook listens for type: "PUSH_RECEIVED"
      // and reacts immediately (toast + badge bump) — no polling.
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          client.postMessage({ type: "PUSH_RECEIVED", title, body, linkUrl });
        }
      }),
    ])
  );
});

// Tapping the notification focuses an existing tab if one is open at the
// target URL, otherwise opens a new one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const linkUrl = event.notification.data?.linkUrl || "/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(linkUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(linkUrl);
      }
    })
  );
});

