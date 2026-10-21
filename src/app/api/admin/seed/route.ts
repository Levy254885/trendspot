import { NextResponse } from "next/server";
import { ApiError, refreshSite, run } from "@/lib/api";
import { requireRole } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";
import { seedArticles } from "@/data/seed";

export const dynamic = "force-dynamic";

/** Copies the sample articles into Firestore (skips ones that already exist). */
export async function POST(req: Request) {
  return run(async () => {
    await requireRole(req, ["admin"]);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");

    let created = 0;
    let skipped = 0;
    for (const a of seedArticles) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = a;
      try {
        await db.collection("articles").doc(a.slug).create({
          ...rest,
          views: a.views,
          updatedAt: a.publishedAt || new Date().toISOString(),
        });
        created++;
      } catch {
        skipped++; // already imported
      }
    }
    refreshSite();
    return NextResponse.json({ ok: true, created, skipped });
  });
}
