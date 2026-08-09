/**
 * ZarinPal payment gateway client.
 *
 * You said you'll swap in your own sandbox merchant ID — MERCHANT_ID below
 * reads from env (ZARINPAL_MERCHANT_ID), with a placeholder fallback.
 * ZarinPal's official public sandbox ID (works without registration, useful
 * for local testing) is: 00000000-0000-0000-0000-000000000000
 * Put your real one in .env once you have it — see .env.example.
 *
 * ZarinPal REST docs: https://docs.zarinpal.com (payment request / verify).
 * We always call the SANDBOX endpoint (sandbox.zarinpal.com) since you
 * asked for sandbox specifically — swap ZARINPAL_BASE_URL when going live.
 */
import "server-only";

const ZARINPAL_BASE_URL = process.env.ZARINPAL_BASE_URL ?? "https://sandbox.zarinpal.com";
const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID ?? "00000000-0000-0000-0000-000000000000"; // TODO: replace with your real sandbox merchant id

type RequestPaymentParams = {
  amountToman: number;
  description: string;
  callbackUrl: string;
  mobile?: string;
};

type RequestPaymentResult =
  | { success: true; authority: string; paymentUrl: string }
  | { success: false; error: string };

type VerifyPaymentParams = {
  amountToman: number;
  authority: string;
};

type VerifyPaymentResult =
  | { success: true; refId: string }
  | { success: false; error: string };

/** Step 1 of checkout: ask ZarinPal for a payment "Authority" token, then
 *  redirect the user to paymentUrl to actually pay. */
export async function requestZarinpalPayment(
  params: RequestPaymentParams
): Promise<RequestPaymentResult> {
  try {
    const res = await fetch(`${ZARINPAL_BASE_URL}/pg/v4/payment/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        // ZarinPal amounts are in Rial — we store/display Toman everywhere
        // per your spec, so convert only at the gateway boundary.
        amount: params.amountToman * 10,
        description: params.description,
        callback_url: params.callbackUrl,
        metadata: params.mobile ? { mobile: params.mobile } : undefined,
      }),
    });

    const data = await res.json();

    if (data?.data?.code === 100) {
      const authority = data.data.authority as string;
      return {
        success: true,
        authority,
        paymentUrl: `${ZARINPAL_BASE_URL}/pg/StartPay/${authority}`,
      };
    }

    return { success: false, error: data?.errors?.message ?? "خطا در اتصال به درگاه پرداخت" };
  } catch {
    return { success: false, error: "خطا در اتصال به درگاه پرداخت" };
  }
}

/** Step 2: after ZarinPal redirects back to our callback URL, verify the
 *  payment actually succeeded before trusting it. NEVER trust the callback
 *  query params alone — always verify server-to-server. */
export async function verifyZarinpalPayment(
  params: VerifyPaymentParams
): Promise<VerifyPaymentResult> {
  try {
    const res = await fetch(`${ZARINPAL_BASE_URL}/pg/v4/payment/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: params.amountToman * 10,
        authority: params.authority,
      }),
    });

    const data = await res.json();

    // ZarinPal: code 100 = verified now, code 101 = already verified before
    // (can happen on double-callback) — both count as success.
    if (data?.data?.code === 100 || data?.data?.code === 101) {
      return { success: true, refId: String(data.data.ref_id) };
    }

    return { success: false, error: data?.errors?.message ?? "پرداخت تایید نشد" };
  } catch {
    return { success: false, error: "خطا در تایید پرداخت" };
  }
}
