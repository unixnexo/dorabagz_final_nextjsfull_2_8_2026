"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/session";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryListQuerySchema,
} from "@/lib/validations/category";
import { toCategoryDTO, toCategoryTreeDTO } from "./category-mapper";
import { validateCategoryDepth } from "./category-tree";
import type { ActionResult } from "@/server/auth/actions";
import type { CategoryDTO, CategoryTreeDTO } from "@/types/category";
import type { PaginatedResult } from "@/types/user";

async function requireAdmin(): Promise<{ userId: string } | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return { userId: session.userId };
}

// ---------------------------------------------------------------------------
// Public: full category tree (top-level categories with children nested).
// Used for browse/filter UI on the storefront. No auth required.
// ---------------------------------------------------------------------------
export async function getCategoryTreeAction(): Promise<ActionResult<CategoryTreeDTO[]>> {
  const topLevel = await prisma.category.findMany({
    where: { parentId: null, isDeleted: false },
    include: { children: { where: { isDeleted: false }, orderBy: { title: "asc" } } },
    orderBy: { title: "asc" },
  });

  return { success: true, data: topLevel.map(toCategoryTreeDTO) };
}

// ---------------------------------------------------------------------------
// Admin: paginated + searchable flat list (for the admin CRUD table).
// ---------------------------------------------------------------------------
export async function listCategoriesAction(
  input: unknown
): Promise<ActionResult<PaginatedResult<CategoryDTO>>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = categoryListQuerySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { page, pageSize, search } = parsed.data;

  const where = {
    isDeleted: false,
    ...(search ? { title: { contains: search } } : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toCategoryDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Admin: create
// ---------------------------------------------------------------------------
export async function createCategoryAction(
  input: unknown
): Promise<ActionResult<CategoryDTO>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const depthError = await validateCategoryDepth(parsed.data.parentId);
  if (depthError) return { success: false, error: depthError };

  const category = await prisma.category.create({
    data: {
      title: parsed.data.title,
      imageUrl: parsed.data.imageUrl || null,
      parentId: parsed.data.parentId || null,
    },
  });

  return { success: true, data: toCategoryDTO(category) };
}

// ---------------------------------------------------------------------------
// Admin: update
// ---------------------------------------------------------------------------
export async function updateCategoryAction(
  input: unknown
): Promise<ActionResult<CategoryDTO>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = updateCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  if (parsed.data.parentId === parsed.data.id) {
    return { success: false, error: "یک دسته نمی‌تواند والد خودش باشد." };
  }

  const depthError = await validateCategoryDepth(parsed.data.parentId);
  if (depthError) return { success: false, error: depthError };

  // If this category already has children, it can't become a child itself
  // (would create a 3rd level).
  if (parsed.data.parentId) {
    const hasChildren = await prisma.category.findFirst({
      where: { parentId: parsed.data.id, isDeleted: false },
    });
    if (hasChildren) {
      return { success: false, error: "این دسته دارای زیردسته است و نمی‌تواند زیردسته دسته دیگری شود." };
    }
  }

  const category = await prisma.category.update({
    where: { id: parsed.data.id },
    data: {
      title: parsed.data.title,
      imageUrl: parsed.data.imageUrl || null,
      parentId: parsed.data.parentId || null,
    },
  });

  return { success: true, data: toCategoryDTO(category) };
}

// ---------------------------------------------------------------------------
// Admin: soft delete
// ---------------------------------------------------------------------------
// export async function deleteCategoryAction(
//   categoryId: string
// ): Promise<ActionResult<{ deleted: true }>> {
//   const admin = await requireAdmin();
//   if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

//   const children = await prisma.category.findFirst({
//     where: { parentId: categoryId, isDeleted: false },
//   });
//   if (children) {
//     return { success: false, error: "ابتدا زیردسته‌های این دسته را حذف کنید." };
//   }

//   await prisma.category.update({ where: { id: categoryId }, data: { isDeleted: true } });
//   return { success: true, data: { deleted: true } };
// }



export async function deleteCategoryAction(
  categoryId: string
): Promise<ActionResult<{ deleted: true }>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const children = await prisma.category.findFirst({
    where: { parentId: categoryId, isDeleted: false },
  });
  if (children) {
    return { success: false, error: "ابتدا زیردسته‌های این دسته را حذف کنید." };
  }

  const linkedProduct = await prisma.product.findFirst({
    where: { categoryId, isDeleted: false },
  });
  if (linkedProduct) {
    return { success: false, error: "این دسته دارای محصول است و قابل حذف نیست. ابتدا محصولات را از این دسته خارج کنید یا حذف کنید." };
  }

  await prisma.category.update({ where: { id: categoryId }, data: { isDeleted: true } });
  return { success: true, data: { deleted: true } };
}
