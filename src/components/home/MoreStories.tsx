import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

export function MoreStories({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="mb-12 border-t border-border pt-6">
      <div className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
        More Stories
      </div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-5">
        {stories.map((story) => (
          <Link key={story.id} href={`/article/${story.slug}`} className="group block">
            <ArticleImage
              src={story.featuredImage.url}
              alt={story.featuredImage.alt}
              aspect="3/2"
              className="mb-2.5"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
              {story.category}
            </div>
            <div className="mb-1 font-[family-name:var(--font-bask)] text-[13px] font-bold leading-[1.3] text-black group-hover:text-red sm:text-[14px]">
              {story.title}
            </div>
            <div className="text-[10px] font-medium text-pale">
              By {story.author}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
