import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

export function MoreStories({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="mb-16 md:mb-20">
      <span className="mb-8 block border-b-2 border-black pb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink md:text-[10px]">
        More Stories
      </span>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
        {stories.slice(0, 3).map((story) => (
          <Link key={story.id} href={`/article/${story.slug}`} className="group block">
            <div className="mb-4 overflow-hidden">
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="16/9"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red md:text-[10px]">
              {story.category}
            </div>
            <div className="font-[family-name:var(--font-bask)] text-[19px] font-bold leading-[1.35] text-black transition-colors group-hover:text-red md:text-[17px]">
              {story.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
