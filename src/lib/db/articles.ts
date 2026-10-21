/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Firestore } from "firebase-admin/firestore";
import { ApiError, clean } from "@/lib/api";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { sanitizeHtml, stripTags } from "@/lib/sanitize";
import { estimateReadingTime, slugify } from "@/lib/utils";
import type { AdminSession, Article } from "@/types";

export type Doc = Record<string, any>;

export const ARTICLES = "articles";

/** Firestore document -> Article, with safe defaults for every field. */
export function toArticle(id: string, d: Doc): Article {
  const title = String(d.title || "");
  const fi = d.featuredImage || {};
  return {
    id,
    title,
    slug: String(d.slug || id),
    excerpt: String(d.excerpt || ""),
    body: String(d.body || ""),
    featuredImage: {
      url: fi.url || "/placeholder-article.svg",
      alt: fi.alt || title,
      publicId: fi.publicId || undefined,
      width: typeof fi.width === "number" ? fi.width : undefined,
      height: typeof fi.height === "number" ? fi.height : undefined,
      caption: fi.caption || undefined,
    },
    category: String(d.category || "Entertainment"),
    categorySlug: String(d.categorySlug || "entertainment"),
    tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
    author: String(d.author || "Staff Writer"),
    authorId: String(d.authorId || ""),
    publishedAt: d.publishedAt || null,
    updatedAt: String(d.updatedAt || d.createdAt || ""),
    createdAt: String(d.createdAt || ""),
    status: d.status || "draft",
    featured: Boolean(d.featured),
    breaking: Boolean(d.breaking),
    trending: Boolean(d.trending),
    views: Number(d.views) || 0,
    readingTime: Number(d.readingTime) || 1,
    seoTitle: d.seoTitle || undefined,
    seoDescription: d.seoDescription || undefined,
  };
}

/** Lighter shape for list screens (no body). */
export function toListItem(a: Article) {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    category: a.category,
    categorySlug: a.categorySlug,
    author: a.author,
    authorId: a.authorId,
    status: a.status,
    featured: a.featured,
    breaking: a.breaking,
    trending: a.trending,
    views: a.views,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    createdAt: a.createdAt,
    image: a.featuredImage.url,
  };
}

/** Validates the editor payload and returns the document to store. */
export function buildArticleData(
  input: Record<string, any>,
  session: AdminSession,
  existing: Doc | null
): Doc {
  const title = clean(input.title, 200);
  const excerpt = clean(input.excerpt, 400);
  if (title.length < 3) {
    throw new ApiError(400, "Please enter a headline (at least 3 characters).");
  }
  if (!excerpt) {
    throw new ApiError(400, "Please add a short summary for the article.");
  }

  const body = sanitizeHtml(String(input.body ?? ""));
  if (stripTags(body).trim().length < 20 && !/<img/i.test(body)) {
    throw new ApiError(400, "The article body is too short.");
  }

  const cat =
    CATEGORY_OPTIONS.find((c) => c.slug === input.categorySlug) ||
    CATEGORY_OPTIONS.find((c) => c.slug === "entertainment")!;

  const isAuthor = session.role === "author";
  const status = !isAuthor && input.status === "published" ? "published" : "draft";

  const fi = (input.featuredImage || {}) as Doc;
  const imageUrl =
    typeof fi.url === "string" && /^https:\/\//i.test(fi.url) ? fi.url : "";
  if (status === "published" && !imageUrl) {
    throw new ApiError(400, "Add a cover image before publishing.");
  }

  const now = new Date().toISOString();
  let publishedAt: string | null = null;
  if (status === "published") {
    const given =
      typeof input.publishedAt === "string" && !isNaN(Date.parse(input.publishedAt))
        ? new Date(input.publishedAt).toISOString()
        : null;
    publishedAt = given ?? existing?.publishedAt ?? now;
  }

  const tags: string[] = Array.isArray(input.tags)
    ? Array.from(
        new Set(
          input.tags
            .map((t: unknown) => clean(t, 40))
            .filter((t: string) => t.length > 0)
        )
      ).slice(0, 10) as string[]
    : [];

  return {
    title,
    excerpt,
    body,
    category: cat.name,
    categorySlug: cat.slug,
    tags,
    featuredImage: {
      url: imageUrl,
      publicId: clean(fi.publicId, 200),
      alt: clean(fi.alt, 200) || title,
      caption: clean(fi.caption, 300),
      width: typeof fi.width === "number" ? fi.width : 0,
      height: typeof fi.height === "number" ? fi.height : 0,
    },
    author: clean(input.author, 80) || existing?.author || session.name,
    authorId: existing?.authorId || session.uid,
    status,
    publishedAt,
    featured: !isAuthor && Boolean(input.featured),
    breaking: !isAuthor && Boolean(input.breaking),
    trending: !isAuthor && Boolean(input.trending),
    seoTitle: clean(input.seoTitle, 120),
    seoDescription: clean(input.seoDescription, 300),
    readingTime: estimateReadingTime(body),
    updatedAt: now,
    createdAt: existing?.createdAt || now,
    views: Number(existing?.views) || 0,
  };
}

/** A slug nobody else is using (adds -2, -3 … when needed). */
export async function uniqueSlug(
  db: Firestore,
  wanted: string,
  selfId?: string
): Promise<string> {
  const base = slugify(wanted).slice(0, 90) || "article";
  for (let i = 0; i < 30; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const snap = await db
      .collection(ARTICLES)
      .where("slug", "==", candidate)
      .limit(2)
      .get();
    if (snap.docs.every((d) => d.id === selfId)) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}
