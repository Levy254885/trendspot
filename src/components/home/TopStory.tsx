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
    <section className="mb-7 grid grid-cols-1 gap-0 border-b border-border pb-7 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
      <div className="lg:border-r lg:border-border lg:pr-7">
        <div className="mb-2.5 flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-red">
          <span className="inline-block h-0.5 w-6 bg-red" />
          Top Story · Cover
        </div>
        <Link href={`/article/${featured.slug}`}>
          <ArticleImage
            src={featured.featuredImage.url}
            alt={featured.featuredImage.alt}
            aspect="16/9"
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="mb-4"
          />
        </Link>
        <h1 className="mb-3 font-[family-name:var(--font-bask)] text-[24px] font-bold leading-[1.15] tracking-[-0.01em] text-black sm:text-[28px] md:text-[34px]">
          <Link href={`/article/${featured.slug}`} className="hover:text-red">
            {featured.title}
          </Link>
        </h1>
        <p className="mb-3.5 font-[family-name:var(--font-serif)] text-[14px] leading-[1.65] text-gray sm:text-[15px]">
          {featured.excerpt}
        </p>
        <div className="text-[11.5px] font-semibold uppercase tracking-wider text-mid">
          By <span className="text-ink">{featured.author}</span>
          {" · "}
          {featured.readingTime} min read
          {" · "}
          {formatRelative(featured.publishedAt)}
        </div>
      </div>

      <div className="mt-6 flex flex-col lg:mt-0 lg:pl-6">
        {sideStories.map((story, i) => (
          <Link
            key={story.id}
            href={`/article/${story.slug}`}
            className={`border-b border-border2 py-4 transition-opacity hover:opacity-80 ${
              i === 0 ? "pt-0" : ""
            } ${i === sideStories.length - 1 ? "border-b-0 pb-0" : ""}`}
          >
            <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-red">
              {story.category}
            </div>
            <div className="mb-1 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.3] text-black">
              {story.title}
            </div>
            {story.excerpt && i < 3 && (
              <div className="mb-1.5 font-[family-name:var(--font-serif)] text-[12.5px] leading-[1.55] text-gray">
                {story.excerpt}
              </div>
            )}
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-mid">
              By {story.author}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
