import "server-only";
import { prisma } from "@/lib/prisma";
import { getCategoryIdsIncludingChildren } from "@/server/category/category-tree";
import { computeVariantDiscount, type DiscountGroupForPricing } from "@/lib/discount-pricing";
import type { VariantPriceInfo } from "@/types/discount";

/**
 * Fetches every non-deleted discount group and expands each group's
 * linked categories to include their children (same "belongs to parent
 * too" rule used everywhere else — Module 2's category browsing, Module 4's
 * coupon scoping). Returns data shaped for computeVariantDiscount().
 *
 * Called once per request (product list/detail), not once per variant —
 * the pure pricing function then runs cheaply in memory for every variant.
 */
export async function getActiveDiscountGroupsForPricing(): Promise<DiscountGroupForPricing[]> {
  const groups = await prisma.discountGroup.findMany({
    where: { isDeleted: false },
    include: { products: true, categories: true },
  });

  const result: DiscountGroupForPricing[] = [];
  for (const group of groups) {
    const expandedCategoryIds = new Set<string>();
    for (const gc of group.categories) {
      const ids = await getCategoryIdsIncludingChildren(gc.categoryId);
      ids.forEach((id) => expandedCategoryIds.add(id));
    }

    result.push({
      id: group.id,
      type: group.type,
      value: group.value,
      startAt: group.startAt,
      endAt: group.endAt,
      isDeleted: group.isDeleted,
      productIds: group.products.map((p) => p.productId),
      categoryIds: Array.from(expandedCategoryIds),
    });
  }

  return result;
}

/** Convenience wrapper: given the pre-fetched groups + one variant's raw
 *  price/product/category, returns the price info shape ready for a DTO. */
export function applyDiscountToVariant(
  groups: DiscountGroupForPricing[],
  variant: { price: number; productId: string; categoryId: string | null }
): VariantPriceInfo {
  const result = computeVariantDiscount(groups, variant);
  return {
    originalPrice: result.originalPrice,
    discountedPrice: result.discountedPrice,
    hasDiscount: result.hasDiscount,
  };
}
