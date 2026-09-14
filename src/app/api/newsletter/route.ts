import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo. Replace with Firestore newsletterSubscribers collection.
const subscribers = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (subscribers.has(email)) {
      return NextResponse.json({ error: "This email is already subscribed." }, { status: 409 });
    }

    subscribers.add(email);
    // TODO: write to Firestore when configured
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to process subscription." }, { status: 500 });
  }
}
