import { z } from "zod";
import { isValidIranianPhoneNumber } from "@/lib/iranian-validators";
import { OTP_LENGTH } from "@/server/auth/constants";

const phoneSchema = z
  .string()
  .refine(isValidIranianPhoneNumber, {
    message: "شماره موبایل معتبر نیست (فرمت صحیح: 09xxxxxxxxx)",
  });

export const requestOtpSchema = z.object({
  phoneNumber: phoneSchema,
});
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  phoneNumber: phoneSchema,
  code: z.string().length(OTP_LENGTH, `کد باید ${OTP_LENGTH} رقم باشد`),
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
