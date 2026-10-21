import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

// Used only when Firebase isn't configured (local demo).
const demoSubscribers = new Set<string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const db = getDb();
    if (!db) {
      if (demoSubscribers.has(email)) {
        return NextResponse.json(
          { error: "This email is already subscribed." },
          { status: 409 }
        );
      }
      demoSubscribers.add(email);
      return NextResponse.json({ ok: true });
    }

    // The document id is derived from the email, so duplicates are rejected.
    const id = Buffer.from(email).toString("base64url");
    try {
      await db.collection("newsletterSubscribers").doc(id).create({
        email,
        subscribedAt: new Date().toISOString(),
        active: true,
        source: "website",
      });
    } catch (e) {
      const code = (e as { code?: number | string }).code;
      if (code === 6 || code === "already-exists") {
        return NextResponse.json(
          { error: "This email is already subscribed." },
          { status: 409 }
        );
      }
      throw e;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Unable to process subscription." },
      { status: 500 }
    );
  }
}
