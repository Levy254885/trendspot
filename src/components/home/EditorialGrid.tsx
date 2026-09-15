import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { formatRelative } from "@/lib/utils";

export function EditorialGrid({
  fashion,
  music,
  celebrities,
}: {
  fashion: Article[];
  music: Article[];
  celebrities: Article[];
}) {
  const stories = [
    ...fashion.slice(0, 1),
    ...music.slice(0, 1),
    ...celebrities.slice(0, 1),
    ...fashion.slice(1, 2),
  ]
    .filter(Boolean)
    .slice(0, 4);

  if (!stories.length) return null;

  return (
    <section className="mb-10 border-t border-[#e5e5e5] pt-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {stories.map((story) => (
          <Link key={story.id} href={`/article/${story.slug}`} className="group block">
            <ArticleImage
              src={story.featuredImage.url}
              alt={story.featuredImage.alt}
              aspect="16/9"
              className="mb-3"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <h3 className="mb-2 font-[family-name:var(--font-bask)] text-[17px] font-bold leading-[1.25] text-black group-hover:underline sm:text-[18px]">
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
