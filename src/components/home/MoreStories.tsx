import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { formatRelative } from "@/lib/utils";

export function MoreStories({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="mb-14 border-t border-[#e5e5e5] pt-8">
      <h2 className="mb-6 font-[family-name:var(--font-bask)] text-[22px] font-bold text-black">
        More stories
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {stories.map((story) => (
          <Link key={story.id} href={`/article/${story.slug}`} className="group block">
            <ArticleImage
              src={story.featuredImage.url}
              alt={story.featuredImage.alt}
              aspect="16/9"
              className="mb-3"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <h3 className="mb-2 font-[family-name:var(--font-bask)] text-[17px] font-bold leading-[1.25] text-black group-hover:underline">
              {story.title}
            </h3>
            <div className="text-[13px] text-[#6e6e6e]">
              <span>{formatRelative(story.publishedAt)}</span>
              <span className="mx-2 text-[#ccc]">|</span>
              <span>{story.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
