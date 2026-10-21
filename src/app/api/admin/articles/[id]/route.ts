import { NextResponse } from "next/server";
import { ApiError, readJson, refreshSite, run } from "@/lib/api";
import { requireRole, STAFF } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";
import {
  ARTICLES,
  buildArticleData,
  toArticle,
  uniqueSlug,
} from "@/lib/db/articles";
import type { AdminSession } from "@/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function load(id: string, session: AdminSession) {
  const db = getDb();
  if (!db) throw new ApiError(503, "Firebase is not configured.");
  const ref = db.collection(ARTICLES).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "Article not found.");
  const data = snap.data() || {};
  if (session.role === "author") {
    if (data.authorId !== session.uid) {
      throw new ApiError(403, "You can only edit your own articles.");
    }
    if (data.status === "published") {
      throw new ApiError(
        403,
        "This article is published. Ask an editor to make changes."
      );
    }
  }
  return { db, ref, data };
}

export async function GET(req: Request, { params }: Ctx) {
  return run(async () => {
    const session = await requireRole(req, STAFF);
    const { id } = await params;
    const { data } = await load(id, session);
    return NextResponse.json({ article: toArticle(id, data) });
  });
}

export async function PUT(req: Request, { params }: Ctx) {
  return run(async () => {
    const session = await requireRole(req, STAFF);
    const { id } = await params;
    const { db, ref, data: existing } = await load(id, session);

    const input = await readJson(req);
    const data = buildArticleData(input, session, existing);
    const wanted =
      typeof input.slug === "string" && input.slug
        ? input.slug
        : String(existing.slug || data.title);
    const slug = await uniqueSlug(db, wanted, id);

    await ref.set({ ...data, slug });
    refreshSite();
    return NextResponse.json({ ok: true, id, slug, status: data.status });
  });
}

export async function DELETE(req: Request, { params }: Ctx) {
  return run(async () => {
    const session = await requireRole(req, STAFF);
    const { id } = await params;
    const { ref } = await load(id, session);
    await ref.delete();
    refreshSite();
    return NextResponse.json({ ok: true });
  });
}
