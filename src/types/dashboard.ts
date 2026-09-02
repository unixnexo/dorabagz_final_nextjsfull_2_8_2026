/**
 * Admin dashboard overview — a system-state snapshot (counts only), shown
 * as clickable cards on /admin, distinct from the detailed income/sales
 * Reports page (Module 6, at /admin/reports).
 */
export type AdminDashboardCardId =
  | "pendingOrders"
  | "totalUsers"
  | "pendingReviews"
  | "totalCategories"
  | "totalProducts"
  | "totalStories"
  | "activeCoupons"
  | "discountedProducts";

export type AdminDashboardOverviewDTO = {
  pendingOrders: number; // orders with status = PENDING
  totalUsers: number; // all users, any role, isActive or not (a full headcount)
  pendingReviews: number; // ProductReview rows with status = PENDING (has text, awaiting approval)
  totalCategories: number; // non-deleted categories, parents + children combined
  totalProducts: number; // non-deleted products
  totalStories: number; // non-deleted stories (active OR expired — see note on the page)
  activeCoupons: number; // non-deleted coupons currently within their date window (or no window) — NOT counting usage limits
  discountedProducts: number; // distinct products currently covered by at least one active DiscountGroup
};
