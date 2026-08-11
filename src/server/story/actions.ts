"use server";

import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { toStoryDTO, fullStoryInclude } from "./story-mapper";
import { orderStoriesForViewer } from "@/lib/story-ordering";
import type { ActionResult } from "@/server/auth/actions";
import type { StoryDTO } from "@/types/story";

// ---------------------------------------------------------------------------
// Public: active (non-expired, non-deleted) stories for the home page bar.
// Ordered per your spec: not-yet-viewed first (newest-first), already-
// viewed pushed to the back (also newest-first among themselves). Works
// for logged-out visitors too — everything just shows as unviewed then,
// since there's no user to track views against.
// ---------------------------------------------------------------------------
export async function listActiveStoriesAction(): Promise<ActionResult<StoryDTO[]>> {
  const identity = await getEffectiveIdentity();

  const stories = await prisma.story.findMany({
    where: { isDeleted: false, expiresAt: { gt: new Date() } },
    include: fullStoryInclude,
    orderBy: { createdAt: "desc" },
  });

  // Order using the real Date objects (ordering logic needs Date, not the
  // ISO string the DTO carries), then map to DTOs in that final order.
  const ordered = orderStoriesForViewer(
    stories.map((s) => ({
      story: s,
      createdAt: s.createdAt,
      isViewedByCurrentUser: identity ? s.views.some((v) => v.userId === identity.userId) : false,
      id: s.id,
    }))
  );

  return { success: true, data: ordered.map((o) => toStoryDTO(o.story, identity?.userId ?? null)) };
}

// ---------------------------------------------------------------------------
// Marks a story as viewed by the current user. Safe to call every time a
// story is opened — upsert means repeat views never create duplicate
// rows or affect the "seen once per user" count, per your spec.
// ---------------------------------------------------------------------------
export async function markStoryViewedAction(storyId: string): Promise<ActionResult<{ viewed: true }>> {
  const identity = await getEffectiveIdentity();
  if (!identity) return { success: true, data: { viewed: true } }; // guests: no-op, nothing to track

  await prisma.storyView.upsert({
    where: { storyId_userId: { storyId, userId: identity.userId } },
    update: {},
    create: { storyId, userId: identity.userId },
  });

  return { success: true, data: { viewed: true } };
}
