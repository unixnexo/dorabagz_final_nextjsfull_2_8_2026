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