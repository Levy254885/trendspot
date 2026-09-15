import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { formatRelative } from "@/lib/utils";

export function NewsRail({
  latest,
  mostRead,
}: {
  latest: Article[];
  mostRead: Article[];
}) {
  return (
    <section className="mb-12 grid grid-cols-1 gap-10 border-t border-[#e5e5e5] pt-8 lg:grid-cols-[1fr_300px] lg:gap-12">
      <div>
        <h2 className="mb-6 font-[family-name:var(--font-bask)] text-[22px] font-bold text-black">
          Latest
        </h2>
        <div className="flex flex-col">
          {latest.map((story, i) => (
            <Link
              key={story.id}
              href={`/article/${story.slug}`}
              className={`group grid grid-cols-[100px_1fr] gap-4 py-5 sm:grid-cols-[140px_1fr] sm:gap-5 ${
                i > 0 ? "border-t border-[#e5e5e5]" : ""
              }`}
            >
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="16/9"
                sizes="140px"
              />
              <div className="min-w-0">
                <h3 className="mb-2 font-[family-name:var(--font-bask)] text-[16px] font-bold leading-[1.3] text-black group-hover:underline sm:text-[18px]">
                  {story.title}
                </h3>
                <p className="mb-2 hidden text-[14px] leading-[1.45] text-[#3a3a3a] sm:line-clamp-2 sm:block">
                  {story.excerpt}
                </p>
                <div className="text-[13px] text-[#6e6e6e]">
                  <span>{formatRelative(story.publishedAt)}</span>
                  <span className="mx-2 text-[#ccc]">|</span>
                  <span>{story.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6 font-[family-name:var(--font-bask)] text-[22px] font-bold text-black">
          Most read
        </h2>
        <ol className="flex flex-col">
          {mostRead.map((story, i) => (
            <li
              key={story.id}
              className={`flex gap-3 py-4 ${i > 0 ? "border-t border-[#e5e5e5]" : ""}`}
            >
              <span className="w-8 shrink-0 font-[family-name:var(--font-bask)] text-[28px] font-bold leading-none text-[#bbb]">
                {i + 1}
              </span>
              <Link href={`/article/${story.slug}`} className="group min-w-0">
                <h3 className="mb-1 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.3] text-black group-hover:underline">
                  {story.title}
                </h3>
                <div className="text-[12px] text-[#6e6e6e]">{story.category}</div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
