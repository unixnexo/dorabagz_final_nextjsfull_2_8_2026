/**
 * ============================================================================
 * PAGE: /admin/categories
 * ============================================================================
 * RENDERING: Client Component — same reasoning as /admin/users: no SEO
 * value, heavy interactivity (search, create/edit/delete inline).
 *
 * ACCESS: Admin only (middleware + requireAdmin() in every action).
 *
 * DATA SOURCE: see src/server/category/actions.ts
 *   listCategoriesAction({ page, pageSize, search? })
 *     -> PaginatedResult<CategoryDTO>  (see src/types/category.ts)
 *   createCategoryAction({ title, imageUrl?, parentId? })
 *   updateCategoryAction({ id, title, imageUrl?, parentId? })
 *   deleteCategoryAction(id)   // soft delete; blocked if it has children
 *
 * RULES the UI must respect (enforced server-side too, but good for UX):
 *   - Max 2 levels deep: a category can only be a "parent" candidate
 *     (selectable in the parentId dropdown) if it has no parentId itself.
 *   - Can't delete a category that still has children — must delete/move
 *     children first.
 *
 * UI NOTE FOR DESIGN AGENT: simple CRUD table with a parentId dropdown
 * (only top-level categories as options) in the create/edit form, and an
 * indented tree view or "Parent > Child" label style in the list.
 * ============================================================================
 */
import { CategoriesManager } from "./categories-manager";

export default function AdminCategoriesPage() {
  return (
    <main dir="rtl" style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>مدیریت دسته‌بندی‌ها</h1>
      <CategoriesManager />
    </main>
  );
}
