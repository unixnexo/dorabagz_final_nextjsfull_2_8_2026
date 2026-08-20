import { z } from "zod";
import { isValidIranianPhoneNumber, isValidIranianNationalCode } from "@/lib/iranian-validators";

// User editing their own profile (per your spec: only phone number for now).
// Changing phone number triggers OTP — handled separately via auth.ts schemas.

// Admin editing a user directly — full edit, no OTP required.
// export const adminUpdateUserSchema = z.object({
//   userId: z.string().min(1),
//   phoneNumber: z
//     .string()
//     .refine(isValidIranianPhoneNumber, { message: "شماره موبایل معتبر نیست" })
//     .optional(),
//   fullName: z.string().min(1).max(100).nullable().optional(),
//   nationalCode: z
//     .string()
//     .refine((v) => v === "" || isValidIranianNationalCode(v), {
//       message: "کد ملی معتبر نیست",
//     })
//     .nullable()
//     .optional(),
//   email: z.string().email("ایمیل معتبر نیست").nullable().optional().or(z.literal("")),
//   isActive: z.boolean().optional(),
// });
// export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export const adminUpdateUserSchema = z.object({
  userId: z.string().min(1),

  phoneNumber: z
    .string()
    .refine(isValidIranianPhoneNumber, {
      message: "شماره موبایل معتبر نیست",
    }),

  fullName: z
    .string()
    .trim()
    .min(1, "نام کامل الزامی است")
    .max(100, "نام کامل نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),

  nationalCode: z
    .string()
    .refine((v) => v === "" || isValidIranianNationalCode(v), {
      message: "کد ملی معتبر نیست",
    })
    .nullable()
    .optional(),

  email: z
    .string()
    .email("ایمیل معتبر نیست")
    .nullable()
    .optional()
    .or(z.literal("")),

  isActive: z.boolean().optional(),
});
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;

export const adminUserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(), // matches phone number or full name
  role: z.enum(["USER", "ADMIN"]).optional(),
  isActive: z.coerce.boolean().optional(),
});
export type AdminUserListQuery = z.infer<typeof adminUserListQuerySchema>;
