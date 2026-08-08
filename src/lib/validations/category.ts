import { z } from "zod";

export const createCategorySchema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(100),
  imageUrl: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
