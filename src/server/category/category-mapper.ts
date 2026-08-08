import type { Category } from "@prisma/client";
import type { CategoryDTO, CategoryTreeDTO } from "@/types/category";

export function toCategoryDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    title: category.title,
    imageUrl: category.imageUrl,
    parentId: category.parentId,
    isDeleted: category.isDeleted,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function toCategoryTreeDTO(
  category: Category & { children: Category[] }
): CategoryTreeDTO {
  return {
    ...toCategoryDTO(category),
    children: category.children.map(toCategoryDTO),
  };
}
