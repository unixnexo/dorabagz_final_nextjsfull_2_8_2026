"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import {
  requestPhoneChangeSchema,
  confirmPhoneChangeSchema,
} from "@/lib/validations/auth";
import { generateOtp, hashOtp, verifyOtp } from "@/server/auth/otp";
import { getSmsProvider } from "@/server/sms/sms-provider";
import { OTP_EXPIRY_MINUTES } from "@/server/auth/constants";
import { toUserDTO } from "./user-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { UserDTO } from "@/types/user";

/**
 * Step 1: logged-in user requests to change their phone number.
 * We send an OTP to the NEW number. Their old number stays active until confirmed.
 */
export async function requestPhoneChangeAction(
  input: unknown
): Promise<ActionResult<{ newPhoneNumber: string }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = requestPhoneChangeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { newPhoneNumber } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { phoneNumber: newPhoneNumber } });
  if (existing) {
    return { success: false, error: "این شماره قبلاً در سیستم ثبت شده است." };
  }

  const code = generateOtp();
  const codeHash = await hashOtp(code);

  await prisma.user.update({
    where: { id: identity.userId },
    data: {
      pendingPhoneNumber: newPhoneNumber,
      otpCodeHash: codeHash,
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      otpPurpose: "PHONE_CHANGE",
    },
  });

  await getSmsProvider().send(newPhoneNumber, `کد تایید تغییر شماره: ${code}`);

  return { success: true, data: { newPhoneNumber } };
}

/**
 * Step 2: confirm the OTP sent to the new number -> apply the change.
 */
export async function confirmPhoneChangeAction(
  input: unknown
): Promise<ActionResult<{ user: UserDTO }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: false, error: "ابتدا وارد شوید." };

  const parsed = confirmPhoneChangeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const user = await prisma.user.findUnique({ where: { id: identity.userId } });
  if (!user) return { success: false, error: "کاربر یافت نشد." };

  if (
    !user.otpCodeHash ||
    !user.otpExpiresAt ||
    user.otpPurpose !== "PHONE_CHANGE" ||
    !user.pendingPhoneNumber
  ) {
    return { success: false, error: "ابتدا درخواست تغییر شماره کنید." };
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    return { success: false, error: "کد منقضی شده است." };
  }

  const isValid = await verifyOtp(parsed.data.code, user.otpCodeHash);
  if (!isValid) {
    return { success: false, error: "کد وارد شده اشتباه است." };
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      phoneNumber: user.pendingPhoneNumber,
      pendingPhoneNumber: null,
      otpCodeHash: null,
      otpExpiresAt: null,
      otpPurpose: null,
    },
  });

  return { success: true, data: { user: toUserDTO(updatedUser) } };
}
