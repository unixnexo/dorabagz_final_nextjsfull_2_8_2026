import type { Order, OrderItem, Payment, Coupon } from "@prisma/client";
import type { OrderListItemDTO, OrderDetailDTO, OrderItemDTO } from "@/types/order";

type FullOrder = Order & {
  items: OrderItem[];
  payment: Payment | null;
  coupon: Coupon | null;
};

function toOrderItemDTO(item: OrderItem): OrderItemDTO {
  return {
    id: item.id,
    variantId: item.variantId,
    productTitle: item.productTitle,
    optionSummary: item.optionSummary,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
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
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

/** Standard include clause used everywhere we need a full order. */
export const fullOrderInclude = {
  items: true,
  payment: true,
  coupon: true,
} as const;
