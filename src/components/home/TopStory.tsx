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
    <section className="mb-10 grid grid-cols-1 gap-0 border-b border-border pb-10 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
      <div className="lg:border-r lg:border-border lg:pr-8">
        <div className="mb-3 flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-red">
          <span className="inline-block h-0.5 w-5 bg-red" />
          Top Story
        </div>
        <Link href={`/article/${featured.slug}`} className="block">
          <ArticleImage
            src={featured.featuredImage.url}
            alt={featured.featuredImage.alt}
            aspect="16/9"
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="mb-5"
          />
        </Link>
        <h1 className="mb-4 font-[family-name:var(--font-bask)] text-[26px] font-bold leading-[1.18] tracking-[-0.015em] text-black sm:text-[32px] md:text-[38px]">
          <Link href={`/article/${featured.slug}`} className="transition-colors hover:text-red">
            {featured.title}
          </Link>
        </h1>
        <p className="mb-4 max-w-[42rem] font-[family-name:var(--font-serif)] text-[15px] leading-[1.7] text-gray sm:text-[16px]">
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

      <aside className="mt-8 flex flex-col lg:mt-0 lg:pl-7">
        {sideStories.map((story, i) => (
          <Link
            key={story.id}
            href={`/article/${story.slug}`}
            className={`group border-b border-border2 py-5 transition-opacity hover:opacity-90 ${
              i === 0 ? "pt-0" : ""
            } ${i === sideStories.length - 1 ? "border-b-0 pb-0" : ""}`}
          >
            <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-red">
              {story.category}
            </div>
            <div className="mb-2 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.35] text-black group-hover:text-red sm:text-[16px]">
              {story.title}
            </div>
            <p className="mb-2 line-clamp-2 font-[family-name:var(--font-serif)] text-[13px] leading-[1.55] text-gray">
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
