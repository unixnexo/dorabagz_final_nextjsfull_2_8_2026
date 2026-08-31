import type {
  Order,
  OrderItem,
  Payment,
  Coupon,
  ProductReview,
  ProductVariant,
  Product,
  ProductImage,
} from "@prisma/client";
import type { OrderListItemDTO, OrderDetailDTO, OrderItemDTO } from "@/types/order";

// OrderItem.variant is nullable (schema uses onDelete: SetNull specifically
// so order history survives product deletion) — so the product chain
// hanging off it is nullable too.
type FullOrderItem = OrderItem & {
  variant: (ProductVariant & { product: Product & { images: ProductImage[] } }) | null;
};

type FullOrder = Order & {
  items: FullOrderItem[];
  payment: Payment | null;
  coupon: Coupon | null;
  review: ProductReview | null;
};

function toOrderItemDTO(item: FullOrderItem): OrderItemDTO {
  const product = item.variant?.product ?? null;
  const mainImage = product?.images.find((img) => img.isMain) ?? product?.images[0] ?? null;

  return {
    id: item.id,
    variantId: item.variantId,
    productTitle: item.productTitle,
    optionSummary: item.optionSummary,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    productSlug: product?.slug ?? null,
    productImage: mainImage?.url ?? null,
  };
}

export function toOrderListItemDTO(order: FullOrder): OrderListItemDTO {
  return {
    id: order.id,
    status: order.status,
    totalAmount: order.totalAmount,
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    courierType: order.courierType,
    paymentStatus: order.payment?.status ?? null,
    createdAt: order.createdAt.toISOString(),
  };
}

export function toOrderDetailDTO(order: FullOrder): OrderDetailDTO {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    receiverFullName: order.receiverFullName,
    receiverPhone: order.receiverPhone,
    province: order.province,
    city: order.city,
    fullAddress: order.fullAddress,
    postalCode: order.postalCode,
    courierType: order.courierType,
    items: order.items.map(toOrderItemDTO),
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount,
    couponCode: order.coupon?.code ?? null,
    paymentStatus: order.payment?.status ?? null,
    paymentRefId: order.payment?.refId ?? null,
    hasReview: !!order.review,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

/** Standard include clause used everywhere we need a full order. `items`
 *  now pulls each item's variant -> product -> images chain (nullable
 *  throughout, since a variant/product can be deleted after the order
 *  was placed) so the mapper can attach live productSlug/productImage
 *  without a second query. */
export const fullOrderInclude = {
  items: { include: { variant: { include: { product: { include: { images: true } } } } } },
  payment: true,
  coupon: true,
  review: true,
} as const;
