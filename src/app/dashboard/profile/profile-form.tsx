// "use client";

// import { useState } from "react";
// import {
//   requestPhoneChangeAction,
//   confirmPhoneChangeAction,
// } from "@/server/user/profile-actions";
// import type { UserDTO } from "@/types/user";

// type Step = "VIEW" | "ENTER_NEW_PHONE" | "ENTER_OTP";

// export function ProfileForm({ user }: { user: UserDTO }) {
//   const [step, setStep] = useState<Step>("VIEW");
//   const [currentPhone, setCurrentPhone] = useState(user.phoneNumber);
//   const [newPhone, setNewPhone] = useState("");
//   const [code, setCode] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   async function handleRequestChange(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     const result = await requestPhoneChangeAction({ newPhoneNumber: newPhone });

//     setIsSubmitting(false);
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     setStep("ENTER_OTP");
//   }

//   async function handleConfirmChange(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     const result = await confirmPhoneChangeAction({ code });

//     setIsSubmitting(false);
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     setCurrentPhone(result.data.user.phoneNumber);
//     setStep("VIEW");
//     setNewPhone("");
//     setCode("");
//   }

//   return (
//     <div>
//       <p>
//         <strong>شماره موبایل:</strong> {currentPhone}
//       </p>

//       {step === "VIEW" && (
//         <button onClick={() => setStep("ENTER_NEW_PHONE")}>تغییر شماره موبایل</button>
//       )}

//       {step === "ENTER_NEW_PHONE" && (
//         <form onSubmit={handleRequestChange}>
//           <label htmlFor="newPhone">شماره جدید</label>
//           <input
//             id="newPhone"
//             type="tel"
//             placeholder="09123456789"
//             value={newPhone}
//             onChange={(e) => setNewPhone(e.target.value)}
//             style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//           />
//           <button type="submit" disabled={isSubmitting}>
//             ارسال کد تایید
//           </button>
//           <button type="button" onClick={() => setStep("VIEW")} style={{ marginRight: 8 }}>
//             انصراف
//           </button>
//         </form>
//       )}

//       {step === "ENTER_OTP" && (
//         <form onSubmit={handleConfirmChange}>
//           <p>کد ارسال شده به {newPhone} را وارد کنید (کد در کنسول سرور چاپ می‌شود)</p>
//           <label htmlFor="code">کد تایید</label>
//           <input
//             id="code"
//             type="text"
//             inputMode="numeric"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//           />
//           <button type="submit" disabled={isSubmitting}>
//             تایید
//           </button>
//         </form>
//       )}

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Smartphone,
  ChevronLeft,
  Check,
  ShieldCheck,
} from "lucide-react";

import {
  requestPhoneChangeAction,
  confirmPhoneChangeAction,
} from "@/server/user/profile-actions";

import type { UserDTO } from "@/types/user";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "VIEW" | "ENTER_NEW_PHONE" | "ENTER_OTP";

