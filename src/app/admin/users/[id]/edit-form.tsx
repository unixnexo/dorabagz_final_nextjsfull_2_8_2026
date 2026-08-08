"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateUserAction } from "@/server/user/admin-actions";
import type { AdminUserDetailDTO } from "@/types/user";

export function AdminEditUserForm({ user }: { user: AdminUserDetailDTO }) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [nationalCode, setNationalCode] = useState(user.nationalCode ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [isActive, setIsActive] = useState(user.isActive);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await adminUpdateUserAction({
      userId: user.id,
      phoneNumber,
      fullName,
      nationalCode,
      email,
      isActive,
    });

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>ویرایش</h2>

      <label htmlFor="phone">شماره موبایل (بدون نیاز به تایید)</label>
      <input
        id="phone"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="fullName">نام کامل</label>
      <input
        id="fullName"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="nationalCode">کد ملی</label>
      <input
        id="nationalCode"
        value={nationalCode}
        onChange={(e) => setNationalCode(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="email">ایمیل</label>
      <input
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />{" "}
        فعال
      </label>

      <button type="submit" disabled={isSubmitting} style={{ display: "block", marginTop: 16 }}>
        {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
