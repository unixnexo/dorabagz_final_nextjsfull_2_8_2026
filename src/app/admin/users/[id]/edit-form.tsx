// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { adminUpdateUserAction } from "@/server/user/admin-actions";
// import type { AdminUserDetailDTO } from "@/types/user";

// export function AdminEditUserForm({ user }: { user: AdminUserDetailDTO }) {
//   const router = useRouter();
//   const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
//   const [fullName, setFullName] = useState(user.fullName ?? "");
//   const [nationalCode, setNationalCode] = useState(user.nationalCode ?? "");
//   const [email, setEmail] = useState(user.email ?? "");
//   const [isActive, setIsActive] = useState(user.isActive);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     const result = await adminUpdateUserAction({
//       userId: user.id,
//       phoneNumber,
//       fullName,
//       nationalCode,
//       email,
//       isActive,
//     });

//     setIsSubmitting(false);
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     router.refresh();
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>ویرایش</h2>

//       <label htmlFor="phone">شماره موبایل (بدون نیاز به تایید)</label>
//       <input
//         id="phone"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label htmlFor="fullName">نام کامل</label>
//       <input
//         id="fullName"
//         value={fullName}
//         onChange={(e) => setFullName(e.target.value)}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label htmlFor="nationalCode">کد ملی</label>
//       <input
//         id="nationalCode"
//         value={nationalCode}
//         onChange={(e) => setNationalCode(e.target.value)}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label htmlFor="email">ایمیل</label>
//       <input
//         id="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label>
//         <input
//           type="checkbox"
//           checked={isActive}
//           onChange={(e) => setIsActive(e.target.checked)}
//         />{" "}
//         فعال
//       </label>

//       <button type="submit" disabled={isSubmitting} style={{ display: "block", marginTop: 16 }}>
//         {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </form>
//   );
// }







"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { adminUpdateUserAction } from "@/server/user/admin-actions";
import type { AdminUserDetailDTO } from "@/types/user";
import { cn } from "@/lib/utils";

export function AdminEditUserForm({
  user,
}: {
  user: AdminUserDetailDTO;
}) {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [nationalCode, setNationalCode] = useState(
    user.nationalCode ?? ""
  );
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <Field
          id="phone"
          label="شماره موبایل"
          icon={Phone}
          value={phoneNumber}
          onChange={setPhoneNumber}
          dir="ltr"
          inputMode="tel"
          placeholder="09123456789"
        />

        <Field
          id="fullName"
          label="نام کامل"
          icon={UserRound}
          value={fullName}
          onChange={setFullName}
          placeholder="مثلاً علی محمدی"
        />

        <Field
          id="nationalCode"
          label="کد ملی"
          icon={ShieldCheck}
          value={nationalCode}
          onChange={setNationalCode}
          dir="ltr"
          inputMode="numeric"
          placeholder="0012345678"
        />

        <Field
          id="email"
          label="ایمیل"
          icon={Mail}
          value={email}
          onChange={setEmail}
          dir="ltr"
          inputMode="email"
          placeholder="example@email.com"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsActive((value) => !value)}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl px-4 py-3.5 transition-colors",
          isActive
            ? "bg-[#0A7D5C]/10"
            : "bg-black/[0.05]"
        )}
      >
        <div className="text-right">
          <p
            className={cn(
              "text-[13.5px] font-semibold",
              isActive
                ? "text-[#0A7D5C]"
                : "text-[#1C1C1E]"
            )}
          >
            حساب کاربر فعال باشد
          </p>

          <p className="mt-0.5 text-[11px] text-[#8E8E93]">
            کاربر در حالت غیرفعال نمی‌تواند از حساب استفاده کند.
          </p>
        </div>

        <span
          className={cn(
            "relative flex h-7 w-12 shrink-0 rounded-full p-1 transition-colors",
            isActive
              ? "bg-[#0A7D5C]"
              : "bg-[#C7C7CC]"
          )}
        >
          <span
            className={cn(
              "h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform",
              isActive
                ? "-translate-x-5"
                : "translate-x-0"
            )}
          />
        </span>
      </button>

      {error && (
        <div className="rounded-2xl bg-[#FF3B30]/10 px-3.5 py-2.5 text-[12.5px] font-medium text-[#FF3B30]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A7D5C] py-3.5 text-[14px] font-semibold text-white transition-opacity active:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2
              className="h-4 w-4 animate-spin"
              strokeWidth={2.25}
            />
            در حال ذخیره...
          </>
        ) : (
          <>
            <Save
              className="h-4 w-4"
              strokeWidth={2.25}
            />
            ذخیره تغییرات
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  dir,
  inputMode,
}: {
  id: string;
  label: string;
  icon: typeof Phone;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEAEB2]"
          strokeWidth={2}
        />

        <input
          id={id}
          dir={dir}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-2xl bg-black/[0.05] px-11 text-[14px] text-[#1C1C1E] outline-none transition-colors",
            "placeholder:text-[#C7C7CC]",
            "focus:bg-white focus:ring-2 focus:ring-[#0A7D5C]/15"
          )}
        />
      </div>
    </div>
  );
}

