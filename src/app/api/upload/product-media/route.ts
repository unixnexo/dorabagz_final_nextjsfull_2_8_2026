/**
 * ============================================================================
 * API ROUTE: POST /api/upload/product-media
 * ============================================================================
 * WHY AN API ROUTE (not a server action): this handles raw FormData/binary
 * file uploads. Server Actions CAN accept FormData, but a dedicated REST
 * endpoint is the more conventional choice here, and it lets the admin
 * form call this independently per-file the moment a file is selected
 * (your "upload immediately, not on submit" requirement) rather than
 * bundling files into the final product create/update payload.
 *
 * Request: multipart/form-data with a single field "file"
 *   - images: any common image format, compressed + converted to WebP
 *   - video: mp4/webm, max 20MB, NOT compressed server-side yet (deferred,
 *     per your decision) — just size-checked and saved as-is
 *
 * Response (200): { url: string }              e.g. "/uploads/products/xxxx.webp"
 * Response (400): { error: string }
 * ============================================================================
 */
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { getSession } from "@/server/auth/session";

const MAX_VIDEO_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "فایلی ارسال نشده است." }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");

  if (!isVideo && !isImage) {
    return NextResponse.json({ error: "فرمت فایل پشتیبانی نمی‌شود." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (isVideo) {
    if (buffer.length > MAX_VIDEO_SIZE_BYTES) {
      return NextResponse.json({ error: "حجم ویدیو نباید بیشتر از ۲۰ مگابایت باشد." }, { status: 400 });
    }
    const ext = path.extname(file.name) || ".mp4";
    const filename = `${randomUUID()}${ext}`;
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return NextResponse.json({ url: `/uploads/products/${filename}` });
  }

  // Image: compress + convert to WebP, no quality loss worth mentioning
  // at quality 82 (standard "visually lossless" WebP setting).
  const filename = `${randomUUID()}.webp`;
  // const compressed = await sharp(buffer)
  //   .toColourspace("srgb")
  //   .resize({ width: 1600, withoutEnlargement: true }) // cap max dimension, keeps aspect ratio
  //   .webp({ quality: 82 })
  //   .toBuffer();

  // const compressed = await sharp(buffer)
  //   .rotate()
  //   .resize({
  //     width: 1600,
  //     withoutEnlargement: true,
  //   })
  //   .webp({
  //     quality: 82,
  //   })
  //   .toBuffer();

  let compressed: Buffer;

  try {
    compressed = await sharp(buffer, {
      failOn: "none",
    })
      .rotate()
      .resize({
        width: 1600,
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
      })
      .toBuffer();
  } catch (error) {
    console.error("Image processing failed:", error);

    return NextResponse.json(
      { error: "پردازش تصویر ناموفق بود. لطفاً تصویر دیگری انتخاب کنید." },
      { status: 400 }
    );
  }


  await writeFile(path.join(UPLOAD_DIR, filename), compressed);
  return NextResponse.json({ url: `/uploads/products/${filename}` });
}
