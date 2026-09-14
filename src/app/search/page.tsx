import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { fetchSearch, fetchBreakingArticles } from "@/services/articles";
import { SearchForm } from "@/components/shared/SearchForm";

export const metadata: Metadata = {
  title: "Search",
  description: "Search TrendSpot.co.ke for entertainment, fashion, music and celebrity news.",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const [results, breaking] = await Promise.all([
    q ? fetchSearch(q) : Promise.resolve([]),
    fetchBreakingArticles(),
  ]);

  return (
    <>
      <SiteHeader breaking={breaking} />
      <main className="mx-auto max-w-[800px] px-4 py-8 sm:px-6">
        <h1 className="mb-4 font-[family-name:var(--font-bask)] text-[28px] font-bold">Search</h1>
        <SearchForm initialQuery={q} />
        {q && (
          <p className="mt-4 text-[13px] text-mid">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
          </p>
        )}
        {!q && (
          <p className="mt-8 text-center text-mid">
            Enter a search term to find articles, categories, tags and authors.
          </p>
        )}
        {q && results.length === 0 && (
          <p className="mt-8 text-center text-mid">No articles matched your search. Try different keywords.</p>
        )}
        <div className="mt-6 flex flex-col gap-5">
          {results.map((story) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className="grid grid-cols-[1fr_100px] gap-4 border-b border-border2 pb-5 sm:grid-cols-[1fr_140px]"
            >
              <div>
                <div className="mb-1 text-[9.5px] font-bold uppercase tracking-wider text-red">{story.category}</div>
                <div className="font-[family-name:var(--font-bask)] text-[16px] font-bold leading-[1.3]">{story.title}</div>
                <p className="mt-1 font-[family-name:var(--font-serif)] text-[13px] text-gray line-clamp-2">{story.excerpt}</p>
                <div className="mt-1 text-[11px] text-pale">By {story.author}</div>
              </div>
              <ArticleImage src={story.featuredImage.url} alt={story.featuredImage.alt} aspect="3/2" sizes="140px" />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
