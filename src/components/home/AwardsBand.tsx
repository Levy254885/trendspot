import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

export function AwardsBand({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="mb-7 bg-black py-7">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="mb-4 flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-red">
          Awards Season & Features
          <span className="h-px flex-1 bg-white/12" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {stories.map((story) => (
            <Link key={story.id} href={`/article/${story.slug}`} className="group">
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
              <div className="font-[family-name:var(--font-bask)] text-[13px] font-bold leading-[1.3] text-white group-hover:text-red sm:text-[14px]">
                {story.title}
              </div>
              <div className="mt-1 text-[10px] font-medium text-white/35">
                By {story.author}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
