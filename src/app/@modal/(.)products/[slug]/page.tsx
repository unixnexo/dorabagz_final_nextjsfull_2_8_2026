// /**
//  * ============================================================================
//  * INTERCEPTED ROUTE: (.)products/[slug]  — overlay version of /products/[slug]
//  * ============================================================================
//  * Only rendered when navigating to /products/[slug] via client-side <Link>
//  * from a page at the SAME segment level as this @modal slot (i.e. from "/").
//  * A hard refresh or direct URL visit bypasses this entirely and hits the
//  * real src/app/products/[slug]/page.tsx (full SEO page) instead.
//  *
//  * SUSPENSE SPLIT: OverlayShell must mount synchronously (no awaits above
//  * it) so the scale-up animation starts the instant Next.js matches this
//  * route — it does NOT wait on the product fetch. The actual data-fetching
//  * lives in ProductOverlayContent below and is wrapped in <Suspense>, so
//  * only that inner region shows a fallback while data streams in, instead
//  * of the whole app's top-level loading.tsx firing.
//  *
//  * Data-fetching mirrors the real page 1:1 — same actions, same DTOs. If
//  * the real page's fetching logic changes, mirror the change here too.
//  * ============================================================================
//  */
// import { Suspense } from "react";
// import { notFound } from "next/navigation";
// import { getProductBySlugAction } from "@/server/product/actions";
// import { getCurrentUser } from "@/server/user/get-current-user";
// import { getFavoritedProductIdsAction } from "@/server/favorite/actions";
// import { ProductGallery } from "@/app/products/[slug]/product-gallery";
// import { ProductInfoAndActions } from "@/app/products/[slug]/product-info-and-actions";
// import { ProductAccordion } from "@/app/products/[slug]/product-accordion";
// import { OverlayShell } from "./overlay-shell";
// import { OverlayContentSkeleton } from "./overlay-content-skeleton";

// export default async function InterceptedProductPage({
//     params,
// }: {
//     params: Promise<{ slug: string }>;
// }) {
//     // params itself is cheap/sync-ish (route match, not a data fetch) — safe
//     // to await here without delaying the shell's mount in any perceptible way.
//     const { slug: rawSlug } = await params;
//     const slug = decodeURIComponent(rawSlug);

//     return (
//         <OverlayShell slug={slug}>
//             <Suspense fallback={<OverlayContentSkeleton />}>
//                 <ProductOverlayContent slug={slug} />
//             </Suspense>
//         </OverlayShell>
//     );
// }

// async function ProductOverlayContent({ slug }: { slug: string }) {
//     const result = await getProductBySlugAction(slug);
//     if (!result.success) notFound();

//     const product = result.data;

//     const currentUser = await getCurrentUser();
//     const favoritedIdsResult = await getFavoritedProductIdsAction([product.id]);
//     const initiallyFavorited =
//         favoritedIdsResult.success && favoritedIdsResult.data.includes(product.id);

//     const hasDiscount = product.variants.some((v) => v.hasDiscount);

//     return (
//         <>
//             <ProductGallery
//                 images={product.images}
//                 videoUrl={product.videoUrl}
//                 title={product.title}
//                 hasDiscount={hasDiscount}
//                 layoutId={`product-image-${product.slug}`}
//             />

//             <div className="-mt-10 relative z-10 px-5 pt-6 pb-8 space-y-6">
//                 <ProductInfoAndActions product={product} currentUser={currentUser} initiallyFavorited={initiallyFavorited} />
//                 <ProductAccordion product={product} />
//             </div>
//         </>
//     );
// }









/**
 * ============================================================================
 * INTERCEPTED ROUTE: (.)products/[slug]  — overlay version of /products/[slug]
 * ============================================================================
 * Only rendered when navigating to /products/[slug] via client-side <Link>
 * from a page at the SAME segment level as this @modal slot (i.e. from "/").
 * A hard refresh or direct URL visit bypasses this entirely and hits the
 * real src/app/products/[slug]/page.tsx (full SEO page) instead.
 *
 * LOADING BEHAVIOR: intentionally a single async component with everything
 * awaited up front — no inner <Suspense>, no local skeleton. This lets
 * your existing global loader (loading.tsx higher up the tree) own the
 * entire wait; nothing here renders until all data is ready, then
 * OverlayShell mounts already-populated and plays the scale-up animation.
 * If you ever want the shell to mount before data resolves again, that's
 * a deliberate reintroduction of a Suspense split, not this.
 *
 * Data-fetching mirrors the real page 1:1 — same actions, same DTOs. If
 * the real page's fetching logic changes, mirror the change here too.
 * ============================================================================
 */
import { notFound } from "next/navigation";
import { getProductBySlugAction } from "@/server/product/actions";
import { getCurrentUser } from "@/server/user/get-current-user";
import { getFavoritedProductIdsAction } from "@/server/favorite/actions";
import { ProductGallery } from "@/app/products/[slug]/product-gallery";
import { ProductInfoAndActions } from "@/app/products/[slug]/product-info-and-actions";
import { ProductAccordion } from "@/app/products/[slug]/product-accordion";
import { OverlayShell } from "./overlay-shell";

export default async function InterceptedProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug: rawSlug } = await params;
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
        <OverlayShell slug={product.slug}>
            <ProductGallery
                images={product.images}
                videoUrl={product.videoUrl}
                title={product.title}
                hasDiscount={hasDiscount}
                layoutId={`product-image-${product.slug}`}
            />

            <div className="-mt-10 relative z-10 px-5 pt-6 pb-8 space-y-6">
                <ProductInfoAndActions product={product} currentUser={currentUser} initiallyFavorited={initiallyFavorited} />
                <ProductAccordion product={product} />
            </div>
        </OverlayShell>
    );
}

