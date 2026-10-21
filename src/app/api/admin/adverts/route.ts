import { NextResponse } from "next/server";
import { ApiError, readJson, refreshSite, run } from "@/lib/api";
import { MANAGERS, requireRole } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";
import { buildAdvertData } from "@/lib/db/adverts";
import { toAdvert } from "@/services/adverts";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    const snap = await db.collection("adverts").limit(500).get();
    const adverts = snap.docs
      .map((d) => toAdvert(d.id, d.data()))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json({ adverts });
  });
}

export async function POST(req: Request) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    const data = buildAdvertData(await readJson(req));
    const now = new Date().toISOString();
    const ref = await db.collection("adverts").add({
      ...data,
      impressions: 0,
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    });
    refreshSite();
    return NextResponse.json({ ok: true, id: ref.id });
  });
}
