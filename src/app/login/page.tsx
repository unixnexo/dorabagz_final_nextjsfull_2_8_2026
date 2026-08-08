/**
 * ============================================================================
 * PAGE: /login  (Login / Register via OTP)
 * ============================================================================
 * RENDERING: Client Component. This page is pure interaction (form, timers,
 * step switching) with no SEO value — a logged-out visitor doesn't need this
 * page indexed. CSR is the right call here, not a tradeoff.
 *
 * FLOW:
 *   1. User enters phone number -> requestOtpAction() -> OTP sent (console.log for now)
 *   2. User enters the 6-digit code -> verifyOtpAction() -> session cookie set -> redirect "/"
 *
 * DATA SHAPES (see src/lib/validations/auth.ts for exact Zod schemas):
 *   requestOtpAction(input: { phoneNumber: string })
 *     -> { success: true, data: { phoneNumber: string } }
 *     -> { success: false, error: string }
 *
 *   verifyOtpAction(input: { phoneNumber: string, code: string })
 *     -> { success: true, data: { user: UserDTO } }   // see src/types/user.ts
 *     -> { success: false, error: string }
 *
 * UI NOTE FOR DESIGN AGENT: two-step form (phone entry -> code entry).
 * Needs a "resend code" affordance and a way to go back and edit the phone
 * number. Show server-side error messages returned in `error`.
 * ============================================================================
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtpAction, verifyOtpAction } from "@/server/auth/actions";

type Step = "PHONE" | "OTP";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await requestOtpAction({ phoneNumber });

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setStep("OTP");
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await verifyOtpAction({ phoneNumber, code });

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main dir="rtl" style={{ maxWidth: 360, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>ورود / ثبت‌نام</h1>

      {step === "PHONE" && (
        <form onSubmit={handleRequestOtp}>
          <label htmlFor="phone">شماره موبایل</label>
          <input
            id="phone"
            type="tel"
            placeholder="09123456789"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "در حال ارسال..." : "دریافت کد"}
          </button>
        </form>
      )}

      {step === "OTP" && (
        <form onSubmit={handleVerifyOtp}>
          <p>کد ارسال شده به {phoneNumber} را وارد کنید (کد در کنسول سرور چاپ می‌شود)</p>
          <label htmlFor="code">کد تایید</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "در حال بررسی..." : "ورود"}
          </button>
          <button type="button" onClick={() => setStep("PHONE")} style={{ marginRight: 8 }}>
            بازگشت
          </button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
