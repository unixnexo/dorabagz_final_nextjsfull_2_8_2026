// /**
//  * ============================================================================
//  * PAGE: /admin/users/[id]
//  * ============================================================================
//  * RENDERING: Server Component. No client interactivity needed to just
//  * display the data; the edit form below it is a small client island.
//  *
//  * ACCESS: Admin only.
//  *
//  * DATA SOURCE: getUserDetailAction(userId) (see src/server/user/admin-actions.ts)
//  *   output: AdminUserDetailDTO (see src/types/user.ts) — superset of UserDTO,
//  *   plus: ipAddress, failedOtpAttempts, lockedUntil, stats: { totalOrders, totalSpent }
//  *
//  *   NOTE: stats.totalOrders / stats.totalSpent are STUBBED AT 0 for now —
//  *   will be wired to real data once the Orders module is built.
//  *
//  * UI NOTE FOR DESIGN AGENT: profile-style detail view + a small stats
//  * card (orders count / total spent) + an edit form (phone, name, national
//  * code, email, active toggle) — edits go through adminUpdateUserAction.
//  * ============================================================================
//  */
// import { notFound, redirect } from "next/navigation";
// import { getSession } from "@/server/auth/session";
// import { getUserDetailAction } from "@/server/user/admin-actions";
// import { AdminEditUserForm } from "./edit-form";

// export default async function AdminUserDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const session = await getSession();
//   if (!session || session.role !== "ADMIN") redirect("/login");

//   const { id } = await params;
//   const result = await getUserDetailAction(id);
//   if (!result.success) notFound();

//   const user = result.data;

//   return (
//     <main dir="rtl" style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>جزئیات کاربر</h1>

//       <section style={{ marginBottom: 24 }}>
//         <h2>خلاصه</h2>
//         <p>تعداد سفارشات: {user.stats.totalOrders} (فعلاً ۰ — بعد از ماژول سفارشات فعال می‌شود)</p>
//         <p>مجموع خرید: {user.stats.totalSpent} تومن (فعلاً ۰)</p>
//         <p>آی‌پی آخرین ورود: {user.ipAddress ?? "-"}</p>
//         <p>تلاش‌های ناموفق OTP: {user.failedOtpAttempts}</p>
//         <p>قفل تا: {user.lockedUntil ?? "قفل نیست"}</p>
//       </section>

//       <AdminEditUserForm user={user} />
//     </main>
//   );
// }



import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  KeyRound,
  LockKeyhole,
  Mail,
  Package,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { getSession } from "@/server/auth/session";
import { getUserDetailAction } from "@/server/user/admin-actions";
import { AdminEditUserForm } from "./edit-form";
import Link from "next/link";
import type { AdminUserDetailDTO } from "@/types/user";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;
  const result = await getUserDetailAction(id);

  if (!result.success) {
    notFound();
  }

  const user = result.data;
  const isLocked =
    user.lockedUntil !== null &&
    new Date(user.lockedUntil).getTime() > Date.now();

  return (
    <main dir="rtl" className="pb-6">
      <div className="space-y-3 pt-4">
        <Link
          href="/admin/users"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-black/[0.05] px-3.5 text-[12px] font-medium text-[#636366] active:bg-black/[0.08]"
        >
          <ArrowRight
            className="h-4 w-4"
            strokeWidth={2.25}
          />
          کاربران
        </Link>

        <UserProfileHeader user={user} isLocked={isLocked} />

        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon={Package}
            label="تعداد سفارشات"
            value={formatNumber(user.stats.totalOrders)}
            caption="فعلاً ۰"
          />

          <StatCard
            icon={CircleDollarSign}
            label="مجموع خرید"
            value={formatCurrency(user.stats.totalSpent)}
            caption="فعلاً ۰"
          />
        </div>

        <SecurityCard
          ipAddress={user.ipAddress}
          failedOtpAttempts={user.failedOtpAttempts}
          lockedUntil={user.lockedUntil}
        />

        <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="mb-4">
            <h2 className="text-[16px] font-bold text-[#1C1C1E]">
              اطلاعات کاربر
            </h2>
            <p className="mt-1 text-[12px] text-[#8E8E93]">
              اطلاعات حساب و وضعیت کاربر را مدیریت کنید.
            </p>
          </div>

          <AdminEditUserForm user={user} />
        </div>
      </div>
    </main>
  );
}

