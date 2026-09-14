import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { formatTime, formatViews } from "@/lib/utils";

export function NewsRail({
  latest,
  mostRead,
}: {
  latest: Article[];
  mostRead: Article[];
}) {
  return (
    <section className="mb-7 grid grid-cols-1 gap-6 border-b border-border pb-7 lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_280px] lg:gap-0">
      <div className="lg:border-r lg:border-border lg:pr-7">
        <span className="mb-0 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
          Latest News
        </span>
        <div className="flex flex-col">
          {latest.map((story) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className="grid grid-cols-[1fr_90px] gap-3 border-b border-border2 py-3.5 transition-opacity hover:opacity-80 sm:grid-cols-[1fr_100px] sm:gap-4 last:border-b-0"
            >
              <div>
                <div className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
                  {story.category}
                </div>
                <div className="mb-1 font-[family-name:var(--font-bask)] text-[14px] font-bold leading-[1.3] text-black">
                  {story.title}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-pale">
                  By {story.author} · {formatTime(story.publishedAt)}
                </div>
              </div>
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="3/2"
                sizes="100px"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="lg:pl-6">
        <span className="mb-0 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
          Most Read
        </span>
        <div className="flex flex-col">
          {mostRead.map((story, i) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className="border-b border-border2 py-3 transition-opacity hover:opacity-80 last:border-b-0"
            >
              <div className="mb-1 font-[family-name:var(--font-bask)] text-[20px] font-bold leading-none text-border">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mb-1 font-[family-name:var(--font-bask)] text-[13px] font-bold leading-[1.3] text-black">
                {story.title}
              </div>
              <div className="text-[10px] text-pale">
                {story.category} · {formatViews(story.views)} views
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
