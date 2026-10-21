import { NextResponse } from "next/server";
import { ApiError, readJson, refreshSite, run } from "@/lib/api";
import { MANAGERS, requireRole } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";
import { buildAdvertData } from "@/lib/db/adverts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const { id } = await params;
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    const ref = db.collection("adverts").doc(id);
    if (!(await ref.get()).exists) throw new ApiError(404, "Advert not found.");

    const data = buildAdvertData(await readJson(req));
    await ref.update({ ...data, updatedAt: new Date().toISOString() });
    refreshSite();
    return NextResponse.json({ ok: true });
  });
}

export async function DELETE(req: Request, { params }: Ctx) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const { id } = await params;
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    await db.collection("adverts").doc(id).delete();
    refreshSite();
    return NextResponse.json({ ok: true });
  });
}
