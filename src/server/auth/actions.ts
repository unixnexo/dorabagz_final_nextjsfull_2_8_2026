"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requestOtpSchema, verifyOtpSchema } from "@/lib/validations/auth";
import { generateOtp, hashOtp, verifyOtp } from "./otp";
import { getSmsProvider } from "@/server/sms/sms-provider";
import { createSessionToken, setSessionCookie } from "./session";
import { toUserDTO } from "@/server/user/user-mapper";
import {
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
  MAX_FAILED_OTP_ATTEMPTS,
  LOCKOUT_MINUTES,
} from "./constants";
import type { UserDTO } from "@/types/user";
import { rateLimit } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Generic result type every server action in this module returns.
// The frontend should always check `success` before reading `data`.
// ---------------------------------------------------------------------------
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Step 1: request OTP (works for both login and register — if the phone
// number doesn't exist yet, we create the user row here).
// ---------------------------------------------------------------------------
export async function requestOtpAction(
  input: unknown
): Promise<ActionResult<{ phoneNumber: string }>> {
  const parsed = requestOtpSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { phoneNumber } = parsed.data;

  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",").pop()?.trim() ?? "unknown";
  if (!rateLimit(`otp:${ip}`, 10, 10 * 60 * 1000)) {
    return { success: false, error: "تعداد درخواست‌ها زیاد است. چند دقیقه بعد تلاش کنید." };
  }
  // Find or create the user (register-on-first-OTP-request, per your spec).
  const user = await prisma.user.upsert({
    where: { phoneNumber },
    update: {},
    create: { phoneNumber },
  });

  if (!user.isActive) return { success: false, error: "حساب کاربری شما غیرفعال است." };

  // Locked accounts can't request a new OTP either.
  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return {
      success: false,
      error: `حساب شما موقتاً قفل است. ${minutesLeft} دقیقه دیگر تلاش کنید.`,
    };
  }

  // Resend cooldown: if an OTP was issued too recently, don't send another
  // one yet. We derive "when it was issued" from otpExpiresAt (issuedAt =
  // otpExpiresAt - OTP_EXPIRY_MINUTES) rather than storing a separate
  // timestamp — no schema change needed.
  if (user.otpExpiresAt && user.otpPurpose === "LOGIN") {
    const issuedAt = user.otpExpiresAt.getTime() - OTP_EXPIRY_MINUTES * 60 * 1000;
    const secondsSinceIssued = (Date.now() - issuedAt) / 1000;
    if (secondsSinceIssued < OTP_RESEND_COOLDOWN_SECONDS) {
      const secondsLeft = Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - secondsSinceIssued);
      return {
        success: false,
        error: `لطفاً ${secondsLeft} ثانیه دیگر دوباره تلاش کنید.`,
      };
    }
  }

  const code = generateOtp();
  const codeHash = await hashOtp(code);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpCodeHash: codeHash,
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      otpPurpose: "LOGIN",
      failedOtpAttempts: 0, lockedUntil: null,
    },
  });

  await getSmsProvider().send(phoneNumber, `کد ورود شما: ${code}`);

  return { success: true, data: { phoneNumber } };
}

// ---------------------------------------------------------------------------
// Step 2: verify OTP -> create session -> log the user in.
// ---------------------------------------------------------------------------
export async function verifyOtpAction(
  input: unknown
): Promise<ActionResult<{ user: UserDTO }>> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { phoneNumber, code } = parsed.data;

  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",").pop()?.trim() ?? "unknown";
  if (!rateLimit(`verify:${ip}`, 30, 10 * 60 * 1000)) {
    return { success: false, error: "تعداد تلاش‌ها زیاد است. چند دقیقه بعد تلاش کنید." };
  }

  const user = await prisma.user.findUnique({ where: { phoneNumber } });
  if (!user) {
    return { success: false, error: "کاربری با این شماره یافت نشد." };
  }

  if (!user.isActive) return { success: false, error: "حساب کاربری شما غیرفعال است." };

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return {
      success: false,
      error: `حساب شما موقتاً قفل است. ${minutesLeft} دقیقه دیگر تلاش کنید.`,
    };
  }

  if (!user.otpCodeHash || !user.otpExpiresAt || user.otpPurpose !== "LOGIN") {
    return { success: false, error: "ابتدا درخواست کد کنید." };
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    return { success: false, error: "کد منقضی شده است. دوباره درخواست دهید." };
  }

  const { failedOtpAttempts: attempt } = await prisma.user.update({
    where: { id: user.id },
    data: { failedOtpAttempts: { increment: 1 } },
    select: { failedOtpAttempts: true },
  });

  const lockedMsg = `تعداد تلاش‌های اشتباه بیش از حد مجاز. حساب برای ${LOCKOUT_MINUTES} دقیقه قفل شد.`;
  const lockUser = () =>
    prisma.user.update({
      where: { id: user.id },
      data: { lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) },
    });

  if (attempt > MAX_FAILED_OTP_ATTEMPTS) {
    await lockUser();
    return { success: false, error: lockedMsg };
  }

  const isValid = await verifyOtp(code, user.otpCodeHash);

  if (!isValid) {
    if (attempt >= MAX_FAILED_OTP_ATTEMPTS) {
      await lockUser();
      return { success: false, error: lockedMsg };
    }
    return { success: false, error: "کد وارد شده اشتباه است." };
  }

  // Success: reset attempts, clear OTP, update login metadata, create session.
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    null;

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      otpCodeHash: null,
      otpExpiresAt: null,
      otpPurpose: null,
      failedOtpAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      ipAddress: ipAddress ?? user.ipAddress,
    },
  });

  const token = await createSessionToken({
    userId: updatedUser.id,
    role: updatedUser.role,
  });
  await setSessionCookie(token);

  return { success: true, data: { user: toUserDTO(updatedUser) } };
}

