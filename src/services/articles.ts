/**
 * Public data layer.
 *
 * - When Firebase Admin credentials are configured, content comes from Firestore.
 * - Otherwise the site runs on the sample content in src/data/seed.ts.
 */
import { getDb, isAdminConfigured } from "@/lib/firebase/admin";
import { cached } from "@/lib/server-cache";
import { toArticle } from "@/lib/db/articles";
import {
  getPublishedArticles as seedPublished,
  seedCategories,
} from "@/data/seed";
import type { Article, Category } from "@/types";

const byDateDesc = (a: Article, b: Article) =>
  new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();

/** All live articles (published, and whose publish time has arrived), newest first. */
async function allPublished(): Promise<Article[]> {
  if (!isAdminConfigured()) return seedPublished();

  return cached("published-articles", 30_000, async () => {
    try {
      const db = getDb();
      if (!db) return [];
      const snap = await db
        .collection("articles")
        .where("status", "==", "published")
        .limit(1000)
        .get();
      const now = Date.now();
      const live = snap.docs
        .map((d) => toArticle(d.id, d.data()))
        .filter((a) => a.publishedAt && new Date(a.publishedAt).getTime() <= now)
        .sort(byDateDesc);

      // Guard against accidental double-publishes: keep one story per headline
      // (the earliest one, so the original URL stays live).
      const seen = new Map<string, Article>();
      for (const a of live) {
        const key = a.title.toLowerCase().replace(/\s+/g, " ").trim();
        const prev = seen.get(key);
        if (!prev || byDateDesc(a, prev) > 0) seen.set(key, a);
      }
      const keep = new Set(Array.from(seen.values()).map((a) => a.id));
      return live.filter((a) => keep.has(a.id));
    } catch (err) {
      console.error("Could not load articles from Firestore:", err);
      return [];
    }
  });
}

export async function fetchPublishedArticles(): Promise<Article[]> {
  return allPublished();
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const all = await allPublished();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function fetchArticlesByCategory(
  categorySlug: string
): Promise<Article[]> {
  const all = await allPublished();
  return all.filter((a) => a.categorySlug === categorySlug);
}

export async function fetchFeaturedArticle(): Promise<Article | null> {
  const all = await allPublished();
  return all.find((a) => a.featured) ?? all[0] ?? null;
}

export async function fetchBreakingArticles(): Promise<Article[]> {
  const all = await allPublished();
  return all.filter((a) => a.breaking || a.trending).slice(0, 10);
}

export async function fetchMostRead(limit = 5): Promise<Article[]> {
  const all = await allPublished();
  return [...all].sort((a, b) => b.views - a.views).slice(0, limit);
}

export async function fetchLatest(limit = 10): Promise<Article[]> {
  const all = await allPublished();
  return all.slice(0, limit);
}

export async function fetchSearch(query: string): Promise<Article[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const all = await allPublished();
  return all.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export async function fetchCategories(): Promise<Category[]> {
  return seedCategories;
}

export async function fetchCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return seedCategories.find((c) => c.slug === slug) ?? null;
}

export async function fetchRelated(
  article: Article,
  limit = 4
): Promise<Article[]> {
  const all = await allPublished();
  return all
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.categorySlug === article.categorySlug ||
          a.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, limit);
}

export async function fetchHomeData() {
  const [featured, mostReadAll, breaking, all] = await Promise.all([
    fetchFeaturedArticle(),
    fetchMostRead(1000),
    fetchBreakingArticles(),
    fetchPublishedArticles(),
  ]);

  // Every story is placed in exactly ONE block of the page. Blocks claim
  // stories in priority order, so nothing repeats down the homepage.
  const used = new Set<string>();
  if (featured) used.add(featured.id);

  const take = (list: Article[], n: number): Article[] => {
    const out: Article[] = [];
    for (const a of list) {
      if (out.length >= n) break;
      if (used.has(a.id)) continue;
      used.add(a.id);
      out.push(a);
    }
    return out;
  };
  const inCategory = (slug: string) => all.filter((a) => a.categorySlug === slug);

  const sideStories = take(all, 4);
  const fashion = take(inCategory("fashion"), 3);
  const music = take(inCategory("music"), 3);
  const celebrities = take(inCategory("celebrities"), 3);
  const latest = take(all, 4);
  const awards = take(inCategory("awards"), 4);
  const mostRead = take(mostReadAll, 5);
  const more = take(all, 4);
  if (awards.length < 4) awards.push(...take(all, 4 - awards.length));

  return {
    featured,
    sideStories,
    fashion,
    music,
    celebrities,
    latest,
    mostRead,
    breaking: breaking.slice(0, 6),
    awards,
    more,
  };
}
