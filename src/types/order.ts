export type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type CourierType = "SNAPP_BOX" | "TIPAX";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type OrderItemDTO = {
  id: string;
  variantId: string | null;
  productTitle: string; // snapshot at order time
  optionSummary: string | null; // e.g. "Size: SM / Color: Red", snapshot
  unitPrice: number; // Toman, snapshot
  quantity: number;
  /** Pulled live from the related product (NOT part of the order
   *  snapshot) — so these reflect the product's CURRENT slug/image, not
   *  what they were at order time. Null when the variant (and therefore
   *  the product link) has since been deleted — variantId is nullable
   *  for the same reason (schema uses onDelete: SetNull on OrderItem.variant
   *  specifically so order history survives product deletion). */
  productSlug: string | null;
  productImage: string | null;
};

/** Row shape for order lists (user's /dashboard/orders, admin order list). */
export type OrderListItemDTO = {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number; // sum of item quantities
  courierType: CourierType;
  paymentStatus: PaymentStatus | null; // null if Payment row somehow missing
  createdAt: string;
};

/** Full shape for a single order's detail page (user or admin view). */
export type OrderDetailDTO = {
  id: string;
  status: OrderStatus;

  receiverFullName: string;
  receiverPhone: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  courierType: CourierType;

  items: OrderItemDTO[];

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  couponCode: string | null;

  paymentStatus: PaymentStatus | null;
  paymentRefId: string | null;

  /** Whether this order already has a review submitted — used to show/
   *  hide the review form on the order detail page (Module 7). A review
   *  is locked once submitted, no edit/delete exists, so this is a
   *  one-way flag. */
  hasReview: boolean;

  createdAt: string;
  updatedAt: string;
};

/** Shape returned right after checkout creates the order — the frontend
 *  uses `paymentUrl` to redirect the browser to ZarinPal. */
export type CheckoutResultDTO = {
  orderId: string;
  paymentUrl: string;
};
