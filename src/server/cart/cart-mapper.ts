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

type FullCartItem = CartItem & {
  variant: ProductVariant & {
    product: Product & { images: ProductImage[] };
    optionValues: (VariantOptionValue & {
      optionValue: ProductOptionValue & { option: ProductOption };
    })[];
  };
};

export function toCartItemDTO(item: FullCartItem): CartItemDTO {
  const mainImage =
    item.variant.product.images.find((i) => i.isMain) ?? item.variant.product.images[0] ?? null;

  const optionValues: Record<string, string> = {};
  for (const link of item.variant.optionValues) {
    optionValues[link.optionValue.option.name] = link.optionValue.value;
  }

  return {
    id: item.id,
    variantId: item.variantId,
    productId: item.variant.productId,
    productTitle: item.variant.product.title,
    productSlug: item.variant.product.slug,
    mainImageUrl: mainImage?.url ?? null,
    optionValues,
    price: item.variant.price,
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
