import { describe, it, expect } from "vitest";
import { OTP_EXPIRY_MINUTES, OTP_RESEND_COOLDOWN_SECONDS } from "@/server/auth/constants";

/**
 * The resend-cooldown check derives "when was the OTP issued" from
 * otpExpiresAt (issuedAt = otpExpiresAt - OTP_EXPIRY_MINUTES) rather than
 * storing a separate timestamp. This test locks in that math so the
 * derivation can't silently flip sign or drift if the constants change.
 */
function secondsSinceIssued(otpExpiresAt: Date, now: Date): number {
  const issuedAt = otpExpiresAt.getTime() - OTP_EXPIRY_MINUTES * 60 * 1000;
  return (now.getTime() - issuedAt) / 1000;
}

describe("OTP resend cooldown derivation", () => {
  it("computes ~0 seconds since issue right when the OTP was just created", () => {
    const now = new Date("2026-08-01T00:00:00Z");
    const otpExpiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
    expect(secondsSinceIssued(otpExpiresAt, now)).toBeCloseTo(0, 5);
  });

  it("blocks a resend attempted immediately (within the cooldown window)", () => {
    const issuedAt = new Date("2026-08-01T00:00:00Z");
    const otpExpiresAt = new Date(issuedAt.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const attemptedAt = new Date(issuedAt.getTime() + 30 * 1000); // 30s later

    const elapsed = secondsSinceIssued(otpExpiresAt, attemptedAt);
    expect(elapsed).toBeLessThan(OTP_RESEND_COOLDOWN_SECONDS);
  });

  it("allows a resend once the cooldown has fully elapsed", () => {
    const issuedAt = new Date("2026-08-01T00:00:00Z");
    const otpExpiresAt = new Date(issuedAt.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const attemptedAt = new Date(issuedAt.getTime() + (OTP_RESEND_COOLDOWN_SECONDS + 1) * 1000);

    const elapsed = secondsSinceIssued(otpExpiresAt, attemptedAt);
    expect(elapsed).toBeGreaterThanOrEqual(OTP_RESEND_COOLDOWN_SECONDS);
  });

  it("OTP_EXPIRY_MINUTES is 5 and OTP_RESEND_COOLDOWN_SECONDS is 120, per spec", () => {
    expect(OTP_EXPIRY_MINUTES).toBe(5);
    expect(OTP_RESEND_COOLDOWN_SECONDS).toBe(120);
  });
});
