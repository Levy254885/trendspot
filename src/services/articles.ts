import {
  getPublishedArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getFeaturedArticle,
  getBreakingArticles,
  getMostRead,
  getLatest,
  searchArticles,
  seedCategories,
} from "@/data/seed";
import type { Article, Category } from "@/types";

/**
 * Article data layer.
 * Currently backed by seed data. Replace implementations with Firestore
 * queries when Firebase credentials are configured.
 */
export async function fetchPublishedArticles(): Promise<Article[]> {
  return getPublishedArticles();
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  return getArticleBySlug(slug) ?? null;
}

export async function fetchArticlesByCategory(
  categorySlug: string
): Promise<Article[]> {
  return getArticlesByCategory(categorySlug);
}

export async function fetchFeaturedArticle(): Promise<Article | null> {
  return getFeaturedArticle() ?? null;
}

export async function fetchBreakingArticles(): Promise<Article[]> {
  return getBreakingArticles();
}

export async function fetchMostRead(limit = 5): Promise<Article[]> {
  return getMostRead(limit);
}

export async function fetchLatest(limit = 10): Promise<Article[]> {
  return getLatest(limit);
}

export async function fetchSearch(query: string): Promise<Article[]> {
  return searchArticles(query);
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
  return getPublishedArticles()
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.categorySlug === article.categorySlug ||
          a.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, limit);
}

export async function fetchHomeData() {
  const [featured, latest, mostRead, breaking, all] = await Promise.all([
    fetchFeaturedArticle(),
    fetchLatest(12),
    fetchMostRead(5),
    fetchBreakingArticles(),
    fetchPublishedArticles(),
  ]);

  const sideStories = all
    .filter((a) => a.id !== featured?.id)
    .slice(0, 4);

  const fashion = all.filter((a) => a.categorySlug === "fashion").slice(0, 3);
  const music = all.filter((a) => a.categorySlug === "music").slice(0, 3);
  const celebrities = all
    .filter((a) => a.categorySlug === "celebrities")
    .slice(0, 3);
  const awards = all.filter((a) => a.categorySlug === "awards").slice(0, 4);
  const more = all.filter((a) => a.id !== featured?.id).slice(4, 8);

  return {
    featured,
    sideStories,
    fashion,
    music,
    celebrities,
    latest: latest.slice(0, 4),
    mostRead,
    breaking,
    awards,
    more,
  };
}
