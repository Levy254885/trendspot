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
    <section className="mb-10 border-b border-border pb-10 md:mb-7 md:pb-7">
      <div className="md:hidden">
        <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-red">
          Top Story
        </div>
        <Link href={`/article/${featured.slug}`} className="block">
          <ArticleImage
            src={featured.featuredImage.url}
            alt={featured.featuredImage.alt}
            aspect="16/9"
            priority
            sizes="100vw"
            className="mb-4"
          />
        </Link>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red">
          {featured.category}
        </div>
        <h1 className="mb-3 font-[family-name:var(--font-bask)] text-[28px] font-bold leading-[1.18] tracking-[-0.015em] text-black">
          <Link href={`/article/${featured.slug}`}>{featured.title}</Link>
        </h1>
        <p className="mb-3 font-[family-name:var(--font-serif)] text-[16px] leading-[1.6] text-gray">
          {featured.excerpt}
        </p>
        <div className="mb-8 text-[12px] font-semibold uppercase tracking-wider text-mid">
          By {featured.author} · {formatRelative(featured.publishedAt)}
        </div>

        <div className="flex flex-col gap-6">
          {sideStories.map((story) => (
            <Link key={story.id} href={`/article/${story.slug}`} className="group block">
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="16/9"
                sizes="100vw"
                className="mb-3"
              />
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-red">
                {story.category}
              </div>
              <div className="mb-1.5 font-[family-name:var(--font-bask)] text-[20px] font-bold leading-[1.25] text-black">
                {story.title}
              </div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-mid">
                By {story.author}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_320px]">
        <div className="border-r border-border pr-7">
          <div className="mb-2.5 flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-red">
            <span className="inline-block h-0.5 w-6 bg-red" aria-hidden />
            Top Story · Cover
          </div>
          <Link href={`/article/${featured.slug}`} className="group block overflow-hidden">
            <ArticleImage
              src={featured.featuredImage.url}
              alt={featured.featuredImage.alt}
              aspect="16/9"
              priority
              sizes="(max-width: 1280px) 70vw, 800px"
              className="mb-4 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
          <h1 className="mb-3 font-[family-name:var(--font-bask)] text-[32px] font-bold leading-[1.15] tracking-[-0.01em] text-black lg:text-[36px]">
            <Link href={`/article/${featured.slug}`} className="transition-colors hover:text-red">
              {featured.title}
            </Link>
          </h1>
          <p className="mb-3.5 max-w-[36rem] font-[family-name:var(--font-serif)] text-[15px] leading-[1.65] text-gray">
            {featured.excerpt}
          </p>
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-mid">
            By <span className="text-ink">{featured.author}</span>
            {" · "}
            {featured.readingTime} min read
            {" · "}
            {formatRelative(featured.publishedAt)}
          </div>
        </div>

        <aside className="flex flex-col pl-6">
          {sideStories.slice(0, 3).map((story, i) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className={`group border-b border-border2 py-4 transition-opacity hover:opacity-80 ${
                i === 0 ? "pt-0" : ""
              } ${i === Math.min(sideStories.length, 3) - 1 ? "border-b-0 pb-0" : ""}`}
            >
              <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-red">
                {story.category}
              </div>
              <div className="mb-1.5 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.3] text-black group-hover:text-red lg:text-[16px]">
                {story.title}
              </div>
              <p className="mb-1.5 line-clamp-2 font-[family-name:var(--font-serif)] text-[12.5px] leading-[1.55] text-gray">
                {story.excerpt}
              </p>
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-mid">
                By {story.author}
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </section>
  );
}
