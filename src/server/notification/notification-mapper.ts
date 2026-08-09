import type { Notification } from "@prisma/client";
import type { NotificationDTO } from "@/types/notification";

export function toNotificationDTO(notification: Notification): NotificationDTO {
  return {
    id: notification.id,
    title: notification.title,
    body: notification.body,
    channel: notification.channel,
    linkUrl: notification.linkUrl,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  };
}
