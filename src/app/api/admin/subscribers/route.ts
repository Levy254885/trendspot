import { NextResponse } from "next/server";
import { ApiError, run } from "@/lib/api";
import { MANAGERS, requireRole } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    const snap = await db
      .collection("newsletterSubscribers")
      .orderBy("subscribedAt", "desc")
      .limit(5000)
      .get();
    return NextResponse.json({
      subscribers: snap.docs.map((d) => ({
        id: d.id,
        email: String(d.data().email || ""),
        subscribedAt: String(d.data().subscribedAt || ""),
        source: String(d.data().source || "website"),
      })),
    });
  });
}

export async function DELETE(req: Request) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!id) throw new ApiError(400, "Missing id.");
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    await db.collection("newsletterSubscribers").doc(id).delete();
    return NextResponse.json({ ok: true });
  });
}
