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
    <section className="mb-10 grid grid-cols-1 gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_240px] xl:grid-cols-[1fr_260px] lg:gap-0">
      <div className="lg:border-r lg:border-border lg:pr-8">
        <span className="mb-1 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
          Latest News
        </span>
        <div className="flex flex-col">
          {latest.map((story) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className="group grid grid-cols-[1fr_88px] gap-4 border-b border-border2 py-4 transition-opacity hover:opacity-90 sm:grid-cols-[1fr_110px] last:border-b-0"
            >
              <div className="min-w-0">
                <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
                  {story.category}
                </div>
                <div className="mb-1.5 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.35] text-black group-hover:text-red">
                  {story.title}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-pale">
                  By {story.author} · {formatTime(story.publishedAt)}
                </div>
              </div>
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="3/2"
                sizes="110px"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="lg:pl-7">
        <span className="mb-1 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
          Most Read
        </span>
        <div className="flex flex-col">
          {mostRead.map((story, i) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className="group border-b border-border2 py-4 transition-opacity hover:opacity-90 last:border-b-0"
            >
              <div className="mb-1.5 font-[family-name:var(--font-bask)] text-[22px] font-bold leading-none text-border">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mb-1 font-[family-name:var(--font-bask)] text-[14px] font-bold leading-[1.35] text-black group-hover:text-red">
                {story.title}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-pale">
                {formatViews(story.views)} views
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
