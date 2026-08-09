import { z } from "zod";
import { isValidIranianPhoneNumber } from "@/lib/iranian-validators";

export const addressFormSchema = z.object({
  receiverFullName: z.string().min(1, "نام گیرنده الزامی است").max(100),
  receiverPhone: z
    .string()
    .refine(isValidIranianPhoneNumber, { message: "شماره موبایل گیرنده معتبر نیست" }),
  province: z.string().min(1, "استان الزامی است").max(100),
  city: z.string().min(1, "شهر الزامی است").max(100),
  fullAddress: z.string().min(10, "آدرس کامل را وارد کنید").max(1000),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
});
export type AddressFormInput = z.infer<typeof addressFormSchema>;
