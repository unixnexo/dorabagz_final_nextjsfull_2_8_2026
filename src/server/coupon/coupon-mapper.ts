import type { Coupon, CouponProduct, CouponCategory, CouponUsage, User } from "@prisma/client";
import type { CouponDTO } from "@/types/coupon";

type FullCoupon = Coupon & {
  products: CouponProduct[];
  categories: CouponCategory[];
  usages: CouponUsage[];
  assignedUser: User | null;
};

export function toCouponDTO(coupon: FullCoupon): CouponDTO {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    maxDiscountAmount: coupon.maxDiscountAmount,
    scope: coupon.scope,
    productIds: coupon.products.map((p) => p.productId),
    categoryIds: coupon.categories.map((c) => c.categoryId),
    minOrderAmount: coupon.minOrderAmount,
    maxUsesPerUser: coupon.maxUsesPerUser,
    maxTotalUsage: coupon.maxTotalUsage,
    assignedUserId: coupon.assignedUserId,
    assignedUserPhone: coupon.assignedUser?.phoneNumber ?? null,
    totalUsageCount: coupon.usages.length,
    expiresAt: coupon.expiresAt.toISOString(),
    isDeleted: coupon.isDeleted,
    createdAt: coupon.createdAt.toISOString(),
    updatedAt: coupon.updatedAt.toISOString(),
  };
}

/** Standard include clause for fetching a coupon with everything the
 *  mapper + pricing logic need. */
export const fullCouponInclude = {
  products: true,
  categories: true,
  usages: true,
  assignedUser: true,
} as const;
