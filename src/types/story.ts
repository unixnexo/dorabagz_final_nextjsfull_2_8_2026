export type StoryMediaType = "IMAGE" | "VIDEO";

/** A linked product summary — enough to render a "shop this" link/card
 *  from within the story UI without a second fetch. */
export type StoryLinkedProductDTO = {
  id: string;
  title: string;
  slug: string;
  mainImageUrl: string | null;
};

/** Public shape — what the storefront (home page stories bar) receives.
 *  `isViewed` is scoped to the CURRENT viewer (or false if logged out)
 *  and drives your "push already-seen stories back" ordering — the list
 *  comes back already ordered correctly, you don't need to re-sort. */
export type StoryDTO = {
  id: string;
  mediaType: StoryMediaType;
  mediaUrl: string;
  description: string | null;
  linkedProducts: StoryLinkedProductDTO[];
  isViewed: boolean;
  expiresAt: string;
  createdAt: string;
};

/** Admin list row — includes seen count (per your spec: count each user
 *  once, no matter how many times they viewed it) and expiry/active state. */
export type AdminStoryDTO = {
  id: string;
  mediaType: StoryMediaType;
  mediaUrl: string;
  description: string | null;
  linkedProductIds: string[];
  seenCount: number;
  isExpired: boolean;
  isDeleted: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

/** Shape sent by the admin create/edit form. `durationHours` is used at
 *  creation time to compute expiresAt (createdAt + durationHours); on
 *  edit, admin can also directly extend/shorten via the same field
 *  (recomputed from "now", not from the original createdAt). */
export type StoryFormInput = {
  mediaType: StoryMediaType;
  mediaUrl: string;
  description?: string;
  durationHours: number; // default 24 in the UI, admin-editable
  linkedProductIds: string[];
};
