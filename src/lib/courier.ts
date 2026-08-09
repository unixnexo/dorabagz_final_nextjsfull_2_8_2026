/**
 * Shiraz orders ship via Snapp Box (our shop is in Shiraz); everywhere
 * else ships via Tipax. Both are pay-on-delivery for the shipping fee
 * itself — we never charge shipping through the app, this just tells
 * admin which courier to use for fulfillment.
 */
export type CourierType = "SNAPP_BOX" | "TIPAX";

const SHIRAZ_SPELLINGS = ["شیراز"]; // add alternate spellings here if needed later

export function resolveCourierType(city: string): CourierType {
  return SHIRAZ_SPELLINGS.includes(city.trim()) ? "SNAPP_BOX" : "TIPAX";
}

export function courierTypeLabel(courier: CourierType): string {
  return courier === "SNAPP_BOX" ? "اسنپ‌باکس (پس‌کرایه)" : "تیپاکس (پس‌کرایه)";
}
