import type {
  DiscountGroup,
  DiscountGroupProduct,
  DiscountGroupCategory,
  Product,
  Category,
} from "@prisma/client";
import type { DiscountGroupDTO } from "@/types/discount";

type FullDiscountGroup = DiscountGroup & {
  products: (DiscountGroupProduct & { product: Product })[];
  categories: (DiscountGroupCategory & { category: Category })[];
};

export function toDiscountGroupDTO(group: FullDiscountGroup): DiscountGroupDTO {
  const now = Date.now();
  const isActive =
    !group.isDeleted &&
    (!group.startAt || group.startAt.getTime() <= now) &&
    (!group.endAt || group.endAt.getTime() >= now);

  return {
    id: group.id,
    title: group.title,
    type: group.type,
    value: group.value,
    startAt: group.startAt ? group.startAt.toISOString() : null,
    endAt: group.endAt ? group.endAt.toISOString() : null,
    productIds: group.products.map((p) => p.productId),
    productTitles: group.products.map((p) => p.product.title),
    categoryIds: group.categories.map((c) => c.categoryId),
    categoryTitles: group.categories.map((c) => c.category.title),
    isActive,
    isDeleted: group.isDeleted,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
  };
}

/** Standard include clause used everywhere we need a full discount group. */
export const fullDiscountGroupInclude = {
  products: { include: { product: true } },
  categories: { include: { category: true } },
} as const;
