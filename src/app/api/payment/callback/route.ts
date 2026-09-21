// /**
//  * ============================================================================
//  * API ROUTE: GET /api/payment/callback?orderId=...&Authority=...&Status=...
//  * ============================================================================
//  * ZarinPal redirects the user's browser here after they pay (or cancel).
//  * This is a GET route (not a server action) because ZarinPal itself
//  * navigates the browser here — it can't call a server action.
//  *
//  * THE CRITICAL SECTION: stock is only deducted here, inside a single DB
//  * transaction with a row lock (`SELECT ... FOR UPDATE` via Prisma's
//  * `$queryRaw` inside `$transaction`) on each variant being purchased. This
//  * is what prevents two simultaneous payments from both succeeding when
//  * only one unit of stock remains — the second transaction blocks until the
//  * first commits, then sees the updated (now zero) stock and fails cleanly.
//  *
//  * EDGE CASE (flagged to you, going with a sensible default — tell me if
//  * you want it different): if ZarinPal confirms the payment succeeded but
//  * we then discover stock ran out in the meantime (someone else's order
//  * confirmed first), we mark the order CANCELLED (not PENDING) and record
//  * the payment as SUCCESS — because the money really was captured. This is
//  * a real-money edge case that needs a manual refund by admin; it's rare
//  * (requires two people racing for the literal last unit) but must fail
//  * safe rather than silently oversell. The order detail page will show
//  * this clearly so admin knows a refund is owed.
//  * ============================================================================
//  */
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { verifyZarinpalPayment } from "@/server/payment/zarinpal";
// import {
//   notifyOrderPlaced,
//   notifyPaymentSucceeded,
//   notifyPaymentFailed,
// } from "@/server/notification/events";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const orderId = searchParams.get("orderId");
//   const authority = searchParams.get("Authority");
//   const status = searchParams.get("Status"); // ZarinPal sends "OK" or "NOK"

//   const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

//   if (!orderId) {
//     return NextResponse.redirect(`${appUrl}/dashboard/orders`);
//   }

//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: { payment: true, items: true },
//   });

//   if (!order || !order.payment) {
//     return NextResponse.redirect(`${appUrl}/dashboard/orders`);
//   }

//   // Already resolved (e.g. user hit back and reloaded the callback URL) —
//   // don't re-process, just send them to the order.
//   if (order.status !== "PENDING") {
//     return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}`);
//   }

//   // User cancelled at the gateway, or ZarinPal reports failure.
//   if (status !== "OK" || !authority) {
//     await prisma.payment.update({
//       where: { id: order.payment.id },
//       data: { status: "FAILED" },
//     });
//     await notifyPaymentFailed(order.userId, order.id, order.id.slice(0, 8));
//     return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}`);
//   }

//   const verifyResult = await verifyZarinpalPayment({
//     amountToman: order.totalAmount,
//     authority,
//   });

//   if (!verifyResult.success) {
//     await prisma.payment.update({
//       where: { id: order.payment.id },
//       data: { status: "FAILED" },
//     });
//     await notifyPaymentFailed(order.userId, order.id, order.id.slice(0, 8));
//     return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}`);
//   }

//   // --- Payment verified. Now the critical section: lock + deduct stock. ---
//   try {
//     await prisma.$transaction(async (tx) => {
//       for (const item of order.items) {
//         if (!item.variantId) continue;

//         // Row-level lock: SELECT ... FOR UPDATE ensures no other
//         // transaction can read/modify this variant's stock until this
//         // transaction commits or rolls back. This is what makes the
//         // stock check + deduct pair atomic across concurrent checkouts.

//         // FOR POSTGRESQL
//         // const rows = await tx.$queryRaw<{ id: string; stock: number }[]>`
//         //   SELECT id, stock FROM "ProductVariant" WHERE id = ${item.variantId} FOR UPDATE
//         // `;

//         const rows = await tx.$queryRaw<{ id: string; stock: number }[]>`
//   SELECT id, stock FROM \`ProductVariant\` WHERE id = ${item.variantId} FOR UPDATE
// `;

//         const variant = rows[0];

//         if (!variant || variant.stock < item.quantity) {
//           throw new Error("OUT_OF_STOCK");
//         }

//         await tx.productVariant.update({
//           where: { id: item.variantId },
//           data: { stock: { decrement: item.quantity } },
//         });
//       }

//       await tx.order.update({ where: { id: order.id }, data: { status: "CONFIRMED" } });
//       await tx.payment.update({
//         where: { id: order.payment!.id },
//         data: { status: "SUCCESS", refId: verifyResult.refId },
//       });
//     });
//   } catch {
//     // Money was captured (verifyResult.success = true) but we couldn't
//     // fulfill — fail safe: mark paid, cancel the order, flag for admin's
//     // manual refund. See the doc comment above.
//     await prisma.payment.update({
//       where: { id: order.payment.id },
//       data: { status: "SUCCESS", refId: verifyResult.refId },
//     });
//     await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
//     return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}?stockIssue=1`);
//   }

//   const orderShortId = order.id.slice(0, 8);
//   await notifyPaymentSucceeded(order.userId, order.id, orderShortId);
//   await notifyOrderPlaced(order.id, orderShortId);

//   return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}?success=1`);
// }





