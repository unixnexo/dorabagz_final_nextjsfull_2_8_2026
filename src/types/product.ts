/**
 * Product DTOs — the exact shapes returned by server actions/API routes.
 * The UI/design agent should treat this file as the source of truth for
 * "what data is available to render."
 */

export type ProductImageDTO = {
  id: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
};

export type ProductSpecificationDTO = {
  id: string;
  key: string;
  value: string;
  sortOrder: number;
};

export type ProductOptionValueDTO = {
  id: string;
  value: string; // e.g. "Red", "SM"
};

export type ProductOptionDTO = {
  id: string;
  name: string; // e.g. "Size", "Color"
  values: ProductOptionValueDTO[];
};

/** A single purchasable SKU, with its option-value combination flattened
 *  into a simple map for easy rendering, e.g. { "Size": "SM", "Color": "Red" }.
 *  If the product has no real options, `optionValues` is an empty object
 *  and there will be exactly one variant for the product.
 *
 *  Pricing (Module 9): `price` is always the ORIGINAL price. If an active
 *  discount group applies, `discountedPrice` is lower and `hasDiscount`
 *  is true — show `price` with strikethrough next to `discountedPrice`.
 *  When there's no discount, `discountedPrice` simply equals `price`. */
export type ProductVariantDTO = {
  id: string;
  price: number; // Toman, ORIGINAL price
  discountedPrice: number; // equals `price` when hasDiscount is false
  hasDiscount: boolean;
  stock: number;
  optionValues: Record<string, string>; // optionName -> optionValue
};

/** Row shape for product listing pages (home page grid, admin table). */
export type ProductListItemDTO = {
  id: string;
  title: string;
  slug: string;
  productCode: string;
  mainImageUrl: string | null;
  categoryId: string | null;
  categoryTitle: string | null;
  isDeleted: boolean;
  createdAt: string;
  // Derived summary fields, computed from variants — useful for list/grid
  // cards without needing to fetch every variant:
  minPrice: number; // lowest ORIGINAL variant price
  maxPrice: number; // highest ORIGINAL variant price
  minDiscountedPrice: number; // lowest price AFTER any active discount
  maxDiscountedPrice: number; // highest price AFTER any active discount
  hasDiscount: boolean; // true if ANY variant has an active discount
  totalStock: number; // sum of all variant stock
};

/** Full shape for the product detail page and admin edit form. */
export type ProductDetailDTO = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  productCode: string;
  videoUrl: string | null;
  categoryId: string | null;
  categoryTitle: string | null;
  images: ProductImageDTO[];
  specifications: ProductSpecificationDTO[];
  options: ProductOptionDTO[];
  variants: ProductVariantDTO[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Shape sent by the admin form when creating/updating a product.
 *  See src/lib/validations/product.ts for the exact Zod schema. */
export type ProductFormInput = {
  title: string;
  description?: string;
  categoryId?: string | null;
  videoUrl?: string | null;
  images: { url: string; isMain: boolean; sortOrder: number }[];
  specifications: { key: string; value: string; sortOrder: number }[];
  // Options + variants arrive together: each variant references option
  // values by their NAME/VALUE strings (not DB ids), since options may be
  // brand new (not yet saved) when the admin submits the form.
  options: { name: string; values: string[] }[];
  variants: {
    price: number;
    stock: number;
    optionValues: Record<string, string>; // optionName -> value, must match `options` above
  }[];
};
