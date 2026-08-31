import { z } from "zod";

export const checkoutAddressSchema = z.object({
    receiverFullName: z
        .string()
        .trim()
        .min(3, "نام گیرنده باید حداقل ۳ حرف باشد"),
    receiverPhone: z
        .string()
        .trim()
        .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
    province: z.string().trim().min(2, "استان را وارد کنید"),
    city: z.string().trim().min(2, "شهر را وارد کنید"),
    fullAddress: z
        .string()
        .trim()
        .min(10, "آدرس کامل باید حداقل ۱۰ حرف باشد"),
    postalCode: z
        .string()
        .trim()
        .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
});

export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;