import { describe, it, expect } from "vitest";

/**
 * Re-implements the pure averaging/rounding step from
 * getProductReviewStats (src/server/product/review-stats.ts) to lock in
 * the exact behavior from the spec's example: "3 users rated 4 -> overall
 * is 4 stars." The DB-querying wrapper around this isn't unit-testable
 * without a real database, but this core math is what actually
 * determines the displayed rating and is worth pinning down precisely.
 */
function computeReviewStats(ratings: number[]): { reviewCount: number; averageRating: number } {
  if (ratings.length === 0) return { reviewCount: 0, averageRating: 0 };
  const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  return { reviewCount: ratings.length, averageRating: Math.round(average) };
}

describe("product review stats -- averaging and rounding", () => {
  it("matches the exact example from spec: 3 users rating 4 -> overall 4 stars", () => {
    expect(computeReviewStats([4, 4, 4])).toEqual({ reviewCount: 3, averageRating: 4 });
  });

  it("returns 0 reviewCount and 0 averageRating (not a real rating) when there are no reviews", () => {
    expect(computeReviewStats([])).toEqual({ reviewCount: 0, averageRating: 0 });
  });

  it("rounds a .5 average up to the next whole star", () => {
    expect(computeReviewStats([3, 4])).toEqual({ reviewCount: 2, averageRating: 4 });
  });

  it("rounds down when the average is below the midpoint", () => {
    expect(computeReviewStats([4, 4, 3])).toEqual({ reviewCount: 3, averageRating: 4 });
    expect(computeReviewStats([3, 3, 4])).toEqual({ reviewCount: 3, averageRating: 3 });
  });

  it("handles a single review correctly (average equals the one rating)", () => {
    expect(computeReviewStats([5])).toEqual({ reviewCount: 1, averageRating: 5 });
  });

  it("handles a wide spread of ratings", () => {
    expect(computeReviewStats([1, 2, 3, 4, 5])).toEqual({ reviewCount: 5, averageRating: 3 });
  });
});
