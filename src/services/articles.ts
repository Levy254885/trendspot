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
  const [featured, mostRead, breaking, all] = await Promise.all([
    fetchFeaturedArticle(),
    fetchMostRead(5),
    fetchBreakingArticles(),
    fetchPublishedArticles(),
  ]);

  // Top story: 4 side stories next to the cover story.
  const sideStories = all
    .filter((a) => a.id !== featured?.id)
    .slice(0, 4);

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
