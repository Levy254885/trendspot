import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

export function MoreStories({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="mb-12 border-t border-border pt-8 md:mb-12 md:pt-6">
      <div className="mb-6 text-[11px] font-extrabold uppercase tracking-[0.18em] text-mid md:mb-5 md:text-[10px]">
        More Stories
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
        {stories.map((story) => (
          <Link key={story.id} href={`/article/${story.slug}`} className="group block">
            <ArticleImage
              src={story.featuredImage.url}
              alt={story.featuredImage.alt}
              aspect="16/9"
              className="mb-3 md:mb-2.5"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            />
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-red md:mb-1 md:text-[9.5px]">
              {story.category}
            </div>
            <div className="mb-1.5 font-[family-name:var(--font-bask)] text-[18px] font-bold leading-[1.3] text-black group-hover:text-red md:mb-1 md:text-[14px]">
              {story.title}
            </div>
            <div className="text-[11px] font-medium text-pale md:text-[10px]">
              By {story.author}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
