/**
 * Pure discount-pricing logic, separated from DB access for easy testing
 * (see tests/discount-pricing.test.ts) — same pattern as coupon-pricing.ts.
 */

export type DiscountGroupForPricing = {
  id: string;
  type: "PERCENT" | "FIXED";
  value: number;
  startAt: Date | null;
  endAt: Date | null;
  isDeleted: boolean;
  productIds: string[];
  categoryIds: string[];
};

export type VariantForDiscountPricing = {
  price: number;
  productId: string;
  categoryId: string | null;
};

export type DiscountResult = {
  hasDiscount: boolean;
  originalPrice: number;
  discountedPrice: number;
  discountGroupId: string | null;
};

function isGroupActiveNow(group: DiscountGroupForPricing, now: Date): boolean {
  if (group.isDeleted) return false;
  if (group.startAt && group.startAt.getTime() > now.getTime()) return false;
  if (group.endAt && group.endAt.getTime() < now.getTime()) return false;
  return true;
}

function groupTargetsVariant(group: DiscountGroupForPricing, variant: VariantForDiscountPricing): boolean {
  if (group.productIds.includes(variant.productId)) return true;
  if (variant.categoryId && group.categoryIds.includes(variant.categoryId)) return true;
  return false;
}

function computeDiscountAmount(group: DiscountGroupForPricing, originalPrice: number): number {
  const raw = group.type === "FIXED" ? group.value : Math.floor((originalPrice * group.value) / 100);
  return Math.min(raw, originalPrice);
}

/**
 * Finds every active group that targets this variant and applies the
 * single BEST (largest) discount — per your confirmed spec, overlapping
 * groups don't stack, the customer gets whichever saves them the most.
 */
export function computeVariantDiscount(
  groups: DiscountGroupForPricing[],
  variant: VariantForDiscountPricing,
  now: Date = new Date()
): DiscountResult {
  const applicableGroups = groups.filter(
    (g) => isGroupActiveNow(g, now) && groupTargetsVariant(g, variant)
  );

  if (applicableGroups.length === 0) {
    return {
      hasDiscount: false,
      originalPrice: variant.price,
      discountedPrice: variant.price,
      discountGroupId: null,
    };
  }

  let bestGroup = applicableGroups[0];
  let bestDiscountAmount = computeDiscountAmount(bestGroup, variant.price);

  for (const group of applicableGroups.slice(1)) {
    const amount = computeDiscountAmount(group, variant.price);
    if (amount > bestDiscountAmount) {
      bestGroup = group;
      bestDiscountAmount = amount;
    }
  }

  return {
    hasDiscount: bestDiscountAmount > 0,
    originalPrice: variant.price,
    discountedPrice: variant.price - bestDiscountAmount,
    discountGroupId: bestDiscountAmount > 0 ? bestGroup.id : null,
  };
}
