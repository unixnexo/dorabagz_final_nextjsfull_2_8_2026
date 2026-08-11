import type { Story, StoryProduct, StoryView, Product, ProductImage } from "@prisma/client";
import type { StoryDTO, AdminStoryDTO } from "@/types/story";

type FullStory = Story & {
  products: (StoryProduct & { product: Product & { images: ProductImage[] } })[];
  views: StoryView[];
};

export function toStoryDTO(story: FullStory, currentUserId: string | null): StoryDTO {
  return {
    id: story.id,
    mediaType: story.mediaType,
    mediaUrl: story.mediaUrl,
    description: story.description,
    linkedProducts: story.products.map((sp) => {
      const mainImage = sp.product.images.find((i) => i.isMain) ?? sp.product.images[0] ?? null;
      return {
        id: sp.product.id,
        title: sp.product.title,
        slug: sp.product.slug,
        mainImageUrl: mainImage?.url ?? null,
      };
    }),
    isViewed: currentUserId ? story.views.some((v) => v.userId === currentUserId) : false,
    expiresAt: story.expiresAt.toISOString(),
    createdAt: story.createdAt.toISOString(),
  };
}

export function toAdminStoryDTO(story: FullStory): AdminStoryDTO {
  return {
    id: story.id,
    mediaType: story.mediaType,
    mediaUrl: story.mediaUrl,
    description: story.description,
    linkedProductIds: story.products.map((sp) => sp.productId),
    seenCount: story.views.length, // one row per user, per schema's @@unique — already "once per user"
    isExpired: story.expiresAt.getTime() < Date.now(),
    isDeleted: story.isDeleted,
    expiresAt: story.expiresAt.toISOString(),
    createdAt: story.createdAt.toISOString(),
    updatedAt: story.updatedAt.toISOString(),
  };
}

/** Standard include clause used everywhere we need a full story. */
export const fullStoryInclude = {
  products: { include: { product: { include: { images: true } } } },
  views: true,
} as const;
