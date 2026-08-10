"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { submitReviewSchema, productReviewListQuerySchema } from "@/lib/validations/review";
import { toProductReviewDTO } from "./review-mapper";
import { notifyReviewPendingApproval } from "@/server/notification/events";
import type { ActionResult } from "@/server/auth/actions";
import type { ProductReviewDTO, ReviewableOrderDTO } from "@/types/review";
import type { PaginatedResult } from "@/types/user";

// ---------------------------------------------------------------------------
// Submit a review for a COMPLETED order the user owns. One review per
// order (per your spec), locked once submitted — no edit/delete action
// exists anywhere in this module, on purpose.
//
// Approval logic: a review with NO text is auto-approved immediately
// (nothing risky to moderate). A review WITH text starts PENDING and
// alerts admin — if admin approves, it becomes visible; if admin
// rejects, the row is deleted outright and the user is never told
// (per your spec: "delete the review and dont tell anyone about it").
// ---------------------------------------------------------------------------
export async function submitReviewAction(input: unknown): Promise<ActionResult<{ submitted: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = submitReviewSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const order = await prisma.order.findFirst({
    where: { id: parsed.data.orderId, userId: identity.userId },
  });
  if (!order) return { success: false, error: "سفارش یافت نشد." };
  if (order.status !== "COMPLETED") {
    return { success: false, error: "فقط سفارش‌های تکمیل‌شده قابل نظر دادن هستند." };
  }

  const existing = await prisma.productReview.findUnique({ where: { orderId: order.id } });
  if (existing) {
    return { success: false, error: "شما قبلاً برای این سفارش نظر ثبت کرده‌اید." };
  }

  const hasText = !!parsed.data.text?.trim();

  await prisma.productReview.create({
    data: {
      orderId: order.id,
      userId: identity.userId,
      rating: parsed.data.rating,
      text: parsed.data.text?.trim() || null,
      status: hasText ? "PENDING" : "APPROVED", // text-less reviews skip moderation entirely
    },
  });

  if (hasText) {
    await notifyReviewPendingApproval();
  }

  return { success: true, data: { submitted: true } };
}

// ---------------------------------------------------------------------------
// Public: paginated APPROVED reviews for a specific product, for the
// product detail page. A review shows up here if ANY item in its order
// was this product (an order can contain multiple products; the same
// review can appear under each of them).
// ---------------------------------------------------------------------------
export async function getProductReviewsAction(
  input: unknown
): Promise<ActionResult<PaginatedResult<ProductReviewDTO>>> {
  const parsed = productReviewListQuerySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { productId, page, pageSize } = parsed.data;

  const where = {
    status: "APPROVED" as const,
    order: { items: { some: { variant: { productId } } } },
  };

  const [items, totalItems] = await Promise.all([
    prisma.productReview.findMany({
      where,
      include: { user: { select: { phoneNumber: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.productReview.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toProductReviewDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Checks whether the current user has any COMPLETED orders that don't
// have a review yet — used to decide whether to show a "please review"
// prompt anywhere in the UI (e.g. randomly on the home page, per your spec).
// ---------------------------------------------------------------------------
export async function getReviewableOrdersAction(): Promise<ActionResult<ReviewableOrderDTO[]>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: true, data: [] }; // logged out = nothing to prompt

  // Once dismissed, per your spec, never show the review prompt to this
  // user again — regardless of how many more orders they complete.
  const dismissal = await prisma.popupDismissal.findUnique({
    where: { userId_popupType: { userId: identity.userId, popupType: "ORDER_REVIEW_PROMPT" } },
  });
  if (dismissal) return { success: true, data: [] };

  const orders = await prisma.order.findMany({
    where: { userId: identity.userId, status: "COMPLETED", review: null },
    include: { items: true },
    orderBy: { updatedAt: "desc" },
  });

  return {
    success: true,
    data: orders.map((o) => ({
      orderId: o.id,
      productTitles: o.items.map((i) => i.productTitle),
      completedAt: o.updatedAt.toISOString(),
    })),
  };
}
