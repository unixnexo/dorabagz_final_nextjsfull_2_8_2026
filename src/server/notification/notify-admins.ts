import "server-only";
import { prisma } from "@/lib/prisma";
import { notify } from "./notify";
import type { NotificationChannel } from "@prisma/client";

/** Sends the same notification to every active admin — used for events
 *  like "new order placed" that admin as a whole needs to see, not one
 *  specific admin. */
export async function notifyAllAdmins(params: {
  title: string;
  body: string;
  linkUrl?: string;
  channel: NotificationChannel;
}): Promise<void> {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", isActive: true },
    select: { id: true },
  });

  for (const admin of admins) {
    await notify({ ...params, userId: admin.id });
  }
}
