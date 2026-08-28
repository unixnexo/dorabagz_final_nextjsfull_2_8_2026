/**
 * ============================================================================
 * PAGE: /checkout
 * ============================================================================
 * RENDERING: Server Component shell (auth + cart check), the actual form
 * (address, coupon input, confirm button) is a client component since it
 * needs interactivity (apply-coupon preview, submit -> redirect to ZarinPal).
 *
 * ACCESS: logged-in users only. Guests get redirected to /logic — per your
 * spec, cart works for guests but checkout requires an account (address +
 * order history need a user).
 *
 * FLOW:
 *   1. Page loads current cart (getCartAction) + saved address (getMyAddressAction, prefilled if present)
 *   2. User fills/confirms address, optionally applies a coupon code (previewCouponAction)
 *   3. User hits "pay" -> createOrderAction -> redirected to ZarinPal
 *   4. ZarinPal redirects back to /api/payment/callback -> then to /dashboard/orders/[id]
 *
 * DATA SHAPES:
 *   getCartAction() -> CartSummaryDTO (src/types/cart.ts)
 *   getMyAddressAction() -> AddressDTO | null (src/types/address.ts)
 *   saveMyAddressAction(AddressFormInput) -> AddressDTO (upserts the ONE address)
 *   previewCouponAction({code}) -> CouponPreviewDTO (src/types/coupon.ts)
 *     { valid: true, couponId, code, discountAmount } | { valid: false, error }
 *   createOrderAction({couponCode?}) -> CheckoutResultDTO
 *     { orderId, paymentUrl } — redirect browser to paymentUrl
 *
 * UI NOTE FOR DESIGN AGENT: order summary (line items, subtotal, discount,
 * total), address form (prefilled from saved address if present, editable,
 * saves as the user's one-and-only address on submit), coupon code input
 * with an "apply" button showing the discount preview, courier notice
 * (computed from city: شیراز -> اسنپ‌باکس, else -> تیپاکس, both پس‌کرایه),
 * and a final "pay" button.
 * ============================================================================
 */
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user/get-current-user";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main dir="rtl" style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>تسویه حساب</h1>
      <CheckoutForm />
    </main>
  );
}
