import { NextResponse } from "next/server";
import { FieldValue, getDb } from "@/lib/firebase/admin";
import { nairobiDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

/**
 * Counts one view of an article.
 * The browser calls this once per article per session (see ViewTracker), and
 * known crawlers are ignored. Increments the article total and today's stats.
 */
export async function POST(req: Request) {
  try {
    if (BOTS.test(req.headers.get("user-agent") || "")) {
      return NextResponse.json({ counted: false });
    }
    const body = await req.json().catch(() => ({}));
    const id = typeof body.articleId === "string" ? body.articleId : "";
    if (!/^[A-Za-z0-9_-]{1,120}$/.test(id)) {
      return NextResponse.json({ counted: false }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ counted: false });

    const ref = db.collection("articles").doc(id);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.status !== "published") {
      return NextResponse.json({ counted: false }, { status: 404 });
    }

    const batch = db.batch();
    batch.update(ref, { views: FieldValue.increment(1) });
    batch.set(
      db.collection("dailyStats").doc(nairobiDate()),
      {
        date: nairobiDate(),
        views: FieldValue.increment(1),
        articles: { [id]: FieldValue.increment(1) },
      },
      { merge: true }
    );
    await batch.commit();
    return NextResponse.json({ counted: true });
  } catch (e) {
    console.error("view count failed", e);
    return NextResponse.json({ counted: false }, { status: 500 });
  }
}
