// /**
//  * ============================================================================
//  * PAGE: /admin/stories
//  * ============================================================================
//  * RENDERING: Client Component — same reasoning as other admin pages.
//  *
//  * DATA SOURCE: see src/server/story/admin-actions.ts
//  *   adminListStoriesAction() -> AdminStoryDTO[] (src/types/story.ts)
//  *     { id, mediaType, mediaUrl, description, linkedProductIds,
//  *       seenCount, isExpired, isDeleted, expiresAt, createdAt, updatedAt }
//  *   createStoryAction(StoryFormInput) / updateStoryAction({id, ...StoryFormInput})
//  *   deleteStoryAction(id) -> soft delete
//  *
//  * Admin can CRUD a story even while it's still active (not yet expired),
//  * per your spec — there's no special-casing for active vs expired here,
//  * every story is editable/deletable the same way.
//  *
//  * Upload: /api/upload/story-media (same pattern as product media —
//  * images compressed to WebP, video size-limited only, compression
//  * deferred to end of project per your instruction).
//  *
//  * UI NOTE FOR DESIGN AGENT: list/grid of stories with thumbnail, seen
//  * count, expiry countdown or "expired" badge, edit/delete actions, and a
//  * create form (media upload, optional description, duration in hours —
//  * default 24 — and a multi-select product picker, all optional per spec).
//  * ============================================================================
//  */
// import { StoriesManager } from "./stories-manager";

// export default function AdminStoriesPage() {
//   return (
//     <main dir="rtl" style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>مدیریت استوری‌ها</h1>
//       <StoriesManager />
//     </main>
//   );
// }



/**
 * PAGE: /admin/stories
 * See src/server/story/admin-actions.ts for data source details.
 * Layout (header + nav sheet) is provided by app/admin/layout.tsx.
 */
import { StoriesManager } from "./stories-manager";

export default function AdminStoriesPage() {
  return (
    <div className="pb-4">
      <StoriesManager />
    </div>
  );
}
