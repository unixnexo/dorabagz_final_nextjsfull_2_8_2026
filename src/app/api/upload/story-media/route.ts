/**
 * ============================================================================
 * API ROUTE: POST /api/upload/story-media
 * ============================================================================
 * Same pattern as /api/upload/product-media (Module 2): images are
 * compressed + converted to WebP via sharp; video is saved as-is with a
 * size limit — NO server-side video compression here either. You asked
 * to defer video compression (both here and the Module 2 leftover) to
 * the end of the project — reminder noted in README.
 *
 * Request: multipart/form-data, field "file"
 * Response (200): { url: string }
 * Response (400): { error: string }
 * ============================================================================
 */
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { getSession } from "@/server/auth/session";

const MAX_VIDEO_SIZE_BYTES = 20 * 1024 * 1024; // 20MB, same cap as product videos
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "stories");

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
    return NextResponse.json({ url: `/uploads/stories/${filename}` });
  }

  const filename = `${randomUUID()}.webp`;
  // const compressed = await sharp(buffer)
  //   .resize({ width: 1080, withoutEnlargement: true }) // stories are portrait/full-screen, 1080 is a sane cap
  //   .toColourspace("srgb")
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
  return NextResponse.json({ url: `/uploads/stories/${filename}` });
}
