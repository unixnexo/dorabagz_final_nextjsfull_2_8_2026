/**
 * ============================================================================
 * PAGE: /admin/reviews
 * ============================================================================
 * RENDERING: Client Component — same reasoning as other admin pages.
 *
 * DATA SOURCE: see src/server/review/admin-actions.ts
 *   listPendingReviewsAction() -> PendingReviewDTO[] (src/types/review.ts)
 *     { id, orderId, rating, text, userPhoneNumber, productTitles, createdAt }
 *     Only reviews WITH TEXT ever appear here — rating-only reviews are
 *     auto-approved and never need admin attention, per your spec.
 *
 *   approveReviewAction(reviewId) -> makes it publicly visible
 *   rejectReviewAction(reviewId) -> DELETES it outright, no trace kept,
 *     the user is never told (per your spec)
 *
 * Also shown on this page: site-satisfaction ratings (admin-only, never
 * public anywhere) via listSiteSatisfactionRatingsAction()
 *   (src/server/review/site-satisfaction-actions.ts).
 *
 * UI NOTE FOR DESIGN AGENT: pending-review queue (rating, text, which
 * products, reviewer's FULL phone number — admin sees the real number,
 * unlike the masked public version) with approve/reject buttons per row;
 * a separate read-only table for site-satisfaction ratings below.
 * ============================================================================
 */
import { ReviewsManager } from "./reviews-manager";

export default function AdminReviewsPage() {
  return (
    <main dir="rtl" style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>مدیریت نظرات</h1>
      <ReviewsManager />
    </main>
  );
}
