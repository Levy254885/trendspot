import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { ArticleImage } from "@/components/shared/ArticleImage";
import {
  fetchArticleBySlug,
  fetchBreakingArticles,
  fetchMostRead,
  fetchRelated,
  fetchLatest,
} from "@/services/articles";
import { formatDate, formatViews, absoluteUrl } from "@/lib/utils";
import { ShareButtons } from "@/components/article/ShareButtons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: [article.author],
      images: [{ url: article.featuredImage.url }],
    },
    alternates: { canonical: absoluteUrl(`/article/${article.slug}`) },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) notFound();

  const [related, mostRead, latest, breaking] = await Promise.all([
    fetchRelated(article),
    fetchMostRead(5),
    fetchLatest(5),
    fetchBreakingArticles(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.featuredImage.url],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "TrendSpot.co.ke",
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    mainEntityOfPage: absoluteUrl(`/article/${article.slug}`),
  };

  return (
    <>
      <SiteHeader breaking={breaking} />
      <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <article>
            <div className="mb-3 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-red">
              <Link href={`/category/${article.categorySlug}`} className="hover:underline">
                {article.category}
              </Link>
            </div>
            <h1 className="mb-3 font-[family-name:var(--font-bask)] text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-black sm:text-[34px] md:text-[40px]">
              {article.title}
            </h1>
            <p className="mb-4 font-[family-name:var(--font-serif)] text-[16px] leading-[1.6] text-gray sm:text-[17px]">
              {article.excerpt}
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border2 pb-4 text-[12px] text-mid">
              <span className="font-semibold uppercase tracking-wider text-ink">By {article.author}</span>
              <span>·</span>
              <time dateTime={article.publishedAt || undefined}>{formatDate(article.publishedAt)}</time>
              <span>·</span>
              <span>{article.readingTime} min read</span>
              <span>·</span>
              <span>{formatViews(article.views)} views</span>
            </div>
            <ArticleImage
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              aspect="16/9"
              priority
              className="mb-6"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: article.body }} />
            {article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-border2 pt-5">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-mid hover:border-red hover:text-red"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <ShareButtons title={article.title} slug={article.slug} />
            {related.length > 0 && (
              <section className="mt-10 border-t border-border pt-6">
                <h2 className="mb-4 border-b-2 border-black pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
                  Related Stories
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link key={r.id} href={`/article/${r.slug}`} className="group">
                      <ArticleImage
                        src={r.featuredImage.url}
                        alt={r.featuredImage.alt}
                        aspect="3/2"
                        className="mb-2"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="text-[9.5px] font-bold uppercase tracking-wider text-red">{r.category}</div>
                      <div className="font-[family-name:var(--font-bask)] text-[14px] font-bold leading-[1.3] group-hover:text-red">{r.title}</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
          <aside className="space-y-8">
            <div>
              <span className="mb-0 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">Most Read</span>
              {mostRead.map((s, i) => (
                <Link key={s.id} href={`/article/${s.slug}`} className="block border-b border-border2 py-3 last:border-b-0">
                  <div className="mb-1 font-[family-name:var(--font-bask)] text-[18px] font-bold text-border">{String(i + 1).padStart(2, "0")}</div>
                  <div className="font-[family-name:var(--font-bask)] text-[13px] font-bold leading-[1.3]">{s.title}</div>
                </Link>
              ))}
            </div>
            <div>
              <span className="mb-0 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">Latest</span>
              {latest.map((s) => (
                <Link key={s.id} href={`/article/${s.slug}`} className="block border-b border-border2 py-3 last:border-b-0">
                  <div className="mb-0.5 text-[9.5px] font-bold uppercase tracking-wider text-red">{s.category}</div>
                  <div className="font-[family-name:var(--font-bask)] text-[13px] font-bold leading-[1.3]">{s.title}</div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
