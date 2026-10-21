/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { ApiError, clean, readJson, run } from "@/lib/api";
import { requireRole, STAFF } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";
import type { MediaItem } from "@/types";

export const dynamic = "force-dynamic";

function toMedia(id: string, d: Record<string, any>): MediaItem {
  return {
    id,
    url: String(d.url || ""),
    publicId: String(d.publicId || ""),
    name: String(d.name || ""),
    width: Number(d.width) || 0,
    height: Number(d.height) || 0,
    bytes: Number(d.bytes) || 0,
    format: String(d.format || ""),
    uploadedBy: String(d.uploadedBy || ""),
    createdAt: String(d.createdAt || ""),
  };
}

/** The media library: every image uploaded through the admin. */
export async function GET(req: Request) {
  return run(async () => {
    await requireRole(req, STAFF);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    const snap = await db
      .collection("media")
      .orderBy("createdAt", "desc")
      .limit(300)
      .get();
    return NextResponse.json({
      media: snap.docs.map((d) => toMedia(d.id, d.data())),
    });
  });
}

/** Records an image the browser just uploaded to Cloudinary. */
export async function POST(req: Request) {
  return run(async () => {
    const session = await requireRole(req, STAFF);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    const input = await readJson(req);

    const url = clean(input.url, 1000);
    if (!/^https:\/\/res\.cloudinary\.com\//i.test(url)) {
      throw new ApiError(400, "That isn't a Cloudinary image.");
    }

    const doc = {
      url,
      publicId: clean(input.publicId, 200),
      name: clean(input.name, 200),
      width: Number(input.width) || 0,
      height: Number(input.height) || 0,
      bytes: Number(input.bytes) || 0,
      format: clean(input.format, 20),
      uploadedBy: session.name,
      createdAt: new Date().toISOString(),
    };
    const ref = await db.collection("media").add(doc);
    return NextResponse.json({ ok: true, item: toMedia(ref.id, doc) });
  });
}
