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
      return snap.docs
        .map((d) => toArticle(d.id, d.data()))
        .filter((a) => a.publishedAt && new Date(a.publishedAt).getTime() <= now)
        .sort(byDateDesc);
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
  const [featured, mostRead, breaking, all] = await Promise.all([
    fetchFeaturedArticle(),
    fetchMostRead(5),
    fetchBreakingArticles(),
    fetchPublishedArticles(),
  ]);

  // Top story: 4 side stories next to the cover story.
  const sideStories = all.filter((a) => a.id !== featured?.id).slice(0, 4);

  // Latest News: 4 rows that aren't already showing in the top story block.
  const topIds = new Set([featured?.id, ...sideStories.map((a) => a.id)]);
  const latest = all.filter((a) => !topIds.has(a.id)).slice(0, 4);

  // Editorial grid: 3 stories per column.
  const inSection = (slug: string) =>
    all.filter((a) => a.categorySlug === slug && a.id !== featured?.id).slice(0, 3);
  const fashion = inSection("fashion");
  const music = inSection("music");
  const celebrities = inSection("celebrities");

  const awardsRaw = all.filter((a) => a.categorySlug === "awards");
  const awards =
    awardsRaw.length >= 4
      ? awardsRaw.slice(0, 4)
      : all.filter((a) => a.id !== featured?.id).slice(0, 4);
  const more = all.filter((a) => a.id !== featured?.id).slice(3, 7);

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
