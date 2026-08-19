// /**
//  * ============================================================================
//  * PAGE: /admin/users
//  * ============================================================================
//  * RENDERING: Client Component (the table + its state). Admin pages have zero
//  * SEO value and are heavy on interactivity (search-as-you-type, pagination,
//  * filters, row actions) — CSR with TanStack Query is the right call here,
//  * same pattern will repeat for every admin dashboard page.
//  *
//  * ACCESS: Admin only (enforced by middleware.ts + requireAdmin() in the
//  * server action itself as a second layer of defense).
//  *
//  * DATA SOURCE: listUsersAction() server action (see src/server/user/admin-actions.ts)
//  *   input:  { page, pageSize, search?, role?, isActive? }
//  *   output: PaginatedResult<AdminUserListItemDTO>  (see src/types/user.ts)
//  *     AdminUserListItemDTO = {
//  *       id, phoneNumber, fullName, role, isActive, isLocked,
//  *       createdAt, lastLoginAt
//  *     }
//  *
//  * ROW ACTIONS available (each calls its own server action):
//  *   - Edit phone number  -> adminUpdateUserAction({ userId, phoneNumber, ... })
//  *   - Activate/Deactivate -> setUserActiveAction(userId, boolean)
//  *   - Unlock             -> unlockUserAction(userId)
//  *   - Impersonate         -> startImpersonationAction(userId) -> redirects to "/"
//  *   - View detail         -> link to /admin/users/[id]
//  *
//  * UI NOTE FOR DESIGN AGENT: standard admin table — search box, role/active
//  * filters, paginated rows, action buttons/menu per row, and a locked-account
//  * badge when isLocked is true.
//  * ============================================================================
//  */
// import { AdminUsersTable } from "./users-table";

// export default function AdminUsersPage() {
//   return (
//     <main dir="rtl" style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>مدیریت کاربران</h1>
//       <AdminUsersTable />
//     </main>
//   );
// }






/**
 * PAGE: /admin/users
 * Layout is provided by app/admin/layout.tsx.
 */
import { AdminUsersTable } from "./users-table";

export default function AdminUsersPage() {
  return (
    <main dir="rtl" className="pb-4">
      <AdminUsersTable />
    </main>
  );
}