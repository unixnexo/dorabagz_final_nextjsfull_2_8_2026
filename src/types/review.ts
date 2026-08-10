/**
 * Review DTOs.
 */

/** A single approved review shown on a product's detail page. The
 *  reviewer's phone number is MASKED (first 4 + last 3 digits shown,
 *  middle 4 replaced with ****) per your spec — never return the full
 *  number, since we don't collect usernames but still want SOME way to
 *  tell reviewers apart on the page. */
export type ProductReviewDTO = {
  id: string;
  rating: number; // 1-5
  text: string | null;
  maskedPhoneNumber: string; // e.g. "0912****789"
  createdAt: string;
};

/** Admin's pending-approval queue row — shows more context than the
 *  public DTO (which order, which products were in it) so admin can
 *  judge the review properly. */
export type PendingReviewDTO = {
  id: string;
  orderId: string;
  rating: number;
  text: string | null;
  userPhoneNumber: string; // full number, admin-only view
  productTitles: string[]; // products that were in this order
  createdAt: string;
};

/** Shape sent when a user submits their post-delivery order review. */
export type SubmitReviewInput = {
  orderId: string;
  rating: number; // 1-5
  text?: string;
};

/** Result of checking whether the current user has any COMPLETED orders
 *  still awaiting a review — used to decide whether to show the "please
 *  review your order" prompt (e.g. randomly on the home page). */
export type ReviewableOrderDTO = {
  orderId: string;
  productTitles: string[]; // what was in the order, for prompt copy
  completedAt: string;
};

/** Site-satisfaction popup submission. */
export type SubmitSiteSatisfactionInput = {
  rating: number; // 1-5
  text?: string;
};

export type PopupType = "ORDER_REVIEW_PROMPT" | "SITE_SATISFACTION";
