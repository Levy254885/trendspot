import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { formatTime } from "@/lib/utils";

export function NewsRail({
  latest,
  mostRead,
}: {
  latest: Article[];
  mostRead: Article[];
}) {
  const latestShown = latest.slice(0, 4);
  const mostReadShown = mostRead.slice(0, 5);

  return (
    <section className="mb-14 md:mb-16">
      {/* Mobile */}
      <div className="md:hidden">
        <div className="mb-14">
          <span className="mb-2 block border-b-2 border-black pb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink">
            Latest
          </span>
          <div className="flex flex-col">
            {latestShown.map((story, i) => (
              <Link
                key={story.id}
                href={`/article/${story.slug}`}
                className={`block py-6 ${i > 0 ? "border-t border-border2" : ""}`}
              >
                <div className="mb-2 text-[12px] font-semibold text-mid">
                  {formatTime(story.publishedAt)}
                </div>
                <div className="font-[family-name:var(--font-bask)] text-[18px] font-bold leading-[1.35] text-black">
                  {story.title}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block border-b-2 border-black pb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink">
            Most Read
          </span>
          <ol className="flex flex-col">
            {mostReadShown.map((story, i) => (
              <li
                key={story.id}
                className={`flex gap-5 py-6 ${i > 0 ? "border-t border-border2" : ""}`}
              >
                <span className="w-9 shrink-0 font-[family-name:var(--font-bask)] text-[24px] font-bold leading-none text-border">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link href={`/article/${story.slug}`} className="min-w-0">
                  <div className="font-[family-name:var(--font-bask)] text-[17px] font-bold leading-[1.35] text-black">
                    {story.title}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px]">
        <div className="border-r border-border pr-10">
          <span className="block border-b-2 border-black pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink">
            Latest
          </span>
          <div className="flex flex-col">
            {latestShown.map((story, i) => (
              <Link
                key={story.id}
                href={`/article/${story.slug}`}
                className={`group grid grid-cols-[1fr_140px] gap-8 py-7 ${
                  i > 0 ? "border-t border-border2" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red">
                    {story.category}
                  </div>
                  <div className="mb-2 font-[family-name:var(--font-bask)] text-[17px] font-bold leading-[1.35] text-black transition-colors group-hover:text-red">
                    {story.title}
                  </div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-pale">
                    {formatTime(story.publishedAt)}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <ArticleImage
                    src={story.featuredImage.url}
                    alt={story.featuredImage.alt}
                    aspect="3/2"
                    sizes="140px"
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="pl-10">
          <span className="block border-b-2 border-black pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink">
            Most Read
          </span>
          <ol className="flex flex-col">
            {mostReadShown.map((story, i) => (
              <li key={story.id} className={i > 0 ? "border-t border-border2" : ""}>
                <Link href={`/article/${story.slug}`} className="group flex gap-4 py-6">
                  <span className="w-8 shrink-0 font-[family-name:var(--font-bask)] text-[22px] font-bold leading-none text-border">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.4] text-black transition-colors group-hover:text-red">
                    {story.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
