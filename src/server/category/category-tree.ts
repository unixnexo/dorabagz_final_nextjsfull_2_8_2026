import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Given a category id, returns [thatId, ...childIds]. Used everywhere we
 * filter products "by category" — browsing a parent category should also
 * show products that live directly in its children (per your spec).
 * Since the tree is only 2 levels deep, this never needs to recurse further
 * than one level of children.
 */
export async function getCategoryIdsIncludingChildren(categoryId: string): Promise<string[]> {
  const children = await prisma.category.findMany({
    where: { parentId: categoryId, isDeleted: false },
    select: { id: true },
  });
  return [categoryId, ...children.map((c) => c.id)];
}

/**
 * Enforces the "max 2 levels deep" rule: a category can only be a child
 * (have a parentId) if ITS parent has no parent of its own (i.e. the
 * parent must be top-level). Returns an error message or null if valid.
 */
export async function validateCategoryDepth(parentId: string | null | undefined): Promise<string | null> {
  if (!parentId) return null; // top-level category, always fine

  const parent = await prisma.category.findUnique({ where: { id: parentId } });
  if (!parent) return "دسته والد یافت نشد.";
  if (parent.parentId) {
    return "امکان ایجاد دسته بیش از دو سطح وجود ندارد.";
  }
  return null;
}
