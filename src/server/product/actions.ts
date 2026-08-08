"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/session";
import { productListQuerySchema, productFormSchema, updateProductSchema } from "@/lib/validations/product";
import { getCategoryIdsIncludingChildren } from "@/server/category/category-tree";
import {
  toProductListItemDTO,
  toProductDetailDTO,
  fullProductInclude,
} from "./product-mapper";
import { createProductWithRelations, updateProductWithRelations } from "./product-write";
import type { ActionResult } from "@/server/auth/actions";
import type { ProductListItemDTO, ProductDetailDTO } from "@/types/product";
import type { PaginatedResult } from "@/types/user";

async function requireAdmin(): Promise<{ userId: string } | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return { userId: session.userId };
}

// ---------------------------------------------------------------------------
// Public: paginated + searchable + filterable product list.
// ---------------------------------------------------------------------------
export async function listProductsAction(
  input: unknown
): Promise<ActionResult<PaginatedResult<ProductListItemDTO>>> {
  const parsed = productListQuerySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { page, pageSize, search, categoryId, minPrice, maxPrice } = parsed.data;

  const categoryIds = categoryId ? await getCategoryIdsIncludingChildren(categoryId) : undefined;

  const where = {
    isDeleted: false,
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    ...(search
      ? { OR: [{ title: { contains: search } }, { productCode: { contains: search } }] }
      : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          variants: {
            some: {
              ...(minPrice !== undefined ? { price: { gte: minPrice } } : {}),
              ...(maxPrice !== undefined ? { price: { lte: maxPrice } } : {}),
            },
          },
        }
      : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      include: fullProductInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toProductListItemDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Admin: same as above but includes soft-deleted products too, admin-only.
// ---------------------------------------------------------------------------
export async function adminListProductsAction(
  input: unknown
): Promise<ActionResult<PaginatedResult<ProductListItemDTO>>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = productListQuerySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { page, pageSize, search, categoryId, minPrice, maxPrice } = parsed.data;

  const categoryIds = categoryId ? await getCategoryIdsIncludingChildren(categoryId) : undefined;

  const where = {
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    ...(search
      ? { OR: [{ title: { contains: search } }, { productCode: { contains: search } }] }
      : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          variants: {
            some: {
              ...(minPrice !== undefined ? { price: { gte: minPrice } } : {}),
              ...(maxPrice !== undefined ? { price: { lte: maxPrice } } : {}),
            },
          },
        }
      : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      include: fullProductInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items: items.map(toProductListItemDTO),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Public: single product detail by slug (for the product detail page).
// ---------------------------------------------------------------------------
export async function getProductBySlugAction(
  slug: string
): Promise<ActionResult<ProductDetailDTO>> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: fullProductInclude,
  });
  if (!product || product.isDeleted) {
    return { success: false, error: "محصول یافت نشد." };
  }
  return { success: true, data: toProductDetailDTO(product) };
}

// ---------------------------------------------------------------------------
// Admin: single product detail by id (for the admin edit form).
// ---------------------------------------------------------------------------
export async function getProductByIdAction(
  id: string
): Promise<ActionResult<ProductDetailDTO>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const product = await prisma.product.findUnique({ where: { id }, include: fullProductInclude });
  if (!product) return { success: false, error: "محصول یافت نشد." };
  return { success: true, data: toProductDetailDTO(product) };
}

// ---------------------------------------------------------------------------
// Admin: create
// ---------------------------------------------------------------------------
export async function createProductAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const id = await createProductWithRelations(parsed.data);
  return { success: true, data: { id } };
}

// ---------------------------------------------------------------------------
// Admin: update
// ---------------------------------------------------------------------------
export async function updateProductAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { id, ...formData } = parsed.data;
  await updateProductWithRelations(id, formData);
  return { success: true, data: { id } };
}

// ---------------------------------------------------------------------------
// Admin: soft delete / restore
// ---------------------------------------------------------------------------
export async function setProductDeletedAction(
  id: string,
  isDeleted: boolean
): Promise<ActionResult<{ isDeleted: boolean }>> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "دسترسی غیرمجاز." };

  await prisma.product.update({ where: { id }, data: { isDeleted } });
  return { success: true, data: { isDeleted } };
}
