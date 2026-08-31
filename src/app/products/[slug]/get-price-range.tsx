/**
 * Shared price-range calculation — used by both the ProductPrice UI
 * component and generateMetadata/JSON-LD, so the "شروع قیمت از X تا Y"
 * logic lives in exactly one place instead of drifting between the visual
 * component and the SEO fallback description.
 *
 * Param type is intentionally narrowed to just the three fields this
 * actually needs (not the full ProductVariantDTO) — structural typing, so
 * callers that only have a partial variant shape (like generateMetadata's
 * fallback description, which doesn't have id/stock/optionValues) can
 * still pass their data straight in without extra casting.
 *
 * Effective price per variant = discounted price if it has one, else base
 * price. Range collapses to a single value when min === max.
 */
type PricedVariant = {
    price: number;
    discountedPrice: number;
    hasDiscount: boolean;
};

export function getPriceRange(variants: PricedVariant[]) {
    if (variants.length === 0) return null;

    const effectivePrices = variants.map((v) => (v.hasDiscount ? v.discountedPrice : v.price));
    const min = Math.min(...effectivePrices);
    const max = Math.max(...effectivePrices);

    return { min, max, isRange: min !== max };
}