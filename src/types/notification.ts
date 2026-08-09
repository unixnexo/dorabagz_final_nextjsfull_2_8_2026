export type NotificationChannel = "PUSH" | "SMS" | "BOTH";

export type NotificationDTO = {
  id: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
};

/** Shape sent by the browser when subscribing to push (the raw
 *  PushSubscription.toJSON() shape, minus anything we don't need). */
export type PushSubscriptionInput = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};
