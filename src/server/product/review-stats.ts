import "server-only";
import { prisma } from "@/lib/prisma";
import type { ProductReviewStatsMap } from "./product-mapper";

/**
 * Computes { reviewCount, averageRating } for every product in `productIds`
 * in ONE query (not one query per product — avoids an N+1 on the product
 * grid), counting only APPROVED reviews, per your spec's example ("3 users
 * rated 4 -> overall is 4 stars").
 *
 * A review is tied to a whole ORDER (Module 7's design — one review per
 * order, not per product), and an order can contain multiple products, so
 * a single review counts toward EVERY product that was in that order —
 * same relationship `getProductReviewsAction` already uses for a single
 * product; this just batches it across many at once.
 *
 * averageRating is rounded to the nearest whole star (Math.round), and is
 * 0 when there are no reviews yet — 0 means "no reviews," not "0 stars."
 */
export async function getProductReviewStats(productIds: string[]): Promise<ProductReviewStatsMap> {
  const result: ProductReviewStatsMap = new Map();
  if (productIds.length === 0) return result;

  const reviews = await prisma.productReview.findMany({
    where: {
      status: "APPROVED",
      order: { items: { some: { variant: { productId: { in: productIds } } } } },
    },
    include: {
      order: { include: { items: { select: { variant: { select: { productId: true } } } } } },
    },
  });

  // Bucket each review's rating under every product its order touched
  // (intersected with the productIds we were actually asked about).
  const ratingsByProduct = new Map<string, number[]>();
  for (const review of reviews) {
    const touchedProductIds = new Set(
      review.order.items.map((item) => item.variant?.productId).filter((id): id is string => !!id)
    );
    for (const productId of touchedProductIds) {
      if (!productIds.includes(productId)) continue;
      const ratings = ratingsByProduct.get(productId) ?? [];
      ratings.push(review.rating);
      ratingsByProduct.set(productId, ratings);
    }
  }

  for (const productId of productIds) {
    const ratings = ratingsByProduct.get(productId);
    if (!ratings || ratings.length === 0) {
      result.set(productId, { reviewCount: 0, averageRating: 0 });
      continue;
    }
    const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    result.set(productId, { reviewCount: ratings.length, averageRating: Math.round(average) });
  }

  return result;
}
