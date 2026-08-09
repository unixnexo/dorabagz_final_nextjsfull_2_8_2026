/** Auto-generated coupon code when admin leaves the field blank, e.g. "CPN-8F3K2L". */
export function generateCouponCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1, same convention as product codes
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CPN-${code}`;
}
