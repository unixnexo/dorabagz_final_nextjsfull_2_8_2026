/**
 * ============================================================================
 * ROUTE: GET /uploads/[...path]
 * ============================================================================
 * Serves uploaded files from disk (outside `public/`) instead of relying on
 * Next's public-folder static serving. `next start` builds its list of
 * public-folder routes ONCE at server startup, so a file written to
 * `public/` mid-process 404s until the process restarts — this route reads
 * the filesystem live on every request, so it needs no restart after upload.
 *
 * Supports HTTP Range requests (206) so <video> seeking/scrubbing works.
 * ============================================================================
 */
import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

const STORAGE_ROOT = path.join(process.cwd(), "storage", "uploads");

const MIME_TYPES: Record<string, string> = {
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path: segments } = await params;

    // Each segment must be a plain filename/dirname component — no traversal.
    if (segments.length === 0 || segments.some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))) {
        return new NextResponse("Not found", { status: 404 });
    }

    const filePath = path.join(STORAGE_ROOT, ...segments);
    // Belt-and-suspenders: resolved path must still be inside STORAGE_ROOT.
    if (!filePath.startsWith(STORAGE_ROOT + path.sep)) {
        return new NextResponse("Not found", { status: 404 });
    }

    let info;
    try {
        info = await stat(filePath);
    } catch {
        return new NextResponse("Not found", { status: 404 });
    }
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });

    const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
    const range = request.headers.get("range");

    if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range);
        const start = match?.[1] ? parseInt(match[1], 10) : 0;
        const end = match?.[2] ? parseInt(match[2], 10) : info.size - 1;

        if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= info.size) {
            return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
        }

        const stream = createReadStream(filePath, { start, end });
        return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
            status: 206,
            headers: {
                "Content-Type": contentType,
                "Content-Length": String(end - start + 1),
                "Content-Range": `bytes ${start}-${end}/${info.size}`,
                "Accept-Ranges": "bytes",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    }

    const stream = createReadStream(filePath);
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        headers: {
            "Content-Type": contentType,
            "Content-Length": String(info.size),
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}