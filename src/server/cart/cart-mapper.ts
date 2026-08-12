import type {
  CartItem,
  ProductVariant,
  Product,
  ProductImage,
  VariantOptionValue,
  ProductOptionValue,
  ProductOption,
} from "@prisma/client";
import type { CartItemDTO, CartSummaryDTO } from "@/types/cart";
import { computeVariantDiscount, type DiscountGroupForPricing } from "@/lib/discount-pricing";

type FullCartItem = CartItem & {
  variant: ProductVariant & {
    product: Product & { images: ProductImage[] };
    optionValues: (VariantOptionValue & {
      optionValue: ProductOptionValue & { option: ProductOption };
    })[];
  };
};

/** `discountGroups` defaults to [] for call sites that don't care (rare)
 *  — every real cart-rendering call site MUST pass the active groups
 *  (see getActiveDiscountGroupsForPricing) or the cart will silently
 *  charge full price on discounted items. */
export function toCartItemDTO(item: FullCartItem, discountGroups: DiscountGroupForPricing[] = []): CartItemDTO {
  const mainImage =
    item.variant.product.images.find((i) => i.isMain) ?? item.variant.product.images[0] ?? null;

  const optionValues: Record<string, string> = {};
  for (const link of item.variant.optionValues) {
    optionValues[link.optionValue.option.name] = link.optionValue.value;
  }

  const pricing = computeVariantDiscount(discountGroups, {
    price: item.variant.price,
    productId: item.variant.productId,
    categoryId: item.variant.product.categoryId,
  });

  return {
    id: item.id,
    variantId: item.variantId,
    productId: item.variant.productId,
    productTitle: item.variant.product.title,
    productSlug: item.variant.product.slug,
    mainImageUrl: mainImage?.url ?? null,
    optionValues,
    price: pricing.discountedPrice, // effective price — what's actually charged
    originalPrice: pricing.originalPrice,
    hasDiscount: pricing.hasDiscount,
    stock: item.variant.stock,
    quantity: item.quantity,
  };
}

export function toCartSummaryDTO(items: CartItemDTO[]): CartSummaryDTO {
  return {
    items,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

/** Standard include clause for fetching a cart item with everything the
 *  mapper needs. */
export const fullCartItemInclude = {
  variant: {
    include: {
      product: { include: { images: true } },
      optionValues: { include: { optionValue: { include: { option: true } } } },
    },
  },
} as const;