function UserProfileHeader({
    user,
    isLocked,
}: {
    user: AdminUserDetailDTO;
    isLocked: boolean;
}) {
  const initials = getInitials(user.fullName);

  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3.5">
        <div
          className={[
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px]",
            isLocked
              ? "bg-[#FF3B30]/10"
              : "bg-[#0A7D5C]/10",
          ].join(" ")}
        >
          {isLocked ? (
            <LockKeyhole
              className="h-7 w-7 text-[#FF3B30]"
              strokeWidth={2}
            />
          ) : initials ? (
            <span className="text-[21px] font-bold text-[#0A7D5C]">
              {initials}
            </span>
          ) : (
            <UserRound
              className="h-7 w-7 text-[#0A7D5C]"
              strokeWidth={1.9}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h1 className="truncate text-[19px] font-bold text-[#1C1C1E]">
              {user.fullName || "بدون نام"}
            </h1>

            <span
              className={[
                "rounded-full px-2.5 py-1 text-[10.5px] font-medium",
                user.isActive
                  ? "bg-[#0A7D5C]/10 text-[#0A7D5C]"
                  : "bg-black/[0.05] text-[#8E8E93]",
              ].join(" ")}
            >
              {user.isActive ? "فعال" : "غیرفعال"}
            </span>

            {isLocked && (
              <span className="rounded-full bg-[#FF3B30]/10 px-2.5 py-1 text-[10.5px] font-medium text-[#FF3B30]">
                قفل شده
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-[#8E8E93]">
            <Phone
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={2}
            />

            <span dir="ltr">{user.phoneNumber}</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-[12px] text-[#AEAEB2]">
            <ShieldCheck
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={2}
            />
            <span>{user.role === "ADMIN" ? "مدیر" : "کاربر"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  caption,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0A7D5C]/10">
        <Icon
          className="h-4.5 w-4.5 text-[#0A7D5C]"
          strokeWidth={2}
        />
      </div>

      <p className="mt-3 text-[11.5px] text-[#8E8E93]">
        {label}
      </p>

      <p className="mt-1 text-[18px] font-bold text-[#1C1C1E]">
        {value}
      </p>

      <p className="mt-0.5 text-[10.5px] text-[#AEAEB2]">
        {caption}
      </p>
    </div>
  );
}

function SecurityCard({
  ipAddress,
  failedOtpAttempts,
  lockedUntil,
}: {
  ipAddress: string | null;
  failedOtpAttempts: number;
  lockedUntil: string | null;
}) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="mb-3.5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black/[0.05]">
          <KeyRound
            className="h-4 w-4 text-[#636366]"
            strokeWidth={2}
          />
        </div>

        <div>
          <h2 className="text-[14px] font-bold text-[#1C1C1E]">
            امنیت حساب
          </h2>
          <p className="text-[11px] text-[#AEAEB2]">
            وضعیت ورود و امنیت کاربر
          </p>
        </div>
      </div>

      <div className="divide-y divide-[#F2F2F7]">
        <InfoRow
          icon={Clock3}
          label="آخرین ورود"
          value={
            ipAddress
              ? formatIp(ipAddress)
              : "اطلاعاتی ثبت نشده"
          }
        />

        <InfoRow
          icon={KeyRound}
          label="تلاش ناموفق OTP"
          value={`${formatNumber(failedOtpAttempts)} بار`}
        />

        <InfoRow
          icon={LockKeyhole}
          label="وضعیت قفل"
          value={
            lockedUntil
              ? `تا ${formatDateTime(lockedUntil)}`
              : "قفل نیست"
          }
          valueClassName={
            lockedUntil
              ? "text-[#FF3B30]"
              : "text-[#0A7D5C]"
          }
        />
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <Icon
        className="h-4 w-4 shrink-0 text-[#AEAEB2]"
        strokeWidth={2}
      />

      <span className="text-[12px] text-[#8E8E93]">
        {label}
      </span>

      <span
        className={[
          "mr-auto text-[12px] font-medium text-[#1C1C1E]",
          valueClassName ?? "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function getInitials(fullName: string | null) {
  if (!fullName?.trim()) return "";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 1);
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatCurrency(value: number) {
  return `${formatNumber(value)} تومن`;
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatIp(value: string) {
  return value;
}