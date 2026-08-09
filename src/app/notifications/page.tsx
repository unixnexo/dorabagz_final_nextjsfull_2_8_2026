/**
 * ============================================================================
 * PAGE: /notifications
 * ============================================================================
 * RENDERING: Server Component shell (auth check), the list itself is a
 * client component for read/read-all interactivity and a push-permission
 * toggle.
 *
 * ACCESS: any logged-in user. Shows ONLY the current identity's own
 * notifications — a normal user sees their own, an admin sees admin-
 * targeted ones (per your spec: "yes exactly", same page for both, each
 * sees their own). Respects impersonation like the rest of the dashboard.
 *
 * DATA SOURCE: listNotificationsAction({page?, pageSize?}) (see
 *   src/server/notification/actions.ts)
 *   output: PaginatedResult<NotificationDTO> (see src/types/notification.ts)
 *     { id, title, body, channel: "PUSH"|"SMS"|"BOTH", linkUrl, isRead, createdAt }
 *
 * ACTIONS:
 *   markNotificationReadAction(id) -> marks one read
 *   markAllNotificationsReadAction() -> marks all read
 *
 * PUSH OPT-IN: this page is also a natural place to show a "enable
 * notifications" toggle (src/hooks/use-push-notifications.ts) since a
 * user landing here clearly cares about notifications.
 *
 * UI NOTE FOR DESIGN AGENT: list/table with unread visually distinct
 * (bold, dot indicator, etc.), tap a row to mark read + navigate to
 * linkUrl if present, "mark all read" button, pagination, and a push-
 * permission enable/disable toggle.
 * ============================================================================
 */
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user/get-current-user";
import { NotificationsList } from "./notifications-list";
import { PushPermissionToggle } from "./push-permission-toggle";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/logic");

  return (
    <main dir="rtl" style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>اعلان‌ها</h1>
      <PushPermissionToggle />
      <NotificationsList />
    </main>
  );
}
