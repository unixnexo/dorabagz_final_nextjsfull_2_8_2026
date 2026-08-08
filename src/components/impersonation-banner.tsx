import { getImpersonation } from "@/server/auth/session";
import { stopImpersonationAction } from "@/server/user/impersonation-actions";

/**
 * Shown at the top of every page when an admin is currently impersonating
 * a user. Server component — reads the impersonation cookie directly.
 */
export async function ImpersonationBanner() {
  const impersonation = await getImpersonation();
  if (!impersonation) return null;

  return (
    <div
      dir="rtl"
      style={{
        background: "#fff3cd",
        padding: "8px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <span>شما در حال مشاهده حساب یک کاربر هستید (حالت impersonation)</span>
      <form action={stopImpersonationAction}>
        <button type="submit">بازگشت به پنل ادمین</button>
      </form>
    </div>
  );
}
