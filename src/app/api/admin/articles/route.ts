import { NextRequest, NextResponse } from "next/server";
import { slugify, estimateReadingTime } from "@/lib/utils";

/**
 * Article create endpoint.
 * When Firebase Admin is configured, writes to Firestore.
 * Otherwise returns a success payload for UI feedback (seed mode).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
    const articleBody = typeof body.body === "string" ? body.body : "";
    const categorySlug =
      typeof body.categorySlug === "string" ? body.categorySlug : "entertainment";

    if (!title || !excerpt || !articleBody) {
      return NextResponse.json(
        { error: "Title, excerpt and body are required." },
        { status: 400 }
      );
    }

    // Basic HTML sanitization: strip script tags
    const safeBody = articleBody
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/\son\w+=["'][^"']*["']/gi, "");

    const slug = slugify(title);
    const now = new Date().toISOString();
    const payload = {
      title,
      slug,
      excerpt,
      body: safeBody,
      categorySlug,
      tags: Array.isArray(body.tags) ? body.tags : [],
      featured: Boolean(body.featured),
      breaking: Boolean(body.breaking),
      trending: Boolean(body.trending),
      status: body.status === "published" ? "published" : "draft",
      seoTitle: body.seoTitle || title,
      seoDescription: body.seoDescription || excerpt,
      readingTime: estimateReadingTime(safeBody),
      views: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: body.status === "published" ? now : null,
      featuredImage: {
        url: `https://picsum.photos/seed/${slug}/1200/675`,
        alt: title,
      },
      author: "Staff Writer",
      authorId: "staff",
      category: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
    };

    try {
      const { getAdminDb, isAdminConfigured } = await import(
        "@/lib/firebase/admin"
      );
      if (isAdminConfigured()) {
        const db = await getAdminDb();
        if (db) {
          const ref = await db.collection("articles").add(payload);
          return NextResponse.json({ ok: true, id: ref.id, slug });
        }
      }
    } catch {
      // fall through to seed-mode response
    }

    return NextResponse.json({
      ok: true,
      id: null,
      slug,
      message:
        "Article validated. Configure Firebase Admin to persist to Firestore.",
      preview: payload,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 500 });
  }
}
