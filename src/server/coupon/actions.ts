"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/session";
import {
  couponFormSchema,
  updateCouponSchema,
  couponListQuerySchema,
} from "@/lib/validations/coupon";
import { generateCouponCode } from "@/lib/coupon-code";
import { toCouponDTO, fullCouponInclude } from "./coupon-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { CouponDTO } from "@/types/coupon";
import type { PaginatedResult } from "@/types/user";

async function requireAdmin(): Promise<{ userId: string } | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return { userId: session.userId };
}

// ---------------------------------------------------------------------------
// List (paginated, searchable by code)
// ---------------------------------------------------------------------------
export async function listCouponsAction(
  input: unknown
): Promise<ActionResult<PaginatedResult<CouponDTO>>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = couponListQuerySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { page, pageSize, search } = parsed.data;

  const where = {
    isDeleted: false,
    ...(search ? { code: { contains: search.toUpperCase() } } : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.coupon.findMany({
      where,
      include: fullCouponInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.coupon.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toCouponDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Get one (for the admin edit form)
// ---------------------------------------------------------------------------
export async function getCouponAction(id: string): Promise<ActionResult<CouponDTO>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const coupon = await prisma.coupon.findUnique({ where: { id }, include: fullCouponInclude });
  if (!coupon) return { success: false, error: "کد تخفیف یافت نشد." };
  return { success: true, data: toCouponDTO(coupon) };
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------
export async function createCouponAction(input: unknown): Promise<ActionResult<CouponDTO>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = couponFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const code = data.code?.trim() ? data.code.trim().toUpperCase() : generateCouponCode();

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) return { success: false, error: "این کد تخفیف قبلاً استفاده شده است." };

  const coupon = await prisma.coupon.create({
    data: {
      code,
      type: data.type,
      value: data.value,
      maxDiscountAmount: data.type === "PERCENT" ? data.maxDiscountAmount ?? null : null,
      scope: data.scope,
      minOrderAmount: data.minOrderAmount ?? null,
      maxUsesPerUser: data.maxUsesPerUser,
      maxTotalUsage: data.maxTotalUsage ?? null,
      assignedUserId: data.assignedUserId || null,
      expiresAt: new Date(data.expiresAt),
      products:
        data.scope === "SPECIFIC_PRODUCTS"
          ? { create: data.productIds.map((productId) => ({ productId })) }
          : undefined,
      categories:
        data.scope === "SPECIFIC_CATEGORIES"
          ? { create: data.categoryIds.map((categoryId) => ({ categoryId })) }
          : undefined,
    },
    include: fullCouponInclude,
  });

  return { success: true, data: toCouponDTO(coupon) };
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------
export async function updateCouponAction(input: unknown): Promise<ActionResult<CouponDTO>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = updateCouponSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  if (data.code?.trim()) {
    const newCode = data.code.trim().toUpperCase();
    const existing = await prisma.coupon.findUnique({ where: { code: newCode } });
    if (existing && existing.id !== data.id) {
      return { success: false, error: "این کد تخفیف قبلاً استفاده شده است." };
    }
  }

  // Replace scoping join rows wholesale — same "delete then recreate"
  // approach used for product options/variants in Module 2, for the same
  // reason: simple, correct, and coupons aren't edited often enough for
  // this to matter performance-wise.
  await prisma.couponProduct.deleteMany({ where: { couponId: data.id } });
  await prisma.couponCategory.deleteMany({ where: { couponId: data.id } });

  const coupon = await prisma.coupon.update({
    where: { id: data.id },
    data: {
      ...(data.code?.trim() ? { code: data.code.trim().toUpperCase() } : {}),
      type: data.type,
      value: data.value,
      maxDiscountAmount: data.type === "PERCENT" ? data.maxDiscountAmount ?? null : null,
      scope: data.scope,
      minOrderAmount: data.minOrderAmount ?? null,
      maxUsesPerUser: data.maxUsesPerUser,
      maxTotalUsage: data.maxTotalUsage ?? null,
      assignedUserId: data.assignedUserId || null,
      expiresAt: new Date(data.expiresAt),
      products:
        data.scope === "SPECIFIC_PRODUCTS"
          ? { create: data.productIds.map((productId) => ({ productId })) }
          : undefined,
      categories:
        data.scope === "SPECIFIC_CATEGORIES"
          ? { create: data.categoryIds.map((categoryId) => ({ categoryId })) }
          : undefined,
    },
    include: fullCouponInclude,
  });

  return { success: true, data: toCouponDTO(coupon) };
}

// ---------------------------------------------------------------------------
// Soft delete
// ---------------------------------------------------------------------------
export async function deleteCouponAction(id: string): Promise<ActionResult<{ deleted: true }>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.coupon.update({ where: { id }, data: { isDeleted: true } });
  return { success: true, data: { deleted: true } };
}
