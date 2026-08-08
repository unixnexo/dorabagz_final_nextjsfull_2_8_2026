/**
 * ============================================================================
 * PAGE: /admin/products/[id]/edit
 * ============================================================================
 * RENDERING: Server Component (shell) fetches the existing product data,
 * then hands off to the same client ProductForm used for "new", in "edit"
 * mode (passing `existing`).
 *
 * DATA SOURCE: getProductByIdAction(id) -> ProductDetailDTO (src/types/product.ts)
 * ============================================================================
 */
import { notFound } from "next/navigation";
import { getProductByIdAction } from "@/server/product/actions";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProductByIdAction(id);
  if (!result.success) notFound();

  return (
    <main dir="rtl" style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>ویرایش محصول</h1>
      <ProductForm existing={result.data} />
    </main>
  );
}
