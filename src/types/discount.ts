export type DiscountType = "PERCENT" | "FIXED";

/** Admin list/detail row. Membership shown as simple id lists — admin can
 *  remove ONE product or category from a group without touching the
 *  rest (per your spec: "he can't edit one item in a group, only remove
 *  it or edit/delete the whole group"). */
export type DiscountGroupDTO = {
  id: string;
  title: string; // admin-facing only, never shown to customers
  type: DiscountType;
  value: number;
  startAt: string | null; // null = no start restriction (already active)
  endAt: string | null; // null = no end restriction (never auto-expires)
  productIds: string[];
  productTitles: string[]; // parallel array, for display without a second fetch
  categoryIds: string[];
  categoryTitles: string[]; // parallel array
  isActive: boolean; // computed: not deleted AND within [startAt, endAt] right now
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Shape sent by the admin create/edit form. */
export type DiscountGroupFormInput = {
  title: string;
  type: DiscountType;
  value: number;
  startAt?: string | null; // ISO datetime string, or null/omitted for "always on"
  endAt?: string | null;
  productIds: string[];
  categoryIds: string[];
};

/** Attached to a product/variant DTO wherever pricing is shown to
 *  customers — lets the frontend render strikethrough original price +
 *  discounted price without needing to know anything about groups. */
export type VariantPriceInfo = {
  originalPrice: number;
  discountedPrice: number;
  hasDiscount: boolean;
};
