/**
 * ============================================================================
 * PAGE: /dashboard/profile
 * ============================================================================
 * RENDERING: Server Component (shell) + Client Component (interactive form).
 * The initial user data is fetched server-side (fast, no loading spinner,
 * good for auth-gated pages in general) and passed down as a prop. The
 * phone-change form itself needs client interactivity (2-step OTP), so
 * that part is a client component.
 *
 * ACCESS: any logged-in user (USER or ADMIN). Works correctly even while
 * an admin is impersonating a user (shows the impersonated user's data).
 *
 * DATA SHAPE received from server: UserDTO (see src/types/user.ts):
 *   { id, phoneNumber, fullName, nationalCode, birthDate, email,
 *     profilePicUrl, role, isActive, createdAt, lastLoginAt }
 *
 * UI NOTE FOR DESIGN AGENT: Simple page — show phone number, a "change
 * phone number" flow (2-step: enter new number -> enter OTP sent to it),
 * and a logout button.
 * ============================================================================
 */
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user/get-current-user";
import { ProfileForm } from "./profile-form";
import { LogoutButton } from "@/components/logout-button";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main dir="rtl" style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>پروفایل</h1>
      <ProfileForm user={user} />
      <hr style={{ margin: "24px 0" }} />
      <LogoutButton />
    </main>
  );
}
