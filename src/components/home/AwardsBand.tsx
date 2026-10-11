import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

export function AwardsBand({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="bg-black py-14 md:py-16">
      <div className="mx-auto max-w-[1180px] px-5 md:px-6">
        <div className="mb-10 flex items-center gap-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-red">
          Awards Season &amp; Features
          <span className="h-px flex-1 bg-white/15" />
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-10">
          {stories.slice(0, 3).map((story) => (
            <Link key={story.id} href={`/article/${story.slug}`} className="group">
              <div className="mb-5 overflow-hidden">
                <ArticleImage
                  src={story.featuredImage.url}
                  alt={story.featuredImage.alt}
                  aspect="3/2"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red">
                {story.category}
              </div>
              <div className="font-[family-name:var(--font-bask)] text-[18px] font-bold leading-[1.35] text-white transition-colors group-hover:text-red">
                {story.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
