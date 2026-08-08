"use client";

import { useState } from "react";
import {
  requestPhoneChangeAction,
  confirmPhoneChangeAction,
} from "@/server/user/profile-actions";
import type { UserDTO } from "@/types/user";

type Step = "VIEW" | "ENTER_NEW_PHONE" | "ENTER_OTP";

export function ProfileForm({ user }: { user: UserDTO }) {
  const [step, setStep] = useState<Step>("VIEW");
  const [currentPhone, setCurrentPhone] = useState(user.phoneNumber);
  const [newPhone, setNewPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequestChange(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await requestPhoneChangeAction({ newPhoneNumber: newPhone });

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setStep("ENTER_OTP");
  }

  async function handleConfirmChange(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await confirmPhoneChangeAction({ code });

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setCurrentPhone(result.data.user.phoneNumber);
    setStep("VIEW");
    setNewPhone("");
    setCode("");
  }

  return (
    <div>
      <p>
        <strong>شماره موبایل:</strong> {currentPhone}
      </p>

      {step === "VIEW" && (
        <button onClick={() => setStep("ENTER_NEW_PHONE")}>تغییر شماره موبایل</button>
      )}

      {step === "ENTER_NEW_PHONE" && (
        <form onSubmit={handleRequestChange}>
          <label htmlFor="newPhone">شماره جدید</label>
          <input
            id="newPhone"
            type="tel"
            placeholder="09123456789"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
          />
          <button type="submit" disabled={isSubmitting}>
            ارسال کد تایید
          </button>
          <button type="button" onClick={() => setStep("VIEW")} style={{ marginRight: 8 }}>
            انصراف
          </button>
        </form>
      )}

      {step === "ENTER_OTP" && (
        <form onSubmit={handleConfirmChange}>
          <p>کد ارسال شده به {newPhone} را وارد کنید (کد در کنسول سرور چاپ می‌شود)</p>
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
            تایید
          </button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