/**
 * ============================================================================
 * API ROUTE: GET /api/payment/callback?orderId=...&Authority=...&Status=...
 * ============================================================================
 * ZarinPal redirects the user's browser here after they pay (or cancel).
 * This is a GET route (not a server action) because ZarinPal itself
 * navigates the browser here — it can't call a server action.
 *
 * THE CRITICAL SECTION: stock is only deducted here, inside a single DB
 * transaction with a row lock (`SELECT ... FOR UPDATE` via Prisma's
 * `$queryRaw` inside `$transaction`) on each variant being purchased. This
 * is what prevents two simultaneous payments from both succeeding when
 * only one unit of stock remains — the second transaction blocks until the
 * first commits, then sees the updated (now zero) stock and fails cleanly.
 *
 * EDGE CASE (flagged to you, going with a sensible default — tell me if
 * you want it different): if ZarinPal confirms the payment succeeded but
 * we then discover stock ran out in the meantime (someone else's order
 * confirmed first), we mark the order CANCELLED (not PENDING) and record
 * the payment as SUCCESS — because the money really was captured. This is
 * a real-money edge case that needs a manual refund by admin; it's rare
 * (requires two people racing for the literal last unit) but must fail
 * safe rather than silently oversell. The order detail page will show
 * this clearly so admin knows a refund is owed.
 * ============================================================================
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyZarinpalPayment } from "@/server/payment/zarinpal";
import {
  notifyOrderPlaced,
  notifyPaymentSucceeded,
  notifyPaymentFailed,
} from "@/server/notification/events";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status"); // ZarinPal sends "OK" or "NOK"

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!orderId) {
    return NextResponse.redirect(`${appUrl}/dashboard/orders`);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true, items: true },
  });

  if (!order || !order.payment) {
    return NextResponse.redirect(`${appUrl}/dashboard/orders`);
  }

  // Already resolved (e.g. user hit back and reloaded the callback URL) —
  // don't re-process, just send them to the order.
  if (order.status !== "PENDING") {
    return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}`);
  }

  // The callback must carry the Authority we issued for THIS order. Without this,
  // one real payment can be replayed against several orders of the same amount.
  if (!authority || authority !== order.payment.authority) {
    return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}`);
  }

  const paymentId = order.payment.id;
  const shortId = order.id.slice(0, 8);

  // User cancelled at the gateway.
  if (status !== "OK") {
    await prisma.payment.update({ where: { id: paymentId }, data: { status: "FAILED" } });
    notifyPaymentFailed(order.userId, order.id, shortId).catch(console.error);
    return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}`);
  }

  let verifyResult = await verifyZarinpalPayment({ amountToman: order.totalAmount, authority });
  for (let i = 0; i < 2 && !verifyResult.success && verifyResult.retryable; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    verifyResult = await verifyZarinpalPayment({ amountToman: order.totalAmount, authority });
  }

  if (!verifyResult.success) {
    if (verifyResult.retryable) {
      // Couldn't reach the gateway. We do NOT know the payment failed, so don't mark it FAILED.
      return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}?verifyIssue=1`);
    }
    await prisma.payment.update({ where: { id: paymentId }, data: { status: "FAILED" } });
    notifyPaymentFailed(order.userId, order.id, shortId).catch(console.error);
    return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}`);
  }

  const refId = verifyResult.refId; // captured here: TS loses `let` narrowing inside closures

  // --- Payment verified. Critical section: claim order + lock + deduct stock. ---
  const confirm = () =>
    prisma.$transaction(
      async (tx) => {
        // Only ONE concurrent callback can flip PENDING -> CONFIRMED; duplicates get count 0.
        const claimed = await tx.order.updateMany({
          where: { id: order.id, status: "PENDING" },
          data: { status: "CONFIRMED" },
        });
        if (claimed.count === 0) throw new Error("ALREADY_PROCESSED");

        // Always lock variants in the same order so two orders can't deadlock each other.
        const lines = order.items
          .filter((i) => i.variantId)
          .sort((a, b) => a.variantId!.localeCompare(b.variantId!));

        for (const item of lines) {
          const rows = await tx.$queryRaw<{ id: string; stock: number }[]>`
            SELECT id, stock FROM \`ProductVariant\` WHERE id = ${item.variantId} FOR UPDATE
          `;
          if (!rows[0] || rows[0].stock < item.quantity) throw new Error("OUT_OF_STOCK");

          await tx.productVariant.update({
            where: { id: item.variantId! },
            data: { stock: { decrement: item.quantity } },
          });
        }

        await tx.payment.update({ where: { id: paymentId }, data: { status: "SUCCESS", refId } });
      },
      { timeout: 20000, maxWait: 10000 } // default is 5s, too tight for a shared DB host
    );

  let failure: string | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await confirm();
      failure = null;
      break;
    } catch (err) {
      failure = err instanceof Error ? err.message : "UNKNOWN";
      if (failure === "ALREADY_PROCESSED" || failure === "OUT_OF_STOCK") break;
      console.error(`[payment/callback] attempt ${attempt} failed:`, err); // deadlock / timeout / db hiccup
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }

  if (failure === "ALREADY_PROCESSED") {
    return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}`);
  }

  if (failure === "OUT_OF_STOCK") {
    // Paid, but can't fulfil: record the money, cancel the order, admin refunds manually.
    await prisma.payment.update({ where: { id: paymentId }, data: { status: "SUCCESS", refId } });
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}?stockIssue=1`);
  }

  if (failure) {
    // Infra error, NOT a stock problem. Money is captured and the tx rolled back, so the order
    // is still PENDING. Record the payment; reloading this callback URL retries (verify => 101).
    await prisma.payment
      .update({ where: { id: paymentId }, data: { status: "SUCCESS", refId } })
      .catch(console.error);
    return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}?verifyIssue=1`);
  }

  // Don't let a push/SMS failure turn a successful payment into a 500 page.
  void Promise.allSettled([
    notifyPaymentSucceeded(order.userId, order.id, shortId),
    notifyOrderPlaced(order.id, shortId),
  ]);

  return NextResponse.redirect(`${appUrl}/dashboard/orders/${order.id}?success=1`);
}