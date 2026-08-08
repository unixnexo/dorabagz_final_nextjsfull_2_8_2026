import { z } from "zod";

export const addToCartSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});
export type AddToCartInput = z.infer<typeof addToCartSchema>;

export const updateCartItemQuantitySchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1), // to remove, use removeCartItemAction instead of quantity 0
});
export type UpdateCartItemQuantityInput = z.infer<typeof updateCartItemQuantitySchema>;

export const mergeGuestCartSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  ),
});
export type MergeGuestCartInput = z.infer<typeof mergeGuestCartSchema>;
