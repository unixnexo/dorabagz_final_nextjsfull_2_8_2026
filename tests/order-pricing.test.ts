import { describe, it, expect } from "vitest";
import { computeOrderTotals } from "@/server/order/order-pricing";

describe("computeOrderTotals", () => {
  it("computes subtotal and total with no discount", () => {
    const result = computeOrderTotals([{ unitPrice: 100000, quantity: 2 }], 0);
    expect(result).toEqual({ subtotal: 200000, discountAmount: 0, totalAmount: 200000 });
  });

  it("subtracts a valid discount from the subtotal", () => {
    const result = computeOrderTotals([{ unitPrice: 100000, quantity: 2 }], 50000);
    expect(result).toEqual({ subtotal: 200000, discountAmount: 50000, totalAmount: 150000 });
  });

  it("sums multiple line items correctly", () => {
    const result = computeOrderTotals(
      [
        { unitPrice: 50000, quantity: 1 },
        { unitPrice: 30000, quantity: 3 },
      ],
      0
    );
    expect(result.subtotal).toBe(140000);
  });

  it("clamps a discount larger than the subtotal so total never goes negative", () => {
    const result = computeOrderTotals([{ unitPrice: 10000, quantity: 1 }], 999999);
    expect(result).toEqual({ subtotal: 10000, discountAmount: 10000, totalAmount: 0 });
  });

  it("clamps a negative discount to zero", () => {
    const result = computeOrderTotals([{ unitPrice: 10000, quantity: 1 }], -500);
    expect(result.discountAmount).toBe(0);
    expect(result.totalAmount).toBe(10000);
  });
});
