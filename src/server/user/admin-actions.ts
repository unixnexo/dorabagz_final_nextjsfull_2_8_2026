// "use server";

// import { prisma } from "@/lib/prisma";
// import { getEffectiveIdentity, getSession } from "@/server/auth/session";
// import {
//   adminUpdateUserSchema,
//   adminUserListQuerySchema,
// } from "@/lib/validations/user";
// import {
//   toAdminUserListItemDTO,
//   toAdminUserDetailDTO,
// } from "./user-mapper";
// import { notifyAccountUnlocked } from "@/server/notification/events";
// import type { ActionResult } from "@/server/auth/actions";
// import type {
//   AdminUserListItemDTO,
//   AdminUserDetailDTO,
//   PaginatedResult,
// } from "@/types/user";

// /**
//  * Every admin action re-checks the REAL session (not the effective/
//  * impersonated identity) — an impersonated admin session should NOT be
//  * able to perform admin actions while impersonating a normal user.
//  */
// async function requireAdmin(): Promise<{ userId: string } | null> {
//   const session = await getSession();
//   if (!session || session.role !== "ADMIN") return null;
//   return { userId: session.userId };
// }

// // ---------------------------------------------------------------------------
// // List users — paginated, searchable, filterable.
// // ---------------------------------------------------------------------------
// export async function listUsersAction(
//   input: unknown
// ): Promise<ActionResult<PaginatedResult<AdminUserListItemDTO>>> {
//   const admin = await requireAdmin();
//   if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

//   const parsed = adminUserListQuerySchema.safeParse(input);
//   if (!parsed.success) {
//     return { success: false, error: parsed.error.issues[0].message };
//   }
//   const { page, pageSize, search, role, isActive } = parsed.data;

//   const where = {
//     ...(role ? { role } : {}),
//     ...(isActive !== undefined ? { isActive } : {}),
//     ...(search
//       ? {
//           OR: [
//             { phoneNumber: { contains: search } },
//             { fullName: { contains: search } },
//           ],
//         }
//       : {}),
//   };

//   const [items, totalItems] = await Promise.all([
//     prisma.user.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       skip: (page - 1) * pageSize,
//       take: pageSize,
//     }),
//     prisma.user.count({ where }),
//   ]);

//   return {
//     success: true,
//     data: {
//       items: items.map(toAdminUserListItemDTO),
//       page,
//       pageSize,
//       totalItems,
//       totalPages: Math.ceil(totalItems / pageSize) || 1,
//     },
//   };
// }

// // ---------------------------------------------------------------------------
// // Get single user detail (for admin's user detail page)
// // ---------------------------------------------------------------------------
// export async function getUserDetailAction(
//   userId: string
// ): Promise<ActionResult<AdminUserDetailDTO>> {
//   const admin = await requireAdmin();
//   if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

//   const user = await prisma.user.findUnique({ where: { id: userId } });
//   if (!user) return { success: false, error: "کاربر یافت نشد." };

//   return { success: true, data: toAdminUserDetailDTO(user) };
// }

// // ---------------------------------------------------------------------------
// // Update a user (admin can change phone number WITHOUT otp, per spec)
// // ---------------------------------------------------------------------------
// export async function adminUpdateUserAction(
//   input: unknown
// ): Promise<ActionResult<AdminUserDetailDTO>> {
//   const admin = await requireAdmin();
//   if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

//   const parsed = adminUpdateUserSchema.safeParse(input);
//   if (!parsed.success) {
//     return { success: false, error: parsed.error.issues[0].message };
//   }
//   const { userId, ...updates } = parsed.data;

//   if (updates.phoneNumber) {
//     const existing = await prisma.user.findUnique({
//       where: { phoneNumber: updates.phoneNumber },
//     });
//     if (existing && existing.id !== userId) {
//       return { success: false, error: "این شماره قبلاً در سیستم ثبت شده است." };
//     }
//   }

//   const user = await prisma.user.update({
//     where: { id: userId },
//     data: {
//       ...(updates.phoneNumber !== undefined && { phoneNumber: updates.phoneNumber }),
//       ...(updates.fullName !== undefined && { fullName: updates.fullName || null }),
//       ...(updates.nationalCode !== undefined && {
//         nationalCode: updates.nationalCode || null,
//       }),
//       ...(updates.email !== undefined && { email: updates.email || null }),
//       ...(updates.isActive !== undefined && { isActive: updates.isActive }),
//     },
//   });

//   return { success: true, data: toAdminUserDetailDTO(user) };
// }

// // ---------------------------------------------------------------------------
// // Toggle active/deactivated
// // ---------------------------------------------------------------------------
// export async function setUserActiveAction(
//   userId: string,
//   isActive: boolean
// ): Promise<ActionResult<{ isActive: boolean }>> {
//   const admin = await requireAdmin();
//   if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

//   await prisma.user.update({ where: { id: userId }, data: { isActive } });
//   return { success: true, data: { isActive } };
// }

