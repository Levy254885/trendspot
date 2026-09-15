import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

export function MoreStories({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="mb-16">
      <div className="mb-10 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
        More Stories
      </div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/article/${story.slug}`}
            className="group"
          >
            <ArticleImage
              src={story.featuredImage.url}
              alt={story.featuredImage.alt}
              aspect="3/2"
              className="mb-5"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
              {story.category}
            </div>
            <div className="mb-2 font-[family-name:var(--font-bask)] text-[16px] font-bold leading-[1.35] text-black group-hover:text-red">
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
