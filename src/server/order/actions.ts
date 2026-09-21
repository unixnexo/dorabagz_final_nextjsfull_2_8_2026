"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity, getSession } from "@/server/auth/session";
import { requestZarinpalPayment } from "@/server/payment/zarinpal";
import { notifyOrderStatusChanged, notifyPleaseReviewOrder } from "@/server/notification/events";
import { toOrderListItemDTO, toOrderDetailDTO, fullOrderInclude } from "./order-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { OrderListItemDTO, OrderDetailDTO } from "@/types/order";
import type { PaginatedResult } from "@/types/user";

// ---------------------------------------------------------------------------
// User: paginated + searchable list of their own orders.
// Search matches order id (short id search) — status filter is separate.
// ---------------------------------------------------------------------------
export async function listMyOrdersAction(input: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}): Promise<ActionResult<PaginatedResult<OrderListItemDTO>>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  const where = {
    userId: identity.userId,
    ...(input.status ? { status: input.status } : {}),
    ...(input.search ? { id: { contains: input.search } } : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      include: fullOrderInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toOrderListItemDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Get one order's detail — scoped so a user can only see their own order
// (admin uses a separate action below that skips this check).
// ---------------------------------------------------------------------------
export async function getMyOrderAction(orderId: string): Promise<ActionResult<OrderDetailDTO>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: identity.userId },
    include: fullOrderInclude,
  });
  if (!order) return { success: false, error: "سفارش یافت نشد." };

  return { success: true, data: toOrderDetailDTO(order) };
}

