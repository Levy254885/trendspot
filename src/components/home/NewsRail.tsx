import type { Article } from "@/types";
import { StoryCard } from "@/components/shared/StoryCard";
import { formatViews } from "@/lib/utils";
import Link from "next/link";

export function NewsRail({
  latest,
  mostRead,
}: {
  latest: Article[];
  mostRead: Article[];
}) {
  return (
    <section className="mb-14 grid grid-cols-1 gap-10 border-b border-border pb-14 lg:grid-cols-[1fr_240px] lg:gap-8">
      <div>
        <span className="mb-5 block border-b-2 border-black pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
          Latest News
        </span>
        <div className="flex flex-col gap-4">
          {latest.map((story) => (
            <StoryCard key={story.id} article={story} variant="rail" />
          ))}
        </div>
      </div>

      <div>
        <span className="mb-5 block border-b-2 border-black pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
          Most Read
        </span>
        <div className="flex flex-col gap-4">
          {mostRead.map((story, i) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className="group block border border-border2 bg-white p-4 transition-colors hover:border-border"
            >
              <div className="mb-2 font-[family-name:var(--font-bask)] text-[22px] font-bold leading-none text-border">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mb-2 font-[family-name:var(--font-bask)] text-[14px] font-bold leading-[1.35] text-black group-hover:text-red">
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
