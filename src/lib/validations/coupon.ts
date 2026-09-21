import { z } from "zod";

export const couponFormSchema = z
  .object({
    code: z.string().max(30).optional(), // blank = server auto-generates
    type: z.enum(["PERCENT", "FIXED"]),
    value: z.number().int().min(1, "مقدار باید حداقل ۱ باشد"),
    maxDiscountAmount: z.number().int().min(0).nullable().optional(),
    scope: z.enum(["ENTIRE_CART", "SPECIFIC_PRODUCTS", "SPECIFIC_CATEGORIES"]),
    productIds: z.array(z.string()).default([]),
    categoryIds: z.array(z.string()).default([]),
    minOrderAmount: z.number().int().min(0).nullable().optional(),
    maxUsesPerUser: z.number().int().min(1).default(1),
    maxTotalUsage: z.number().int().min(1).nullable().optional(),
    assignedUserId: z.string().nullable().optional(),
    expiresAt: z.string().min(1, "تاریخ انقضا الزامی است"),
  })
  .refine((data) => data.type !== "PERCENT" || (data.value >= 1 && data.value <= 100), {
    message: "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد",
    path: ["value"],
  })
  .refine((data) => data.scope !== "SPECIFIC_PRODUCTS" || data.productIds.length > 0, {
    message: "حداقل یک محصول را انتخاب کنید",
    path: ["productIds"],
  })
  .refine((data) => data.scope !== "SPECIFIC_CATEGORIES" || data.categoryIds.length > 0, {
    message: "حداقل یک دسته‌بندی را انتخاب کنید",
    path: ["categoryIds"],
  })
  .refine((data) => new Date(data.expiresAt).getTime() > Date.now(), {
    message: "تاریخ انقضا باید در آینده باشد",
    path: ["expiresAt"],
  });
export type CouponFormInput = z.infer<typeof couponFormSchema>;

export const updateCouponSchema = z.object({
  id: z.string().min(1),
  code: z.string().max(30).optional(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().int().min(1),
  maxDiscountAmount: z.number().int().min(0).nullable().optional(),
  scope: z.enum(["ENTIRE_CART", "SPECIFIC_PRODUCTS", "SPECIFIC_CATEGORIES"]),
  productIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  minOrderAmount: z.number().int().min(0).nullable().optional(),
  maxUsesPerUser: z.number().int().min(1).default(1),
  maxTotalUsage: z.number().int().min(1).nullable().optional(),
  assignedUserId: z.string().nullable().optional(),
  expiresAt: z.string().min(1),
})
  .refine((d) => d.type !== "PERCENT" || d.value <= 100, {
    message: "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد",
    path: ["value"],
  });
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;

export const couponListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(), // matches coupon code
});
export type CouponListQuery = z.infer<typeof couponListQuerySchema>;

export const applyCouponSchema = z.object({
  code: z.string().min(1, "کد تخفیف را وارد کنید"),
});
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
