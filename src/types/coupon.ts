export type CouponType = "PERCENT" | "FIXED";
export type CouponScope = "ENTIRE_CART" | "SPECIFIC_PRODUCTS" | "SPECIFIC_CATEGORIES";

/** Row shape for the admin coupon list/detail. */
export type CouponDTO = {
  id: string;
  code: string;
  type: CouponType;
  value: number; // percent (1-100) or Toman amount, depending on `type`
  maxDiscountAmount: number | null; // only meaningful when type = PERCENT
  scope: CouponScope;
  productIds: string[]; // populated when scope = SPECIFIC_PRODUCTS
  categoryIds: string[]; // populated when scope = SPECIFIC_CATEGORIES
  minOrderAmount: number | null;
  maxUsesPerUser: number;
  maxTotalUsage: number | null;
  assignedUserId: string | null;
  assignedUserPhone: string | null; // for display in the admin list
  totalUsageCount: number; // computed: count of CouponUsage rows
  expiresAt: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Shape sent by the admin coupon form. See src/lib/validations/coupon.ts
 *  for the exact Zod schema (includes cross-field rules, e.g. scope
 *  determines whether productIds/categoryIds are required). */
export type CouponFormInput = {
  code: string; // if blank, server auto-generates one
  type: CouponType;
  value: number;
  maxDiscountAmount?: number | null;
  scope: CouponScope;
  productIds: string[];
  categoryIds: string[];
  minOrderAmount?: number | null;
  maxUsesPerUser: number;
  maxTotalUsage?: number | null;
  assignedUserId?: string | null;
  expiresAt: string; // ISO datetime string
};

/** Result of validating+pricing a coupon against a specific cart, used at
 *  checkout time. `discountAmount` is what actually gets subtracted. */
export type CouponPreviewDTO =
  | {
      valid: true;
      couponId: string;
      code: string;
      discountAmount: number; // Toman
    }
  | {
      valid: false;
      error: string;
    };
