"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/session";
import {
  createImpersonationToken,
  setImpersonationCookie,
  clearImpersonationCookie,
} from "@/server/auth/session";
import type { ActionResult } from "@/server/auth/actions";

/**
 * Admin starts impersonating a user. Creates a short-lived impersonation
 * JWT (separate cookie from the admin's own session) and logs it in
 * ImpersonationLog for accountability, per your spec.
 */
export async function startImpersonationAction(
  targetUserId: string
): Promise<ActionResult<{ redirectTo: string }>> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, error: "دسترسی غیرمجاز." };
  }

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) return { success: false, error: "کاربر یافت نشد." };
  if (targetUser.role === "ADMIN") {
    return { success: false, error: "امکان ورود به حساب مدیر دیگر وجود ندارد." };
  }

  await prisma.impersonationLog.create({
    data: { adminId: session.userId, targetUserId: targetUser.id },
  });

  const token = await createImpersonationToken({
    userId: targetUser.id,
    role: targetUser.role,
    impersonatedBy: session.userId,
  });
  await setImpersonationCookie(token);

  return { success: true, data: { redirectTo: "/" } };
}

/**
 * Admin hits "back to admin panel" — ends impersonation, marks the log
 * row's endedAt, restores normal admin session (which was untouched the
 * whole time since impersonation uses a separate cookie).
 */
export async function stopImpersonationAction(): Promise<void> {
  const session = await getSession();

  // Close the most recent open impersonation log for this admin, if any.
  if (session) {
    const openLog = await prisma.impersonationLog.findFirst({
      where: { adminId: session.userId, endedAt: null },
      orderBy: { startedAt: "desc" },
    });
    if (openLog) {
      await prisma.impersonationLog.update({
        where: { id: openLog.id },
        data: { endedAt: new Date() },
      });
    }
  }

  await clearImpersonationCookie();
  redirect("/admin/users");
}
