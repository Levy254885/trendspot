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
    <section className="mb-10 border-b border-border pb-10 md:mb-8 md:pb-8">
      <div className="md:hidden">
        <div className="mb-10">
          <span className="mb-5 block border-b-2 border-black pb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-mid">
            Latest News
          </span>
          <div className="flex flex-col">
            {latest.map((story, i) => (
              <Link
                key={story.id}
                href={`/article/${story.slug}`}
                className={`block py-5 ${i > 0 ? "border-t border-border2" : ""}`}
              >
                <div className="mb-1.5 text-[12px] font-semibold text-mid">
                  {formatTime(story.publishedAt)}
                </div>
                <div className="font-[family-name:var(--font-bask)] text-[18px] font-bold leading-[1.3] text-black">
                  {story.title}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-5 block border-b-2 border-black pb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-mid">
            Most Read
          </span>
          <ol className="flex flex-col">
            {mostRead.map((story, i) => (
              <li
                key={story.id}
                className={`flex gap-4 py-5 ${i > 0 ? "border-t border-border2" : ""}`}
              >
                <span className="w-9 shrink-0 font-[family-name:var(--font-bask)] text-[24px] font-bold leading-none text-border">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link href={`/article/${story.slug}`} className="min-w-0">
                  <div className="font-[family-name:var(--font-bask)] text-[17px] font-bold leading-[1.3] text-black">
                    {story.title}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="hidden grid-cols-1 gap-8 md:grid lg:grid-cols-[1fr_260px] lg:gap-0">
        <div className="lg:border-r lg:border-border lg:pr-8">
          <span className="mb-1 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
            Latest News
          </span>
          <div className="flex flex-col">
            {latest.map((story) => (
              <Link
                key={story.id}
                href={`/article/${story.slug}`}
                className="group grid grid-cols-[1fr_110px] gap-4 border-b border-border2 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
                    {story.category}
                  </div>
                  <div className="mb-1 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.3] text-black group-hover:text-red">
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
                  sizes="110px"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:pl-6">
          <span className="mb-1 block border-b-2 border-black pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
            Most Read
          </span>
          <div className="flex flex-col">
            {mostRead.map((story, i) => (
              <Link
                key={story.id}
                href={`/article/${story.slug}`}
                className="group border-b border-border2 py-3.5 last:border-b-0"
              >
                <div className="mb-1 font-[family-name:var(--font-bask)] text-[20px] font-bold leading-none text-border">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mb-1 font-[family-name:var(--font-bask)] text-[13.5px] font-bold leading-[1.3] text-black group-hover:text-red">
                  {story.title}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-pale">
                  {formatViews(story.views)} views
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
