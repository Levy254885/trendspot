import { NextResponse } from "next/server";
import { ApiError, run } from "@/lib/api";
import { MANAGERS, requireRole } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Removes an image from the library (the file stays on Cloudinary). */
export async function DELETE(req: Request, { params }: Ctx) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const { id } = await params;
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    await db.collection("media").doc(id).delete();
    return NextResponse.json({ ok: true });
  });
}
