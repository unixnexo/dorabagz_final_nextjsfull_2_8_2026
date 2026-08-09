import { z } from "zod";

export const checkoutSchema = z.object({
  couponCode: z.string().optional(), // optional, applied if provided and valid
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
