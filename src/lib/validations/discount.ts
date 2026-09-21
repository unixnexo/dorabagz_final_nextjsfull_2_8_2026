import { z } from "zod";

export const discountGroupFormSchema = z
  .object({
    title: z.string().min(1, "عنوان الزامی است").max(100),
    type: z.enum(["PERCENT", "FIXED"]),
    value: z.number().int().min(1, "مقدار باید حداقل ۱ باشد"),
    startAt: z.string().nullable().optional(),
    endAt: z.string().nullable().optional(),
    productIds: z.array(z.string()).default([]),
    categoryIds: z.array(z.string()).default([]),
  })
  .refine((data) => data.type !== "PERCENT" || (data.value >= 1 && data.value <= 100), {
    message: "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد",
    path: ["value"],
  })
  .refine((data) => data.productIds.length > 0 || data.categoryIds.length > 0, {
    message: "حداقل یک محصول یا دسته‌بندی را انتخاب کنید",
    path: ["productIds"],
  })
  .refine(
    (data) =>
      !data.startAt || !data.endAt || new Date(data.startAt).getTime() < new Date(data.endAt).getTime(),
    { message: "تاریخ شروع باید قبل از تاریخ پایان باشد", path: ["endAt"] }
  );
export type DiscountGroupFormInput = z.infer<typeof discountGroupFormSchema>;

export const updateDiscountGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().int().min(1),
  startAt: z.string().nullable().optional(),
  endAt: z.string().nullable().optional(),
  productIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
})
  .refine((d) => d.type !== "PERCENT" || d.value <= 100, {
    message: "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد",
    path: ["value"],
  });
export type UpdateDiscountGroupInput = z.infer<typeof updateDiscountGroupSchema>;
