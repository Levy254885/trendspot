import { NextResponse } from "next/server";
import { ApiError, readJson, run } from "@/lib/api";
import { MANAGERS, requireRole } from "@/lib/auth/server";
import { getDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    const snap = await db
      .collection("contactMessages")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();
    return NextResponse.json({
      messages: snap.docs.map((d) => {
        const x = d.data();
        return {
          id: d.id,
          name: String(x.name || ""),
          email: String(x.email || ""),
          subject: String(x.subject || ""),
          message: String(x.message || ""),
          read: Boolean(x.read),
          createdAt: String(x.createdAt || ""),
        };
      }),
    });
  });
}

export async function PATCH(req: Request) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const input = await readJson(req);
    const id = typeof input.id === "string" ? input.id : "";
    if (!id) throw new ApiError(400, "Missing id.");
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    await db
      .collection("contactMessages")
      .doc(id)
      .update({ read: input.read !== false });
    return NextResponse.json({ ok: true });
  });
}

export async function DELETE(req: Request) {
  return run(async () => {
    await requireRole(req, MANAGERS);
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!id) throw new ApiError(400, "Missing id.");
    const db = getDb();
    if (!db) throw new ApiError(503, "Firebase is not configured.");
    await db.collection("contactMessages").doc(id).delete();
    return NextResponse.json({ ok: true });
  });
}
