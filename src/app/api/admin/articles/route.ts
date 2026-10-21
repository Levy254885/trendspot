import { NextResponse } from "next/server";
import { ApiError, readJson, refreshSite, run } from "@/lib/api";
import { requireRole, STAFF } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";
import {
  ARTICLES,
  buildArticleData,
  toArticle,
  toListItem,
  uniqueSlug,
} from "@/lib/db/articles";

export const dynamic = "force-dynamic";

/** List every article (all statuses). Authors only see their own. */
export async function GET(req: Request) {
  return run(async () => {
    const session = await requireRole(req, STAFF);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");

    const snap = await db.collection(ARTICLES).limit(2000).get();
    let items = snap.docs.map((d) => toArticle(d.id, d.data()));
    if (session.role === "author") {
      items = items.filter((a) => a.authorId === session.uid);
    }
    items.sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
    return NextResponse.json({ articles: items.map(toListItem) });
  });
}

export async function POST(req: Request) {
  return run(async () => {
    const session = await requireRole(req, STAFF);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");

    const input = await readJson(req);
    const data = buildArticleData(input, session, null);
    const slug = await uniqueSlug(
      db,
      typeof input.slug === "string" && input.slug ? input.slug : String(data.title)
    );
    const ref = await db.collection(ARTICLES).add({ ...data, slug });
    refreshSite();
    return NextResponse.json({ ok: true, id: ref.id, slug, status: data.status });
  });
}
