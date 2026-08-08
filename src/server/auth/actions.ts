"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requestOtpSchema, verifyOtpSchema } from "@/lib/validations/auth";
import { generateOtp, hashOtp, verifyOtp } from "./otp";
import { getSmsProvider } from "@/server/sms/sms-provider";
import { createSessionToken, setSessionCookie } from "./session";
import { toUserDTO } from "@/server/user/user-mapper";
import { mergeGuestCartSchema } from "@/lib/validations/cart";
import {
  OTP_EXPIRY_MINUTES,
  MAX_FAILED_OTP_ATTEMPTS,
  LOCKOUT_MINUTES,
} from "./constants";
import type { UserDTO } from "@/types/user";

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

  // Find or create the user (register-on-first-OTP-request, per your spec).
  const user = await prisma.user.upsert({
    where: { phoneNumber },
    update: {},
    create: { phoneNumber },
  });

  // Locked accounts can't request a new OTP either.
  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return {
      success: false,
      error: `حساب شما موقتاً قفل است. ${minutesLeft} دقیقه دیگر تلاش کنید.`,
    };
  }

  const code = generateOtp();
  const codeHash = await hashOtp(code);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpCodeHash: codeHash,
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      otpPurpose: "LOGIN",
    },
  });

  await getSmsProvider().send(phoneNumber, `کد ورود شما: ${code}`);

  return { success: true, data: { phoneNumber } };
}

// ---------------------------------------------------------------------------
// Step 2: verify OTP -> create session -> log the user in.
// ---------------------------------------------------------------------------
// export async function verifyOtpAction(
//   input: unknown
// ): Promise<ActionResult<{ user: UserDTO }>> {
export async function verifyOtpAction(
  input: unknown,
  guestCart?: unknown
): Promise<ActionResult<{ user: UserDTO }>> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { phoneNumber, code } = parsed.data;

  const user = await prisma.user.findUnique({ where: { phoneNumber } });
  if (!user) {
    return { success: false, error: "کاربری با این شماره یافت نشد." };
  }

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

  const isValid = await verifyOtp(code, user.otpCodeHash);

  if (!isValid) {
    const attempts = user.failedOtpAttempts + 1;
    const shouldLock = attempts >= MAX_FAILED_OTP_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedOtpAttempts: attempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
          : undefined,
      },
    });

    if (shouldLock) {
      return {
        success: false,
        error: `تعداد تلاش‌های اشتباه بیش از حد مجاز. حساب برای ${LOCKOUT_MINUTES} دقیقه قفل شد.`,
      };
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

  if (guestCart) {
    const parsedGuestCart = mergeGuestCartSchema.safeParse(guestCart);

    if (parsedGuestCart.success) {
      for (const guestItem of parsedGuestCart.data.items) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: guestItem.variantId },
        });

        if (!variant) continue;

        const existing = await prisma.cartItem.findUnique({
          where: {
            userId_variantId: {
              userId: updatedUser.id,
              variantId: variant.id,
            },
          },
        });

        const desiredQuantity =
          (existing?.quantity ?? 0) + guestItem.quantity;

        const cappedQuantity = Math.min(desiredQuantity, variant.stock);

        if (cappedQuantity <= 0) continue;

        await prisma.cartItem.upsert({
          where: {
            userId_variantId: {
              userId: updatedUser.id,
              variantId: variant.id,
            },
          },
          update: {
            quantity: cappedQuantity,
          },
          create: {
            userId: updatedUser.id,
            variantId: variant.id,
            quantity: cappedQuantity,
          },
        });
      }
    }
  }

  return { success: true, data: { user: toUserDTO(updatedUser) } };
}