// // ---------------------------------------------------------------------------
// // Unlock a locked account before its timer expires
// // ---------------------------------------------------------------------------
// export async function unlockUserAction(
//   userId: string
// ): Promise<ActionResult<{ unlocked: true }>> {
//   const admin = await requireAdmin();
//   if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

//   await prisma.user.update({
//     where: { id: userId },
//     data: { lockedUntil: null, failedOtpAttempts: 0 },
//   });
//   await notifyAccountUnlocked(userId);
//   return { success: true, data: { unlocked: true } };
// }












"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity, getSession } from "@/server/auth/session";
import {
  adminUpdateUserSchema,
  adminUserListQuerySchema,
} from "@/lib/validations/user";
import {
  toAdminUserListItemDTO,
  toAdminUserDetailDTO,
} from "./user-mapper";
import { notifyAccountUnlocked } from "@/server/notification/events";
import type { ActionResult } from "@/server/auth/actions";
import type {
  AdminUserListItemDTO,
  AdminUserDetailDTO,
  PaginatedResult,
} from "@/types/user";

/**
 * Every admin action re-checks the REAL session (not the effective/
 * impersonated identity) — an impersonated admin session should NOT be
 * able to perform admin actions while impersonating a normal user.
 */
async function requireAdmin(): Promise<{ userId: string } | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return { userId: session.userId };
}

// ---------------------------------------------------------------------------
// List users — paginated, searchable, filterable.
// ---------------------------------------------------------------------------
export async function listUsersAction(
  input: unknown
): Promise<ActionResult<PaginatedResult<AdminUserListItemDTO>>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = adminUserListQuerySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { page, pageSize, search, role, isActive } = parsed.data;

  const where = {
    ...(role ? { role } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
    ...(search
      ? {
        OR: [
          { phoneNumber: { contains: search } },
          { fullName: { contains: search } },
        ],
      }
      : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toAdminUserListItemDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Get single user detail (for admin's user detail page)
// ---------------------------------------------------------------------------
export async function getUserDetailAction(
  userId: string
): Promise<ActionResult<AdminUserDetailDTO>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "کاربر یافت نشد." };

  // Same "actually paid" rule as everywhere else (Module 6 reports,
  // Module 9 discounts): only CONFIRMED + COMPLETED orders count.
  // PENDING (unpaid) and CANCELLED orders are excluded.
  const orderAgg = await prisma.order.aggregate({
    where: { userId, status: { in: ["CONFIRMED", "COMPLETED"] } },
    _count: true,
    _sum: { totalAmount: true },
  });

  return {
    success: true,
    data: toAdminUserDetailDTO(user, {
      totalOrders: orderAgg._count,
      totalSpent: orderAgg._sum.totalAmount ?? 0,
    }),
  };
}

// ---------------------------------------------------------------------------
// Update a user (admin can change phone number WITHOUT otp, per spec)
// ---------------------------------------------------------------------------
export async function adminUpdateUserAction(
  input: unknown
): Promise<ActionResult<AdminUserDetailDTO>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = adminUpdateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { userId, ...updates } = parsed.data;

  if (updates.phoneNumber) {
    const existing = await prisma.user.findUnique({
      where: { phoneNumber: updates.phoneNumber },
    });
    if (existing && existing.id !== userId) {
      return { success: false, error: "این شماره قبلاً در سیستم ثبت شده است." };
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(updates.phoneNumber !== undefined && { phoneNumber: updates.phoneNumber }),
      ...(updates.fullName !== undefined && { fullName: updates.fullName || null }),
      ...(updates.nationalCode !== undefined && {
        nationalCode: updates.nationalCode || null,
      }),
      ...(updates.email !== undefined && { email: updates.email || null }),
      ...(updates.isActive !== undefined && { isActive: updates.isActive }),
    },
  });

  const orderAgg = await prisma.order.aggregate({
    where: { userId, status: { in: ["CONFIRMED", "COMPLETED"] } },
    _count: true,
    _sum: { totalAmount: true },
  });

  return {
    success: true,
    data: toAdminUserDetailDTO(user, {
      totalOrders: orderAgg._count,
      totalSpent: orderAgg._sum.totalAmount ?? 0,
    }),
  };
}

// ---------------------------------------------------------------------------
// Toggle active/deactivated
// ---------------------------------------------------------------------------
export async function setUserActiveAction(
  userId: string,
  isActive: boolean
): Promise<ActionResult<{ isActive: boolean }>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  return { success: true, data: { isActive } };
}

// ---------------------------------------------------------------------------
// Unlock a locked account before its timer expires
// ---------------------------------------------------------------------------
export async function unlockUserAction(
  userId: string
): Promise<ActionResult<{ unlocked: true }>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.user.update({
    where: { id: userId },
    data: { lockedUntil: null, failedOtpAttempts: 0 },
  });
  await notifyAccountUnlocked(userId);
  return { success: true, data: { unlocked: true } };
}

