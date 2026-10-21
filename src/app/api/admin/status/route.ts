import { NextResponse } from "next/server";
import { run } from "@/lib/api";
import { getSession } from "@/lib/auth/server";
import { getDb, isAdminConfigured } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

/** Connection check shown on the Settings screen. */
export async function GET(req: Request) {
  return run(async () => {
    await getSession(req);

    let firestore: "ok" | string = "not configured";
    let articleCount = 0;
    if (isAdminConfigured()) {
      try {
        const db = getDb();
        if (db) {
          const c = await db.collection("articles").count().get();
          articleCount = c.data().count;
          firestore = "ok";
        }
      } catch (e) {
        firestore =
          e instanceof Error
            ? e.message
            : "Could not reach Firestore. Is the database created?";
      }
    }

    return NextResponse.json({
      firebaseAdmin: isAdminConfigured(),
      firestore,
      articleCount,
      clientConfig: Boolean(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      ),
      cloudinaryCloud: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
      cloudinaryPreset: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET),
      ownerEmails: (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean).length,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
    });
  });
}
