import { z } from "zod";
import { isValidIranianPhoneNumber } from "@/lib/iranian-validators";
import { OTP_LENGTH } from "@/server/auth/constants";

const toEnglishDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

const phoneSchema = z
  .string()
  .transform(toEnglishDigits)
  .refine(isValidIranianPhoneNumber, {
    message: "شماره موبایل معتبر نیست (فرمت صحیح: 9xxxxxxxxx)",
  });

export const requestOtpSchema = z.object({
  phoneNumber: phoneSchema,
});
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  phoneNumber: phoneSchema,
  code: z.string().transform(toEnglishDigits).pipe(z.string().length(OTP_LENGTH, `کد باید ${OTP_LENGTH} رقم باشد`)),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

// Phone-change flow: request OTP to a NEW phone number while logged in.
export const requestPhoneChangeSchema = z.object({
  newPhoneNumber: phoneSchema,
});
export type RequestPhoneChangeInput = z.infer<typeof requestPhoneChangeSchema>;

export const confirmPhoneChangeSchema = z.object({
  code: z.string().length(OTP_LENGTH, `کد باید ${OTP_LENGTH} رقم باشد`),
});
export type ConfirmPhoneChangeInput = z.infer<typeof confirmPhoneChangeSchema>;
