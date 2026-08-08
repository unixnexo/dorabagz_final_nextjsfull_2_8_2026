/**
 * ============================================================================
 * PAGE: /products/[slug]
 * ============================================================================
 * RENDERING: Server Component — product detail pages are prime SEO real
 * estate (title, description, price shown to search engines/crawlers).
 * The "add to cart / add to favorite" buttons are a small client island
 * (they need interactivity + will need cart/favorite state once those
 * modules exist — for now they're stubbed, see note below).
 *
 * DATA SOURCE: getProductBySlugAction(slug) (see src/server/product/actions.ts)
 *   output: ProductDetailDTO (see src/types/product.ts)
 *     {
 *       id, title, description, slug, productCode, videoUrl,
 *       categoryId, categoryTitle,
 *       images: ProductImageDTO[]            // { id, url, isMain, sortOrder }
 *       specifications: ProductSpecificationDTO[]  // { id, key, value, sortOrder }
 *       options: ProductOptionDTO[]          // { id, name, values: [{id, value}] }
 *       variants: ProductVariantDTO[]        // { id, price, stock, optionValues: {optionName: value} }
 *       isDeleted, createdAt, updatedAt
 *     }
 *
 * VARIANT SELECTION LOGIC (for whoever builds the UI): the buyer picks one
 * value per option (e.g. Size=SM, Color=Red); match that combination against
 * `variants[].optionValues` to find the matching variant's id/price/stock.
 * If `options` is empty, there is exactly one variant with no optionValues —
 * skip the picker entirely and use that variant directly.
 *
 * NOTE: Add-to-cart / Add-to-favorite are STUBBED here (console.log) —
 * real wiring happens in the Cart/Favorites modules.
 *
 * UI NOTE FOR DESIGN AGENT: image gallery (images[], mark isMain first),
 * optional video player (videoUrl), title/description, spec table
 * (specifications[]), variant picker built from options[] + variants[],
 * price + stock of the selected variant, add-to-cart / add-to-favorite buttons.
 * ============================================================================
 */
import { notFound } from "next/navigation";
import { getProductBySlugAction } from "@/server/product/actions";
import { ProductActions } from "./product-actions";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProductBySlugAction(slug);
  if (!result.success) notFound();

  const product = result.data;

  return (
    <main dir="rtl" style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {product.images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.id}
            src={img.url}
            alt={product.title}
            style={{
              width: 150,
              height: 150,
              objectFit: "cover",
              border: img.isMain ? "2px solid blue" : "1px solid #ddd",
            }}
          />
        ))}
      </div>

      {product.videoUrl && (
        <video controls style={{ width: "100%", maxWidth: 400, marginTop: 16 }}>
          <source src={product.videoUrl} />
        </video>
      )}

      <h1>{product.title}</h1>
      <p>کد محصول: {product.productCode}</p>
      {product.categoryTitle && <p>دسته: {product.categoryTitle}</p>}
      {product.description && <p>{product.description}</p>}

      {product.specifications.length > 0 && (
        <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", marginTop: 16 }}>
          <tbody>
            {product.specifications.map((spec) => (
              <tr key={spec.id}>
                <td>{spec.key}</td>
                <td>{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ProductActions product={product} />
    </main>
  );
}
