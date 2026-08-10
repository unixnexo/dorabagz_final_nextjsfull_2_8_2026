import { z } from "zod";

export const submitReviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(2000).optional(),
});
export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

export const submitSiteSatisfactionSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().max(2000).optional(),
});
export type SubmitSiteSatisfactionInput = z.infer<typeof submitSiteSatisfactionSchema>;

export const productReviewListQuerySchema = z.object({
  productId: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type ProductReviewListQuery = z.infer<typeof productReviewListQuerySchema>;

export const dismissPopupSchema = z.object({
  popupType: z.enum(["ORDER_REVIEW_PROMPT", "SITE_SATISFACTION"]),
});
export type DismissPopupInput = z.infer<typeof dismissPopupSchema>;
