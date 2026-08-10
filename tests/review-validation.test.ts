import { describe, it, expect } from "vitest";
import {
  submitReviewSchema,
  submitSiteSatisfactionSchema,
  productReviewListQuerySchema,
  dismissPopupSchema,
} from "@/lib/validations/review";

describe("submitReviewSchema", () => {
  it("accepts a valid rating-only review (no text)", () => {
    const result = submitReviewSchema.safeParse({ orderId: "order-1", rating: 5 });
    expect(result.success).toBe(true);
  });

  it("accepts a valid review with text", () => {
    const result = submitReviewSchema.safeParse({
      orderId: "order-1",
      rating: 4,
      text: "کیفیت خوب بود",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a rating of 0", () => {
    const result = submitReviewSchema.safeParse({ orderId: "order-1", rating: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a rating above 5", () => {
    const result = submitReviewSchema.safeParse({ orderId: "order-1", rating: 6 });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer rating", () => {
    const result = submitReviewSchema.safeParse({ orderId: "order-1", rating: 3.5 });
    expect(result.success).toBe(false);
  });

  it("rejects a missing orderId", () => {
    const result = submitReviewSchema.safeParse({ rating: 5 });
    expect(result.success).toBe(false);
  });
});

describe("submitSiteSatisfactionSchema", () => {
  it("accepts rating only", () => {
    expect(submitSiteSatisfactionSchema.safeParse({ rating: 3 }).success).toBe(true);
  });

  it("accepts rating with text", () => {
    expect(submitSiteSatisfactionSchema.safeParse({ rating: 3, text: "خوب بود" }).success).toBe(true);
  });

  it("rejects an out-of-range rating", () => {
    expect(submitSiteSatisfactionSchema.safeParse({ rating: 10 }).success).toBe(false);
  });
});

describe("productReviewListQuerySchema", () => {
  it("defaults page and pageSize when omitted", () => {
    const result = productReviewListQuerySchema.parse({ productId: "p1" });
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("rejects a missing productId", () => {
    const result = productReviewListQuerySchema.safeParse({ page: 1 });
    expect(result.success).toBe(false);
  });
});

describe("dismissPopupSchema", () => {
  it("accepts a valid popup type", () => {
    expect(dismissPopupSchema.safeParse({ popupType: "ORDER_REVIEW_PROMPT" }).success).toBe(true);
    expect(dismissPopupSchema.safeParse({ popupType: "SITE_SATISFACTION" }).success).toBe(true);
  });

  it("rejects an invalid popup type", () => {
    expect(dismissPopupSchema.safeParse({ popupType: "SOMETHING_ELSE" }).success).toBe(false);
  });
});