// ---------------------------------------------------------------------------
// Retry payment for a PENDING order whose payment FAILED (or never
// completed) — per your spec: "users should be able to repay in the
// orders page." Reuses the same order (new Authority on the same Payment row).
// ---------------------------------------------------------------------------
export async function repayOrderAction(
  orderId: string
): Promise<ActionResult<{ paymentUrl: string }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: identity.userId },
    include: { payment: true },
  });
  if (!order) return { success: false, error: "سفارش یافت نشد." };

  // if (order.status !== "PENDING") {
  //   return { success: false, error: "این سفارش قابل پرداخت مجدد نیست." };
  // }

  if (order.payment?.status === "SUCCESS") {
    return { success: false, error: "پرداخت این سفارش انجام شده و در حال بررسی است." };
  }

  const paymentResult = await requestZarinpalPayment({
    amountToman: order.totalAmount,
    description: `پرداخت سفارش ${order.id}`,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/payment/callback?orderId=${order.id}`,
  });

  if (!paymentResult.success) {
    return { success: false, error: paymentResult.error };
  }

  await prisma.payment.upsert({
    where: { orderId: order.id },
    update: { status: "PENDING", authority: paymentResult.authority, refId: null },
    create: {
      orderId: order.id,
      status: "PENDING",
      amount: order.totalAmount,
      authority: paymentResult.authority,
    },
  });

  return { success: true, data: { paymentUrl: paymentResult.paymentUrl } };
}

// ---------------------------------------------------------------------------
// Cancel a PENDING order — per your spec: users can cancel only if payment
// hasn't succeeded yet. Once CONFIRMED, only admin can cancel (see below).
// ---------------------------------------------------------------------------
export async function cancelMyOrderAction(orderId: string): Promise<ActionResult<{ cancelled: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const res = await prisma.order.updateMany({
    where: { id: orderId, userId: identity.userId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
  if (res.count === 0) return { success: false, error: "این سفارش قابل لغو نیست." };
  await prisma.couponUsage.deleteMany({ where: { orderId } }); // give the coupon back
  return { success: true, data: { cancelled: true } };

  // const order = await prisma.order.findFirst({ where: { id: orderId, userId: identity.userId } });
  // if (!order) return { success: false, error: "سفارش یافت نشد." };
  // if (order.status !== "PENDING") {
  //   return { success: false, error: "این سفارش قابل لغو نیست." };
  // }

  // await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
  // return { success: true, data: { cancelled: true } };
}

// ---------------------------------------------------------------------------
// Admin: paginated + searchable + filterable list of ALL orders.
// ---------------------------------------------------------------------------
export async function adminListOrdersAction(input: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}): Promise<ActionResult<PaginatedResult<OrderListItemDTO>>> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { success: false, error: "دسترسی غیرمجاز." };

  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  const where = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.search
      ? {
        OR: [
          { id: { contains: input.search } },
          { receiverFullName: { contains: input.search } },
          { receiverPhone: { contains: input.search } },
        ],
      }
      : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      include: fullOrderInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toOrderListItemDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Admin: get any order's detail.
// ---------------------------------------------------------------------------
export async function adminGetOrderAction(orderId: string): Promise<ActionResult<OrderDetailDTO>> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { success: false, error: "دسترسی غیرمجاز." };

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: fullOrderInclude });
  if (!order) return { success: false, error: "سفارش یافت نشد." };

  return { success: true, data: toOrderDetailDTO(order) };
}

// ---------------------------------------------------------------------------
// Admin: change order status. CONFIRMED -> COMPLETED (shipped/delivered)
// is the normal happy path. CONFIRMED -> CANCELLED is the admin-only
// cancellation your spec calls for (stock is NOT auto-restored here —
// that's a manual inventory decision for admin, since a cancellation this
// late usually means a refund conversation too).
// ---------------------------------------------------------------------------
// export async function adminUpdateOrderStatusAction(
//   orderId: string,
//   status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
// ): Promise<ActionResult<{ status: string }>> {
//   const session = await getSession();
//   if (!session || session.role !== "ADMIN") return { success: false, error: "دسترسی غیرمجاز." };

//   const order = await prisma.order.update({ where: { id: orderId }, data: { status } });

//   // Notify the customer for any status change that's actually meaningful
//   // to them — not PENDING (that's the starting state, nothing "changed"
//   // from their perspective yet).
//   if (status === "CONFIRMED" || status === "COMPLETED" || status === "CANCELLED") {
//     await notifyOrderStatusChanged(order.userId, order.id, order.id.slice(0, 8), status);
//   }

//   // Per your spec: nudge the buyer to review once the order is delivered.
//   if (status === "COMPLETED") {
//     await notifyPleaseReviewOrder(order.userId, order.id);
//   }

//   return { success: true, data: { status } };
// }


const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function adminUpdateOrderStatusAction(
  orderId: string,
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
): Promise<ActionResult<{ status: string }>> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { success: false, error: "دسترسی غیرمجاز." };

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return { success: false, error: "سفارش یافت نشد." };
  if (!ALLOWED_TRANSITIONS[order.status].includes(status)) {
    return { success: false, error: "این تغییر وضعیت مجاز نیست." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const flipped = await tx.order.updateMany({
        where: { id: order.id, status: order.status },
        data: { status },
      });
      if (flipped.count === 0) throw new Error("STALE");

      if (status === "CANCELLED") {
        if (order.status === "CONFIRMED") {
          // stock was deducted when payment succeeded, so give it back
          for (const item of order.items) {
            if (!item.variantId) continue;
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
        await tx.couponUsage.deleteMany({ where: { orderId: order.id } }); // free the coupon
      }
    });
  } catch (err) {
    if (err instanceof Error && err.message === "STALE") {
      return { success: false, error: "وضعیت سفارش تغییر کرده است. صفحه را رفرش کنید." };
    }
    throw err;
  }

  if (status === "COMPLETED" || status === "CANCELLED") {
    notifyOrderStatusChanged(order.userId, order.id, order.id.slice(0, 8), status).catch(console.error);
  }
  if (status === "COMPLETED") notifyPleaseReviewOrder(order.userId, order.id).catch(console.error);

  return { success: true, data: { status } };
}
