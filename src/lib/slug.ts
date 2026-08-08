/**
 * Generates a random product code like "PRD-8F3K2L" (letters/digits, no
 * particular meaning — you said you don't care about the format).
 */
export function generateProductCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `PRD-${code}`;
}

/**
 * Converts a title (Persian or English) into a URL-safe slug.
 * Persian characters are kept as-is (Next.js/browsers handle UTF-8 in URLs
 * fine, and it's better for Persian SEO than transliterating to English).
 */
export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // spaces -> dashes
    .replace(/[^\p{L}\p{N}-]+/gu, "") // strip anything that's not a letter/number/dash (unicode-aware)
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-|-$/g, ""); // trim leading/trailing dash
}

/** Builds the final unique-ish slug: slugified title + product code. */
export function buildProductSlug(title: string, productCode: string): string {
  return `${slugify(title)}-${productCode.toLowerCase()}`;
}
