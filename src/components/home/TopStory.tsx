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
    <section className="mb-14 border-b border-border pb-14 md:mb-16 md:pb-16">
      {/* Mobile: one big story, then a calm list of headlines */}
      <div className="md:hidden">
        <Link href={`/article/${featured.slug}`} className="block">
          <ArticleImage
            src={featured.featuredImage.url}
            alt={featured.featuredImage.alt}
            aspect="16/9"
            priority
            accent
            sizes="100vw"
            className="mb-5"
          />
        </Link>
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-red">
          {featured.category}
        </div>
        <h1 className="mb-4 font-[family-name:var(--font-bask)] text-[28px] font-bold leading-[1.2] tracking-[-0.015em] text-black">
          <Link href={`/article/${featured.slug}`}>{featured.title}</Link>
        </h1>
        <div className="text-[12px] font-semibold uppercase tracking-wider text-mid">
          By {featured.author} · {formatRelative(featured.publishedAt)}
        </div>

        <div className="mt-10 flex flex-col">
          {sideStories.slice(0, 3).map((story) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className="block border-t border-border2 py-6"
            >
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-red">
                {story.category}
              </div>
              <div className="font-[family-name:var(--font-bask)] text-[19px] font-bold leading-[1.3] text-black">
                {story.title}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_320px]">
        <div className="border-r border-border pr-10">
          <Link href={`/article/${featured.slug}`} className="group block overflow-hidden">
            <ArticleImage
              src={featured.featuredImage.url}
              alt={featured.featuredImage.alt}
              aspect="16/9"
              priority
              accent
              sizes="(max-width: 1280px) 70vw, 800px"
              className="mb-6 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
          <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-red">
            {featured.category}
          </div>
          <h1 className="mb-4 font-[family-name:var(--font-bask)] text-[34px] font-bold leading-[1.18] tracking-[-0.01em] text-black lg:text-[38px]">
            <Link href={`/article/${featured.slug}`} className="transition-colors hover:text-red">
              {featured.title}
            </Link>
          </h1>
          <p className="mb-5 line-clamp-2 max-w-[36rem] font-[family-name:var(--font-serif)] text-[16px] leading-[1.7] text-gray">
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

        <aside className="flex flex-col pl-10">
          {sideStories.slice(0, 3).map((story, i, arr) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className={`group py-7 transition-opacity hover:opacity-80 ${
                i === 0 ? "pt-0" : ""
              } ${i === arr.length - 1 ? "pb-0" : "border-b border-border2"}`}
            >
              <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-red">
                {story.category}
              </div>
              <div className="font-[family-name:var(--font-bask)] text-[17px] font-bold leading-[1.35] text-black group-hover:text-red">
                {story.title}
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </section>
  );
}
