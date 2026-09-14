import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { ArticleImage } from "@/components/shared/ArticleImage";
import {
  fetchArticlesByCategory,
  fetchCategoryBySlug,
  fetchBreakingArticles,
  fetchMostRead,
} from "@/services/articles";
import { formatRelative } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await fetchCategoryBySlug(slug);
  if (!cat) return { title: "Category" };
  return {
    title: `${cat.name} News`,
    description: `Latest ${cat.name.toLowerCase()} news, stories and features from TrendSpot.co.ke`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [cat, articles, breaking, mostRead] = await Promise.all([
    fetchCategoryBySlug(slug),
    fetchArticlesByCategory(slug),
    fetchBreakingArticles(),
    fetchMostRead(5),
  ]);
  if (!cat) notFound();

  const [featured, ...rest] = articles;

  return (
    <>
      <SiteHeader breaking={breaking} />
      <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6">
        <h1 className="mb-1 border-b-2 border-black pb-3 font-[family-name:var(--font-bask)] text-[28px] font-bold text-black sm:text-[32px]">
          {cat.name}
        </h1>
        {cat.description && (
          <p className="mb-6 mt-3 font-[family-name:var(--font-serif)] text-gray">
            {cat.description}
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            {featured && (
              <Link href={`/article/${featured.slug}`} className="mb-8 block">
                <ArticleImage
                  src={featured.featuredImage.url}
                  alt={featured.featuredImage.alt}
                  aspect="16/9"
                  priority
                  className="mb-3"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
                <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-red">
                  Featured
                </div>
                <h2 className="mb-2 font-[family-name:var(--font-bask)] text-[22px] font-bold leading-[1.2] sm:text-[26px]">
                  {featured.title}
                </h2>
                <p className="font-[family-name:var(--font-serif)] text-[14px] text-gray">
                  {featured.excerpt}
                </p>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-mid">
                  By {featured.author} · {formatRelative(featured.publishedAt)}
                </div>
              </Link>
            )}

            {rest.length === 0 && !featured && (
              <p className="py-12 text-center text-mid">No articles in this category yet.</p>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {rest.map((story) => (
                <Link key={story.id} href={`/article/${story.slug}`} className="group">
                  <ArticleImage
                    src={story.featuredImage.url}
                    alt={story.featuredImage.alt}
                    aspect="3/2"
                    className="mb-2"
                    sizes="(max-width: 640px) 100vw, 40vw"
                  />
                  <div className="mb-1 text-[9.5px] font-bold uppercase tracking-wider text-red">
                    {story.category}
                  </div>
                  <div className="font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.3] group-hover:text-red">
                    {story.title}
                  </div>
                  <div className="mt-1 text-[11px] text-pale">
                    By {story.author} · {story.readingTime} min
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside>
            <span className="mb-0 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
              Most Read
            </span>
            {mostRead.map((s, i) => (
              <Link
                key={s.id}
                href={`/article/${s.slug}`}
                className="block border-b border-border2 py-3 last:border-b-0"
              >
                <div className="mb-1 font-[family-name:var(--font-bask)] text-[18px] font-bold text-border">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-[family-name:var(--font-bask)] text-[13px] font-bold leading-[1.3]">
                  {s.title}
                </div>
              </Link>
            ))}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
