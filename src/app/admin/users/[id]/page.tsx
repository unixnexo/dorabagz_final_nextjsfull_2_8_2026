/**
 * ============================================================================
 * PAGE: /admin/users/[id]
 * ============================================================================
 * RENDERING: Server Component. No client interactivity needed to just
 * display the data; the edit form below it is a small client island.
 *
 * ACCESS: Admin only.
 *
 * DATA SOURCE: getUserDetailAction(userId) (see src/server/user/admin-actions.ts)
 *   output: AdminUserDetailDTO (see src/types/user.ts) — superset of UserDTO,
 *   plus: ipAddress, failedOtpAttempts, lockedUntil, stats: { totalOrders, totalSpent }
 *
 *   NOTE: stats.totalOrders / stats.totalSpent are STUBBED AT 0 for now —
 *   will be wired to real data once the Orders module is built.
 *
 * UI NOTE FOR DESIGN AGENT: profile-style detail view + a small stats
 * card (orders count / total spent) + an edit form (phone, name, national
 * code, email, active toggle) — edits go through adminUpdateUserAction.
 * ============================================================================
 */
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { getUserDetailAction } from "@/server/user/admin-actions";
import { AdminEditUserForm } from "./edit-form";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const { id } = await params;
  const result = await getUserDetailAction(id);
  if (!result.success) notFound();

  const user = result.data;

  return (
    <main dir="rtl" style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>جزئیات کاربر</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>خلاصه</h2>
        <p>تعداد سفارشات: {user.stats.totalOrders} (فعلاً ۰ — بعد از ماژول سفارشات فعال می‌شود)</p>
        <p>مجموع خرید: {user.stats.totalSpent} تومان (فعلاً ۰)</p>
        <p>آی‌پی آخرین ورود: {user.ipAddress ?? "-"}</p>
        <p>تلاش‌های ناموفق OTP: {user.failedOtpAttempts}</p>
        <p>قفل تا: {user.lockedUntil ?? "قفل نیست"}</p>
      </section>

      <AdminEditUserForm user={user} />
    </main>
  );
}