export function ProfileForm({
  user,
}: {
  user: UserDTO;
}) {
  const [step, setStep] = useState<Step>("VIEW");
  const [currentPhone, setCurrentPhone] = useState(
    user.phoneNumber
  );

  const [newPhone, setNewPhone] = useState("");
  const [code, setCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequestChange(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const result =
      await requestPhoneChangeAction({
        newPhoneNumber: newPhone,
      });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setStep("ENTER_OTP");
  }

  async function handleConfirmChange(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const result =
      await confirmPhoneChangeAction({
        code,
      });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setCurrentPhone(
      result.data.user.phoneNumber
    );

    setStep("VIEW");
    setNewPhone("");
    setCode("");
  }

  return (
    <div className="space-y-4">

      {/* User card */}
      <motion.section
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="overflow-hidden rounded-[28px] bg-white"
      >
        <div className="flex items-center gap-4 p-5">
          <div className="relative flex size-[64px] shrink-0 items-center justify-center overflow-hidden rounded-[21px] bg-[#f1f2f3]">
            {user.profilePicUrl ? (
              <img
                src={user.profilePicUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[23px] font-bold">
                {user.fullName?.charAt(0) || "ک"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-bold">
              {user.fullName || "کاربر"}
            </h2>

            <p className="mt-1 text-[12px] text-black/35">
              اطلاعات حساب کاربری
            </p>
          </div>
        </div>

        <div className="mx-5 h-px bg-black/[0.05]" />

        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-[17px] text-black/45" />

            <span className="text-[12px] text-black/45">
              حساب فعال
            </span>
          </div>

          <span className="text-[12px] font-medium text-black/60">
            {user.role === "ADMIN"
              ? "مدیر"
              : "کاربر"}
          </span>
        </div>
      </motion.section>

      {/* Phone section */}
      <motion.section
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.05,
        }}
        className="rounded-[28px] bg-white p-5"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-[43px] items-center justify-center rounded-[15px] bg-[#f1f2f3]">
            <Smartphone
              className="size-[19px]"
              strokeWidth={1.9}
            />
          </div>

          <div>
            <p className="text-[12px] text-black/35">
              شماره موبایل
            </p>

            <p className="mt-1 text-[16px] font-semibold tracking-wide">
              {currentPhone}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* VIEW */}
          {step === "VIEW" && (
            <motion.div
              key="view"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <Button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(
                    "ENTER_NEW_PHONE"
                  );
                }}
                variant="outline"
                className="h-[48px] w-full rounded-[17px] border-0 bg-[#f1f2f3] text-[13px] font-semibold hover:bg-[#e8e9ea]"
              >
                تغییر شماره موبایل

                <ChevronLeft className="mr-1 size-[17px]" />
              </Button>
            </motion.div>
          )}

          {/* NEW PHONE */}
          {step === "ENTER_NEW_PHONE" && (
            <motion.form
              key="phone"
              onSubmit={
                handleRequestChange
              }
              initial={{
                opacity: 0,
                x: 18,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -18,
              }}
              className="space-y-3"
            >
              <Input
                type="tel"
                inputMode="tel"
                dir="ltr"
                placeholder="09123456789"
                value={newPhone}
                onChange={(e) =>
                  setNewPhone(
                    e.target.value
                  )
                }
                className="h-[50px] rounded-[17px] border-0 bg-[#f1f2f3] px-4 text-right text-[14px]"
                required
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[50px] w-full rounded-[17px] text-[13px] font-semibold"
              >
                {isSubmitting
                  ? "در حال ارسال..."
                  : "ارسال کد تایید"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep("VIEW");
                  setNewPhone("");
                  setError(null);
                }}
                className="h-[42px] w-full rounded-[15px] text-[13px] text-black/45"
              >
                انصراف
              </Button>
            </motion.form>
          )}

          {/* OTP */}
          {step === "ENTER_OTP" && (
            <motion.form
              key="otp"
              onSubmit={
                handleConfirmChange
              }
              initial={{
                opacity: 0,
                x: 18,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -18,
              }}
              className="space-y-3"
            >
              <div className="rounded-[17px] bg-[#f1f2f3] px-4 py-3.5 text-[12px] leading-6 text-black/45">
                کد تایید برای شماره
                <span className="mx-1 font-semibold text-black/70">
                  {newPhone}
                </span>
                ارسال شد.
              </div>

              <Input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                dir="ltr"
                placeholder="کد تایید"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                  )
                }
                className="h-[52px] rounded-[17px] border-0 bg-[#f1f2f3] text-center text-[18px] tracking-[0.4em]"
                required
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[50px] w-full rounded-[17px] text-[13px] font-semibold"
              >
                {isSubmitting ? (
                  "در حال بررسی..."
                ) : (
                  <>
                    تایید شماره
                    <Check className="mr-1 size-[17px]" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep("VIEW");
                  setNewPhone("");
                  setCode("");
                  setError(null);
                }}
                className="h-[42px] w-full rounded-[15px] text-[13px] text-black/45"
              >
                انصراف
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-3 rounded-[16px] bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-600"
          >
            {error}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}

