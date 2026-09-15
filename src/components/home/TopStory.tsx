import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { formatRelative } from "@/lib/utils";

export function TopStory({
  featured,
  sideStories,
}: {
  featured: Article;
  sideStories: Article[];
}) {
  return (
    <section className="mb-14 grid grid-cols-1 gap-8 border-b border-border pb-14 lg:grid-cols-[1fr_280px] lg:gap-8">
      <div className="overflow-hidden border border-border2 bg-white">
        <div className="border-b border-border2 px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-red">
            <span className="inline-block h-0.5 w-5 bg-red" />
            Top Story
          </div>
        </div>
        <Link href={`/article/${featured.slug}`} className="block">
          <ArticleImage
            src={featured.featuredImage.url}
            alt={featured.featuredImage.alt}
            aspect="16/9"
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
        </Link>
        <div className="p-5 sm:p-6">
          <h1 className="mb-4 font-[family-name:var(--font-bask)] text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-black sm:text-[32px] md:text-[36px]">
            <Link href={`/article/${featured.slug}`} className="transition-colors hover:text-red">
              {featured.title}
            </Link>
          </h1>
          <p className="mb-4 max-w-[36rem] font-[family-name:var(--font-serif)] text-[15px] leading-[1.7] text-gray sm:text-[16px]">
            {featured.excerpt}
          </p>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mid">
            By <span className="text-ink">{featured.author}</span>
            {" · "}
            {featured.readingTime} min read
            {" · "}
            {formatRelative(featured.publishedAt)}
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        {sideStories.map((story) => (
          <Link
            key={story.id}
            href={`/article/${story.slug}`}
            className="group block border border-border2 bg-white p-5 transition-colors hover:border-border"
          >
            <div className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-red">
              {story.category}
            </div>
            <div className="mb-2.5 font-[family-name:var(--font-bask)] text-[16px] font-bold leading-[1.35] text-black group-hover:text-red">
              {story.title}
            </div>
            <p className="mb-3 line-clamp-2 font-[family-name:var(--font-serif)] text-[13px] leading-[1.55] text-gray">
              {story.excerpt}
            </p>
            <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-mid">
              By {story.author}
            </div>
          </Link>
        ))}
      </aside>
    </section>
  );
}
