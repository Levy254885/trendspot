import { NextResponse } from "next/server";
import { FieldValue, getDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

/** Counts one advert impression (called once per ad per session). */
export async function POST(req: Request) {
  try {
    if (BOTS.test(req.headers.get("user-agent") || "")) {
      return NextResponse.json({ counted: false });
    }
    const body = await req.json().catch(() => ({}));
    const id = typeof body.id === "string" ? body.id : "";
    if (!/^[A-Za-z0-9_-]{1,120}$/.test(id)) {
      return NextResponse.json({ counted: false }, { status: 400 });
    }
    const db = getDb();
    if (!db) return NextResponse.json({ counted: false });
    await db
      .collection("adverts")
      .doc(id)
      .update({ impressions: FieldValue.increment(1) });
    return NextResponse.json({ counted: true });
  } catch {
    return NextResponse.json({ counted: false });
  }
}
