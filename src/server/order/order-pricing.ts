// import "server-only";

/**
 * Pure helper: given cart lines (already fetched from DB) and an optional
 * coupon discount, computes the order's subtotal/discount/total. Separated
 * from DB access for the same testability reason as coupon-pricing.ts.
 */
export type OrderLineInput = {
  unitPrice: number;
  quantity: number;
};

export function computeOrderTotals(lines: OrderLineInput[], discountAmount: number) {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const clampedDiscount = Math.max(0, Math.min(discountAmount, subtotal));
  const totalAmount = subtotal - clampedDiscount;
  return { subtotal, discountAmount: clampedDiscount, totalAmount };
}
