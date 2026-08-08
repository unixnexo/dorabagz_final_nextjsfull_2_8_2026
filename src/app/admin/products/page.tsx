/**
 * ============================================================================
 * PAGE: /admin/products
 * ============================================================================
 * RENDERING: Client Component — same reasoning as other admin pages.
 *
 * DATA SOURCE: adminListProductsAction() (see src/server/product/actions.ts)
 *   input:  { page?, pageSize?, search?, categoryId?, minPrice?, maxPrice? }
 *   output: PaginatedResult<ProductListItemDTO> (see src/types/product.ts)
 *   (this admin version includes soft-deleted products too, unlike the
 *   public listProductsAction)
 *
 * ROW ACTIONS:
 *   - Edit  -> link to /admin/products/[id]/edit
 *   - Delete/Restore -> setProductDeletedAction(id, boolean)
 *
 * UI NOTE FOR DESIGN AGENT: standard admin table with search, category
 * filter, price range filter, pagination, and a "deleted" badge/strike-
 * through style for soft-deleted rows plus a restore action for them.
 * ============================================================================
 */
import Link from "next/link";
import { AdminProductsTable } from "./products-table";

export default function AdminProductsPage() {
  return (
    <main dir="rtl" style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>مدیریت محصولات</h1>
        <Link href="/admin/products/new">+ محصول جدید</Link>
      </div>
      <AdminProductsTable />
    </main>
  );
}
