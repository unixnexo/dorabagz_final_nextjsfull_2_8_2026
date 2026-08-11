import { z } from "zod";

export const storyFormSchema = z.object({
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  mediaUrl: z.string().min(1, "فایل رسانه الزامی است"),
  description: z.string().max(500).optional(),
  durationHours: z.number().int().min(1, "حداقل ۱ ساعت").max(24 * 30, "حداکثر ۳۰ روز"),
  linkedProductIds: z.array(z.string()).default([]),
});
export type StoryFormInput = z.infer<typeof storyFormSchema>;

export const updateStorySchema = storyFormSchema.and(z.object({ id: z.string().min(1) }));
export type UpdateStoryInput = z.infer<typeof updateStorySchema>;
