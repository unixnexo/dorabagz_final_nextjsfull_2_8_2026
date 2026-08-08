/**
 * Uploads a single file to /api/upload/product-media and returns its URL.
 * Used by the admin product form for immediate-upload-on-select behavior.
 */
export async function uploadProductMedia(file: File): Promise<{ url: string } | { error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload/product-media", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    return { error: data.error ?? "خطا در آپلود فایل" };
  }
  return { url: data.url };
}
