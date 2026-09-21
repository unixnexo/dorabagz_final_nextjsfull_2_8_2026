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
 *
 * SEO: generateMetadata below builds per-product title/description/OG/
 * Twitter tags, and JSON-LD Product structured data is injected via a
 * <script type="application/ld+json"> tag rendered from this Server
 * Component (safe here — never do this from a client component, since
 * dangerouslySetInnerHTML content must come from trusted server data).
 *
 * NOTE ON DOUBLE-FETCHING: generateMetadata and this page component both
 * call getProductBySlugAction(slug) with the same argument. If that action
 * is built on Next.js's fetch()/data cache, Next.js automatically
 * deduplicates identical calls within one request — this only fetches
 * once. If it's a raw DB call with no caching layer, it will genuinely run
 * twice per request. If that matters, wrap getProductBySlugAction's
 * implementation in React's cache() to force single-flight per request.
 * ============================================================================
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlugAction } from "@/server/product/actions";
import { getCurrentUser } from "@/server/user/get-current-user";
import { getFavoritedProductIdsAction } from "@/server/favorite/actions";
import { getPriceRange } from "./get-price-range";
import { ProductGallery } from "./product-gallery";
import { ProductInfoAndActions } from "./product-info-and-actions";
import { ProductAccordion } from "./product-accordion";

const SITE_NAME = "درا بگز";
const SITE_URL = "https://dorabagz.ir";

/**
 * Builds a fallback meta description ("title + price + category") for
 * products with no description field set. Kept next to generateMetadata
 * since it's SEO-specific text generation, not reused by the UI.
 */
function buildFallbackDescription(product: {
  title: string;
  categoryTitle: string | null;
  variants: { price: number; discountedPrice: number; hasDiscount: boolean }[];
}) {
  const range = getPriceRange(product.variants);
  const priceText = range
    ? range.isRange
      ? `از ${range.min.toLocaleString("fa-IR")} تا ${range.max.toLocaleString("fa-IR")} تومن`
      : `${range.min.toLocaleString("fa-IR")} تومن`
    : null;

  const parts = [product.title];
  if (product.categoryTitle) parts.push(`از دسته ${product.categoryTitle}`);
  if (priceText) parts.push(`با قیمت ${priceText}`);
  parts.push(`خرید آنلاین از ${SITE_NAME}.`);

  return parts.join(" — ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const result = await getProductBySlugAction(slug);
  if (!result.success) {
    // let the page component's own notFound() handle the 404 render —
    // metadata just needs to not crash if the product doesn't exist.
    return {};
  }

  const product = result.data;

  const description = product.description?.trim() || buildFallbackDescription(product);

  const mainImage =
    product.images.find((img) => img.isMain) ?? product.images[0];

  const canonicalPath = `/products/${product.slug}`;

  return {
    title: `${product.title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      title: product.title,
      description,
      images: [
        {
          url: mainImage.url,
          width: 1200,
          height: 1200,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [mainImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

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

  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
  const priceRange = getPriceRange(product.variants);
  const inStock = product.variants.some((v) => v.stock > 0);

  // JSON-LD Product structured data — one of the biggest levers for how
  // products appear in Google search results (price/availability shown
  // directly in the result). aggregateRating is intentionally OMITTED:
  // ProductDetailDTO carries no average-rating/review-count field, and
  // Google penalizes review markup that isn't backed by real displayed
  // reviews. Add it here once that data exists — don't fabricate it.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.images.map((img) => img.url),
    sku: product.productCode,
    ...(product.categoryTitle && {
      category: product.categoryTitle,
    }),
    offers: priceRange
      ? {
        "@type": priceRange.isRange ? "AggregateOffer" : "Offer",
        priceCurrency: "IRR",
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: `${SITE_URL}/products/${product.slug}`,
        ...(priceRange.isRange
          ? { lowPrice: priceRange.min, highPrice: priceRange.max }
          : { price: priceRange.min }),
      }
      : undefined,
  };

  return (
    <div className="min-h-dvh overflow-x-hidden">
      {/* JSON-LD structured data for Google rich results — static server-
         rendered content, safe to inject directly */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

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


