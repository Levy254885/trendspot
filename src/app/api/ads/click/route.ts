import { NextResponse } from "next/server";
import { FieldValue, getDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

/** Counts an advert click, then sends the visitor to the advertiser's link. */
export async function GET(req: Request) {
  const home = new URL("/", req.url);
  try {
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!/^[A-Za-z0-9_-]{1,120}$/.test(id)) return NextResponse.redirect(home);

    const db = getDb();
    if (!db) return NextResponse.redirect(home);

    const ref = db.collection("adverts").doc(id);
    const snap = await ref.get();
    const link = String(snap.data()?.linkUrl || "");
    if (!snap.exists || !/^https?:\/\//i.test(link)) {
      return NextResponse.redirect(home);
    }

    if (!BOTS.test(req.headers.get("user-agent") || "")) {
      await ref.update({ clicks: FieldValue.increment(1) });
    }
    return NextResponse.redirect(link);
  } catch {
    return NextResponse.redirect(home);
  }
}
