import "server-only";
import { prisma } from "@/lib/prisma";
import type { AdminDashboardOverviewDTO } from "@/types/dashboard";

/**
 * All eight counts run in parallel. Each is intentionally a simple,
 * direct query — this page is a system-state snapshot (a glance, click-
 * through), not a computed report, so there's no need to reuse the
 * heavier coupon/discount pricing engines built for actual checkout math.
 */
export async function getAdminDashboardOverview(): Promise<AdminDashboardOverviewDTO> {
  const now = new Date();

  const [
    pendingOrders,
    totalUsers,
    pendingReviews,
    totalCategories,
    totalProducts,
    totalStories,
    activeCoupons,
    discountedProductIds,
  ] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),

    prisma.user.count(),

    prisma.productReview.count({ where: { status: "PENDING" } }),

    prisma.category.count({ where: { isDeleted: false } }),

    prisma.product.count({ where: { isDeleted: false } }),

    // Per your spec this is just "how many stories you got" — counts all
    // non-deleted stories, active or already expired. If you'd rather
    // this only count currently-active ones, add
    // `expiresAt: { gt: now }` to the where clause below.
    prisma.story.count({ where: { isDeleted: false } }),

    // "Active" = not deleted, coupon has actually STARTED (startAt is
    // null or already in the past), and hasn't EXPIRED yet. Every coupon
    // has a required expiresAt (see schema), so that check is unconditional.
    // Does NOT check usage limits (maxTotalUsage) — that's a per-
    // redemption concern, not a simple on/off state.
    // prisma.coupon.count({
    //   where: {
    //     isDeleted: false,
    //     expiresAt: { gt: now },
    //     OR: [{ startAt: null }, { startAt: { lte: now } }],
    //   },
    // }),
    prisma.coupon.count({
      where: {
        isDeleted: false,
        expiresAt: { gt: now },
      },
    }),

    // Distinct products currently covered by at least one active discount
    // group (not deleted, within its optional date window). Category-
    // linked groups count every product under that category (children
    // included, same rule as everywhere else) — resolved by walking each
    // active group's direct + category-derived product set and unioning
    // into a single Set of product IDs.
    getDiscountedProductIds(now),
  ]);

  return {
    pendingOrders,
    totalUsers,
    pendingReviews,
    totalCategories,
    totalProducts,
    totalStories,
    activeCoupons,
    discountedProducts: discountedProductIds.size,
  };
}

async function getDiscountedProductIds(now: Date): Promise<Set<string>> {
  const activeGroups = await prisma.discountGroup.findMany({
    where: {
      isDeleted: false,
      OR: [{ startAt: null }, { startAt: { lte: now } }],
      AND: [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }],
    },
    include: {
      products: { select: { productId: true } },
      categories: { select: { categoryId: true } },
    },
  });

  const productIds = new Set<string>();

  for (const group of activeGroups) {
    for (const gp of group.products) {
      productIds.add(gp.productId);
    }
  }

  // Expand category-linked groups to every product under that category
  // (including children — Category has at most 2 levels, so this is a
  // single extra query per linked category, not recursive).
  const categoryIds = activeGroups.flatMap((g) => g.categories.map((c) => c.categoryId));
  if (categoryIds.length > 0) {
    const childCategories = await prisma.category.findMany({
      where: { parentId: { in: categoryIds } },
      select: { id: true },
    });
    const allCategoryIds = [...categoryIds, ...childCategories.map((c) => c.id)];

    const productsInCategories = await prisma.product.findMany({
      where: { categoryId: { in: allCategoryIds }, isDeleted: false },
      select: { id: true },
    });
    for (const p of productsInCategories) {
      productIds.add(p.id);
    }
  }

  return productIds;
}
