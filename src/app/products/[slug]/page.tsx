// /**
//  * ============================================================================
//  * PAGE: /products/[slug]
//  * ============================================================================
//  * RENDERING: Server Component — product detail pages are prime SEO real
//  * estate (title, description, price shown to search engines/crawlers).
//  * The "add to cart / add to favorite" buttons are a small client island
//  * (src/app/products/[slug]/product-actions.tsx) since they need interactivity
//  * and Zustand/TanStack Query access.
//  *
//  * DATA SOURCE: getProductBySlugAction(slug) (see src/server/product/actions.ts)
//  *   output: ProductDetailDTO (see src/types/product.ts)
//  *     {
//  *       id, title, description, slug, productCode, videoUrl,
//  *       categoryId, categoryTitle,
//  *       images: ProductImageDTO[]            // { id, url, isMain, sortOrder }
//  *       specifications: ProductSpecificationDTO[]  // { id, key, value, sortOrder }
//  *       options: ProductOptionDTO[]          // { id, name, values: [{id, value}] }
//  *       variants: ProductVariantDTO[]        // { id, price, stock, optionValues: {optionName: value} }
//  *       isDeleted, createdAt, updatedAt
//  *     }
//  *
//  * VARIANT SELECTION LOGIC (for whoever builds the UI): the buyer picks one
//  * value per option (e.g. Size=SM, Color=Red); match that combination against
//  * `variants[].optionValues` to find the matching variant's id/price/stock.
//  * If `options` is empty, there is exactly one variant with no optionValues —
//  * skip the picker entirely and use that variant directly.
//  *
//  * CART: add-to-cart works for guests too (stored in browser, merged into
//  * DB on login) — see src/hooks/use-cart.ts and src/store/guest-cart-store.ts.
//  * FAVORITES: requires login — a guest clicking it is told to log in.
//  *
//  * UI NOTE FOR DESIGN AGENT: image gallery (images[], mark isMain first),
//  * optional video player (videoUrl), title/description, spec table
//  * (specifications[]), variant picker built from options[] + variants[],
//  * quantity input (capped at selected variant's stock), price + stock of the
//  * selected variant, add-to-cart / add-to-favorite (heart icon) buttons.
//  * ============================================================================
//  */
// import { notFound } from "next/navigation";
// import { getProductBySlugAction } from "@/server/product/actions";
// import { getCurrentUser } from "@/server/user/get-current-user";
// import { getFavoritedProductIdsAction } from "@/server/favorite/actions";
// import { ProductActions } from "./product-actions";
// import { ProductReviews } from "./product-reviews";

// export default async function ProductDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug: rawSlug } = await params;

//   // Next.js route params SHOULD arrive already URL-decoded, but in
//   // practice (confirmed via debugging) this route was receiving the
//   // still-percent-encoded value (e.g. "%D9%85%D8%AD..." instead of the
//   // actual Persian slug) — so every lookup failed and 404'd even for
//   // real, existing products. Decoding explicitly here fixes it and is
//   // safe even if a future Next.js version DOES decode automatically:
//   // decodeURIComponent on an already-decoded string with no remaining
//   // %XX sequences is a no-op.
//   const slug = decodeURIComponent(rawSlug);

//   const result = await getProductBySlugAction(slug);
//   if (!result.success) notFound();

//   const product = result.data;

//   const currentUser = await getCurrentUser();
//   const favoritedIdsResult = await getFavoritedProductIdsAction([product.id]);
//   const initiallyFavorited =
//     favoritedIdsResult.success && favoritedIdsResult.data.includes(product.id);

//   return (
//     <main dir="rtl" style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//         {product.images.map((img) => (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             key={img.id}
//             src={img.url}
//             alt={product.title}
//             style={{
//               width: 150,
//               height: 150,
//               objectFit: "cover",
//               border: img.isMain ? "2px solid blue" : "1px solid #ddd",
//             }}
//           />
//         ))}
//       </div>

//       {product.videoUrl && (
//         <video controls style={{ width: "100%", maxWidth: 400, marginTop: 16 }}>
//           <source src={product.videoUrl} />
//         </video>
//       )}

//       <h1>{product.title}</h1>
//       <p>کد محصول: {product.productCode}</p>
//       {product.categoryTitle && <p>دسته: {product.categoryTitle}</p>}
//       {product.description && <p>{product.description}</p>}

//       {product.specifications.length > 0 && (
//         <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", marginTop: 16 }}>
//           <tbody>
//             {product.specifications.map((spec) => (
//               <tr key={spec.id}>
//                 <td>{spec.key}</td>
//                 <td>{spec.value}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <ProductActions product={product} currentUser={currentUser} initiallyFavorited={initiallyFavorited} />

//       <ProductReviews productId={product.id} />
//     </main>
//   );
// }


/**
 * ============================================================================
 * PAGE: /products/[slug]
 * ============================================================================
 * RENDERING: Server Component — product detail pages are prime SEO real
 * estate (title, description, price shown to search engines/crawlers).
 * Interactive pieces (gallery lightbox, variant picker, add-to-cart,
 * favorite toggle, reviews pagination) are split into client islands below.
 *
 * DATA SOURCE: getProductBySlugAction(slug) (see src/server/product/actions.ts)
 *   output: ProductDetailDTO (see src/types/product.ts)
 * ============================================================================
 */
import { notFound } from "next/navigation";
import { getProductBySlugAction } from "@/server/product/actions";
import { getCurrentUser } from "@/server/user/get-current-user";
import { getFavoritedProductIdsAction } from "@/server/favorite/actions";
import { ProductGallery } from "./product-gallery";
import { ProductInfoAndActions } from "./product-info-and-actions";
import { ProductAccordion } from "./product-accordion";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;

  // Next.js route params SHOULD arrive already URL-decoded, but in
  // practice this route was receiving the still-percent-encoded value
  // (e.g. "%D9%85%D8%AD..." instead of the actual Persian slug) — so
  // every lookup failed and 404'd even for real, existing products.
  // Decoding explicitly here fixes it and is safe even if a future
  // Next.js version DOES decode automatically: decodeURIComponent on an
  // already-decoded string with no remaining %XX sequences is a no-op.
  const slug = decodeURIComponent(rawSlug);

  const result = await getProductBySlugAction(slug);
  if (!result.success) notFound();

  const product = result.data;

  const currentUser = await getCurrentUser();
  const favoritedIdsResult = await getFavoritedProductIdsAction([product.id]);
  const initiallyFavorited =
    favoritedIdsResult.success && favoritedIdsResult.data.includes(product.id);

  const hasDiscount = product.variants.some((v) => v.hasDiscount);

  return (
    <div className="min-h-dvh overflow-x-hidden">
      <ProductGallery
        images={product.images}
        videoUrl={product.videoUrl}
        title={product.title}
        hasDiscount={hasDiscount}
      />

      <div className="-mt-10 relative z-10 rounded-t-[28px] px-5 pt-6 pb-8 space-y-6">
        <ProductInfoAndActions
          product={product}
          currentUser={currentUser}
          initiallyFavorited={initiallyFavorited}
        />

        <ProductAccordion product={product} />
      </div>
    </div>
  );
}