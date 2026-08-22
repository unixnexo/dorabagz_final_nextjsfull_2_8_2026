// /**
//  * ============================================================================
//  * PAGE: /admin/discounts
//  * ============================================================================
//  * RENDERING: Client Component — same reasoning as other admin pages.
//  *
//  * DATA SOURCE: see src/server/discount/actions.ts
//  *   listDiscountGroupsAction() -> DiscountGroupDTO[] (src/types/discount.ts)
//  *     { id, title, type: "PERCENT"|"FIXED", value, startAt, endAt,
//  *       productIds, productTitles, categoryIds, categoryTitles,
//  *       isActive, isDeleted, createdAt, updatedAt }
//  *   createDiscountGroupAction(DiscountGroupFormInput)
//  *   updateDiscountGroupAction({id, ...DiscountGroupFormInput}) — replaces
//  *     the WHOLE group's terms + membership, per your spec ("edit the
//  *     whole group, never one item")
//  *   removeProductFromGroupAction(groupId, productId) — surgical: removes
//  *     just one product, leaves the rest of the group untouched
//  *   removeCategoryFromGroupAction(groupId, categoryId) — same, for categories
//  *   deleteDiscountGroupAction(id) — removes the discount from EVERY
//  *     member at once
//  *
//  * IMPORTANT PRICING RULE (Module 9): a group targets a UNION of its
//  * linked products and categories (not mutually exclusive scopes like
//  * coupons). If a variant is targeted by more than one active group at
//  * once, the customer gets whichever discount is LARGER — groups never
//  * stack. Category targeting automatically includes child categories.
//  *
//  * UI NOTE FOR DESIGN AGENT: list of discount groups showing type/value,
//  * active/scheduled/expired badge (computed from startAt/endAt), member
//  * chips (products + categories) each with its own small "x" to remove
//  * just that one member, and a create/edit form (title, type, value,
//  * optional start/end datetime, multi-select product AND category
//  * pickers together).
//  * ============================================================================
//  */
// import { DiscountsManager } from "./discounts-manager";

// export default function AdminDiscountsPage() {
//   return (
//     <main dir="rtl" style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>مدیریت تخفیف محصولات</h1>
//       <DiscountsManager />
//     </main>
//   );
// }




/**
 * PAGE: /admin/discounts
 * See src/server/discount/actions.ts for data source details.
 * Layout (header + nav sheet) is provided by app/admin/layout.tsx.
 */
import { DiscountsManager } from "./discounts-manager";

export default function AdminDiscountsPage() {
  return (
    <div className="pb-4">
      <DiscountsManager />
    </div>
  );
}
