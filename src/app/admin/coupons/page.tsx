// /**
//  * ============================================================================
//  * PAGE: /admin/coupons
//  * ============================================================================
//  * RENDERING: Client Component — same reasoning as other admin pages.
//  *
//  * DATA SOURCE: see src/server/coupon/actions.ts
//  *   listCouponsAction({page, pageSize, search?}) -> PaginatedResult<CouponDTO>
//  *   createCouponAction(CouponFormInput) -> CouponDTO
//  *   updateCouponAction({id, ...CouponFormInput}) -> CouponDTO
//  *   deleteCouponAction(id) -> soft delete
//  *
//  * CouponDTO shape (src/types/coupon.ts):
//  *   { id, code, type: "PERCENT"|"FIXED", value, maxDiscountAmount,
//  *     scope: "ENTIRE_CART"|"SPECIFIC_PRODUCTS"|"SPECIFIC_CATEGORIES",
//  *     productIds, categoryIds, minOrderAmount, maxUsesPerUser,
//  *     maxTotalUsage, assignedUserId, assignedUserPhone, totalUsageCount,
//  *     expiresAt, isDeleted, createdAt, updatedAt }
//  *
//  * UI NOTE FOR DESIGN AGENT: table with code, type/value, scope, usage
//  * count (e.g. "3 / 10" or "3 / ∞"), expiry, edit/delete actions. Form:
//  * when scope=ENTIRE_CART, product/category pickers are hidden/disabled
//  * (your "gray out" instinct — implemented as hidden here); when
//  * type=FIXED, maxDiscountAmount field is hidden (meaningless for FIXED).
//  * ============================================================================
//  */
// import { CouponsManager } from "./coupons-manager";

// export default function AdminCouponsPage() {
//   return (
//     <main dir="rtl" style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>مدیریت کدهای تخفیف</h1>
//       <CouponsManager />
//     </main>
//   );
// }




/**
 * PAGE: /admin/coupons
 * See src/server/coupon/actions.ts for data source details.
 * Layout (header + nav sheet) is provided by app/admin/layout.tsx.
 */
import { CouponsManager } from "./coupons-manager";

export default function AdminCouponsPage() {
  return (
    <div className="pb-4">
      <CouponsManager />
    </div>
  );
}
