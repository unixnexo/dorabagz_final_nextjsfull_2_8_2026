import type { ProductReview } from "@prisma/client";
import { maskPhoneNumber } from "@/lib/mask-phone";
import type { ProductReviewDTO, PendingReviewDTO } from "@/types/review";

export function toProductReviewDTO(
  review: ProductReview & { user: { phoneNumber: string } }
): ProductReviewDTO {
  return {
    id: review.id,
    rating: review.rating,
    text: review.text,
    maskedPhoneNumber: maskPhoneNumber(review.user.phoneNumber),
    createdAt: review.createdAt.toISOString(),
  };
}

export function toPendingReviewDTO(
  review: ProductReview & {
    user: { phoneNumber: string };
    order: { items: { productTitle: string }[] };
  }
): PendingReviewDTO {
  return {
    id: review.id,
    orderId: review.orderId,
    rating: review.rating,
    text: review.text,
    userPhoneNumber: review.user.phoneNumber,
    productTitles: review.order.items.map((i) => i.productTitle),
    createdAt: review.createdAt.toISOString(),
  };
}
