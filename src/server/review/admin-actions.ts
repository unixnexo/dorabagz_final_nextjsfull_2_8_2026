"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/session";
import { toPendingReviewDTO } from "./review-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { PendingReviewDTO } from "@/types/review";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session && session.role === "ADMIN";
}

// ---------------------------------------------------------------------------
// List all PENDING reviews (has text, awaiting approval).
// ---------------------------------------------------------------------------
export async function listPendingReviewsAction(): Promise<ActionResult<PendingReviewDTO[]>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  const reviews = await prisma.productReview.findMany({
    where: { status: "PENDING" },
    include: {
      user: { select: { phoneNumber: true } },
      order: { include: { items: { select: { productTitle: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  return { success: true, data: reviews.map(toPendingReviewDTO) };
}

// ---------------------------------------------------------------------------
// Approve: makes the review publicly visible.
// ---------------------------------------------------------------------------
export async function approveReviewAction(reviewId: string): Promise<ActionResult<{ approved: true }>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.productReview.update({ where: { id: reviewId }, data: { status: "APPROVED" } });
  return { success: true, data: { approved: true } };
}

// ---------------------------------------------------------------------------
// Reject: DELETES the review outright, per your spec — the user is never
// told, no trace is kept.
// ---------------------------------------------------------------------------
export async function rejectReviewAction(reviewId: string): Promise<ActionResult<{ rejected: true }>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.productReview.delete({ where: { id: reviewId } });
  return { success: true, data: { rejected: true } };
}
