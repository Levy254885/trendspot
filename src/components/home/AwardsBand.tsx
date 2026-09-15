import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

export function AwardsBand({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="mb-10 bg-black py-10">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="mb-6 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-red">
          Awards Season & Features
          <span className="h-px flex-1 bg-white/15" />
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
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
                className="mb-3"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
                {story.category}
              </div>
              <div className="font-[family-name:var(--font-bask)] text-[13px] font-bold leading-[1.35] text-white group-hover:text-red sm:text-[14px]">
                {story.title}
              </div>
              <div className="mt-1.5 text-[10px] font-medium text-white/40">
                By {story.author}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
