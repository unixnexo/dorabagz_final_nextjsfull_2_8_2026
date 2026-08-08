/**
 * ============================================================================
 * PAGE: /admin/products/new
 * ============================================================================
 * RENDERING: Client Component (the form itself needs heavy interactivity —
 * dynamic options/variants, immediate image/video upload).
 *
 * DATA SENT on submit: ProductFormInput shape, see src/types/product.ts
 * and src/lib/validations/product.ts for the exact Zod schema.
 *
 * See src/app/admin/products/product-form.tsx for the full field-by-field
 * breakdown — this page just renders it in "create" mode (no `existing` prop).
 * ============================================================================
 */
import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <main dir="rtl" style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>محصول جدید</h1>
      <ProductForm />
    </main>
  );
}
