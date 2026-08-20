/**
 * PAGE: /admin/products/[id]
 * Read-only detail view for a single product — full images, specs,
 * options, and per-variant price/stock. Edit and delete actions live
 * here as explicit buttons; this page itself does not mutate anything
 * except via ProductDetailActions (delete/restore toggle).
 * See src/server/product/actions.ts for data source details.
 * Layout (header + nav sheet) is provided by app/admin/layout.tsx.
 */
import { notFound } from "next/navigation";
import { getProductByIdAction } from "@/server/product/actions";
import { ProductFormHeader } from "@/components/admin/products/product-form-header";
import { ProductDetailView } from "@/components/admin/products/product-detail-view";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getProductByIdAction(id);
    if (!result.success) notFound();

    return (
        <div className="pb-8">
            <ProductFormHeader title="جزئیات محصول" />
            <ProductDetailView product={result.data} />
        </div>
    );
}