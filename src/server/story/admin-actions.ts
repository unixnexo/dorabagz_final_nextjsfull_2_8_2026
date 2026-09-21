"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/session";
import { storyFormSchema, updateStorySchema } from "@/lib/validations/story";
import { toAdminStoryDTO, storyInclude } from "./story-mapper";
import type { ActionResult } from "@/server/auth/actions";
import type { AdminStoryDTO } from "@/types/story";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session && session.role === "ADMIN";
}

// ---------------------------------------------------------------------------
// Admin: list ALL stories (including expired/deleted), newest first —
// admin can CRUD a story even before it expires, per your spec.
// ---------------------------------------------------------------------------
export async function adminListStoriesAction(): Promise<ActionResult<AdminStoryDTO[]>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  const stories = await prisma.story.findMany({
    where: { isDeleted: false },
    include: storyInclude(null),
    orderBy: { createdAt: "desc" },
  });

  return { success: true, data: stories.map(toAdminStoryDTO) };
}

// ---------------------------------------------------------------------------
// Admin: create. expiresAt = now + durationHours (default 24 in the UI).
// ---------------------------------------------------------------------------
export async function createStoryAction(input: unknown): Promise<ActionResult<AdminStoryDTO>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = storyFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const expiresAt = new Date(Date.now() + data.durationHours * 60 * 60 * 1000);

  const story = await prisma.story.create({
    data: {
      mediaType: data.mediaType,
      mediaUrl: data.mediaUrl,
      description: data.description || null,
      expiresAt,
      products: { create: data.linkedProductIds.map((productId) => ({ productId })) },
    },
    include: storyInclude(null),
  });

  return { success: true, data: toAdminStoryDTO(story) };
}

// ---------------------------------------------------------------------------
// Admin: update. Per your spec, admin can edit even an active (not yet
// expired) story fully — including extending/shortening its duration.
// durationHours is recomputed from NOW on every edit (not from the
// original createdAt), so "set to 24h" always means "24h from this edit."
// ---------------------------------------------------------------------------
export async function updateStoryAction(input: unknown): Promise<ActionResult<AdminStoryDTO>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = updateStorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const expiresAt = new Date(Date.now() + data.durationHours * 60 * 60 * 1000);

  await prisma.storyProduct.deleteMany({ where: { storyId: data.id } });

  const story = await prisma.story.update({
    where: { id: data.id },
    data: {
      mediaType: data.mediaType,
      mediaUrl: data.mediaUrl,
      description: data.description || null,
      expiresAt,
      products: { create: data.linkedProductIds.map((productId) => ({ productId })) },
    },
    include: storyInclude(null),
  });

  return { success: true, data: toAdminStoryDTO(story) };
}

// ---------------------------------------------------------------------------
// Admin: soft delete — works whether the story is still active or already
// expired, per your spec ("CRUD fully even before the story being ended").
// ---------------------------------------------------------------------------
export async function deleteStoryAction(id: string): Promise<ActionResult<{ deleted: true }>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.story.update({ where: { id }, data: { isDeleted: true } });
  return { success: true, data: { deleted: true } };
}
