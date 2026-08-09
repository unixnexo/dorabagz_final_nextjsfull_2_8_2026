"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { toNotificationDTO } from "./notification-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { NotificationDTO } from "@/types/notification";
import type { PaginatedResult } from "@/types/user";

// ---------------------------------------------------------------------------
// List the current user's (or admin's) notifications, paginated, newest
// first. Works identically for a normal user and an admin — each only
// ever sees notifications addressed to their own userId, per your spec.
// ---------------------------------------------------------------------------
export async function listNotificationsAction(input: {
  page?: number;
  pageSize?: number;
}): Promise<ActionResult<PaginatedResult<NotificationDTO>>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  const where = { userId: identity.userId };

  const [items, totalItems] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toNotificationDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Unread count — for a badge/indicator elsewhere in the UI (e.g. header icon).
// ---------------------------------------------------------------------------
export async function getUnreadNotificationCountAction(): Promise<ActionResult<number>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: true, data: 0 }; // logged out = no badge, not an error

  const count = await prisma.notification.count({
    where: { userId: identity.userId, isRead: false },
  });
  return { success: true, data: count };
}

// ---------------------------------------------------------------------------
// Mark one notification as read.
// ---------------------------------------------------------------------------
export async function markNotificationReadAction(
  notificationId: string
): Promise<ActionResult<{ read: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: identity.userId },
    data: { isRead: true },
  });
  return { success: true, data: { read: true } };
}

// ---------------------------------------------------------------------------
// Mark ALL of the current user's notifications as read.
// ---------------------------------------------------------------------------
export async function markAllNotificationsReadAction(): Promise<ActionResult<{ read: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  await prisma.notification.updateMany({
    where: { userId: identity.userId, isRead: false },
    data: { isRead: true },
  });
  return { success: true, data: { read: true } };
}
