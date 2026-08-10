/**
 * Masks the middle 4 digits of an Iranian phone number for public display
 * (e.g. on approved reviews) — per your spec: enough to tell reviewers
 * apart, never the full number. "09123456789" -> "0912****789"
 */
export function maskPhoneNumber(phone: string): string {
  if (phone.length !== 11) return phone; // defensive: don't mangle unexpected formats
  return `${phone.slice(0, 4)}****${phone.slice(8)}`;
}
