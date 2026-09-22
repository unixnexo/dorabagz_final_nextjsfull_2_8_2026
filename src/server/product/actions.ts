"use server";

import { prisma } from "@/lib/prisma";
// import { getSession } from "@/server/auth/session";
import { getSession, getEffectiveIdentity } from "@/server/auth/session";
import { getProductReviewStats } from "./review-stats";
import { productListQuerySchema, productFormSchema, updateProductSchema } from "@/lib/validations/product";
import { getCategoryIdsIncludingChildren } from "@/server/category/category-tree";
import {
  toProductListItemDTO,
  toProductDetailDTO,
  fullProductInclude,
} from "./product-mapper";
import { createProductWithRelations, updateProductWithRelations } from "./product-write";
import { getActiveDiscountGroupsForPricing } from "@/server/discount/pricing-service";
import type { ActionResult } from "@/server/auth/actions";
import type { ProductListItemDTO, ProductDetailDTO } from "@/types/product";
import type { PaginatedResult } from "@/types/user";

async function requireAdmin(): Promise<{ userId: string } | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return { userId: session.userId };
}

async function getProductListMeta(productIds: string[]) {
  if (productIds.length === 0) {
    return {
      favoritedIds: new Set<string>(),
      reviewStats: new Map<string, { reviewCount: number; averageRating: number }>(),
    };
  }

  const identity = await getEffectiveIdentity();

  const [favoritedIds, reviewStats] = await Promise.all([
    identity
      ? prisma.favorite
        .findMany({
          where: {
            userId: identity.userId,
            productId: { in: productIds },
          },
          select: {
            productId: true,
          },
        })
        .then((rows) => new Set(rows.map((row) => row.productId)))
      : Promise.resolve(new Set<string>()),

    getProductReviewStats(productIds),
  ]);

  return {
    favoritedIds,
    reviewStats,
  };
}

// ---------------------------------------------------------------------------
// Public: paginated + searchable + filterable product list.
//
// NOTE ON SORT: `expensive`/`cheap` sort by each product's MINIMUM variant
// price. Prisma can't `orderBy` an aggregate across a one-to-many relation
// (variants) in this schema without raw SQL, so instead we:
//   1. Fetch ALL matching rows (no skip/take yet) with pricing applied
//   2. Sort the mapped DTOs in JS by minPrice
//   3. Paginate AFTER sorting (slice the sorted array)
// This is fine at this project's scale. If the catalog grows into the tens
// of thousands of products, this should move to a raw SQL query or a
// denormalized "minPrice" column on Product updated on variant write.
//
// `newest`/`oldest` still sort in the DB (orderBy createdAt) since that's
// a real Product column — only price sort needs the JS workaround, and for
// those two cases we keep DB-level skip/take for efficiency.
//
// NOTE ON inStock/hasDiscount: both are DERIVED fields (computed from
// variants / discount pricing in the mapper), not real Prisma columns, so
// they're applied as a JS .filter() AFTER mapping, not in the `where`
// clause. This means `totalItems`/`totalPages` reflect the count BEFORE
// this filter runs — i.e. if inStock or hasDiscount is active, the
// pagination count can be slightly higher than the actual filtered result
// count. Acceptable for now; the real fix is moving these two into the
// always-fetch-all-then-paginate path (like cheap/expensive already does)
// so the count is computed post-filter too.
// ---------------------------------------------------------------------------
export async function listProductsAction(
  input: unknown
): Promise<ActionResult<PaginatedResult<ProductListItemDTO>>> {
  const parsed = productListQuerySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { page, pageSize, search, categoryId, minPrice, maxPrice, inStock, hasDiscount, sort } =
    parsed.data;

  const categoryIds = categoryId ? await getCategoryIdsIncludingChildren(categoryId) : undefined;

  const variantWhere = {
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
        price: {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        },
      }
      : {}),
    ...(inStock ? { stock: { gt: 0 } } : {}),
  };

  const where = {
    isDeleted: false,
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    ...(search
      ? { OR: [{ title: { contains: search } }, { productCode: { contains: search } }] }
      : {}),
    ...(Object.keys(variantWhere).length > 0 ? { variants: { some: variantWhere } } : {}),
  };

  const discountGroups = await getActiveDiscountGroupsForPricing();
  const needsPriceSort = sort === "cheap" || sort === "expensive";

  if (!needsPriceSort) {
    // newest/oldest: DB can sort + paginate directly.
    const [items, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        include: fullProductInclude,
        orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    // let mapped = items.map((item) => toProductListItemDTO(item, discountGroups));
    const { favoritedIds, reviewStats } = await getProductListMeta(
      items.map((item) => item.id)
    );

    let mapped = items.map((item) =>
      toProductListItemDTO(
        item,
        discountGroups,
        favoritedIds,
        reviewStats
      )
    );

    // if (inStock) mapped = mapped.filter((p) => p.totalStock > 0);
    if (hasDiscount) mapped = mapped.filter((p) => p.hasDiscount);

    return {
      success: true,
      data: {
        items: mapped,
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize) || 1,
      },
    };
  }

  // cheap/expensive: fetch everything matching, sort in JS, paginate after.
  const allItems = await prisma.product.findMany({
    where,
    include: fullProductInclude,
    orderBy: { createdAt: "desc" },
  });

  // let mapped = allItems.map((item) => toProductListItemDTO(item, discountGroups));

  const { favoritedIds, reviewStats } = await getProductListMeta(
    allItems.map((item) => item.id)
  );

  let mapped = allItems.map((item) =>
    toProductListItemDTO(
      item,
      discountGroups,
      favoritedIds,
      reviewStats
    )
  );

  // if (inStock) mapped = mapped.filter((p) => p.totalStock > 0);
  if (hasDiscount) mapped = mapped.filter((p) => p.hasDiscount);

  mapped.sort((a, b) => (sort === "cheap" ? a.minPrice - b.minPrice : b.minPrice - a.minPrice));

  const totalItems = mapped.length;
  const start = (page - 1) * pageSize;
  const pageItems = mapped.slice(start, start + pageSize);

  return {
    success: true,
    data: {
      items: pageItems,
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Public: top 10 unpaginated results for the search command palette.
// Deliberately separate from listProductsAction — the search dropdown
// wants a fast, small result set, not the full filter/sort/pagination
// machinery. No rate-limiting yet — every debounced keystroke on the
// client hits this directly. Fine at current scale; add a per-IP/user
// throttle here if it ever becomes a problem.
// ---------------------------------------------------------------------------
export async function searchProductsQuickAction(
  query: string
): Promise<ActionResult<ProductListItemDTO[]>> {
  const trimmed = query.trim();
  if (!trimmed) return { success: true, data: [] };

  const items = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [{ title: { contains: trimmed } }, { productCode: { contains: trimmed } }],
    },
    include: fullProductInclude,
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const discountGroups = await getActiveDiscountGroupsForPricing();
  return { success: true, data: items.map((item) => toProductListItemDTO(item, discountGroups)) };
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
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
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

  const discountGroups = await getActiveDiscountGroupsForPricing();

  return {
    success: true,
    data: {
      items: items.map((item) => toProductListItemDTO(item, discountGroups)),
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
  const discountGroups = await getActiveDiscountGroupsForPricing();
  return { success: true, data: toProductDetailDTO(product, discountGroups) };
}

// ---------------------------------------------------------------------------
// Admin: single product detail by id (for the admin edit form). Deliberately
// does NOT apply discounts — this feeds the product EDIT form, which needs
// the raw original price the admin actually set, not a computed sale price.
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
