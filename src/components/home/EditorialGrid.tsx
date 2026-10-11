import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

function MobileSection({
  label,
  stories,
  red,
}: {
  label: string;
  stories: Article[];
  red?: boolean;
}) {
  if (!stories.length) return null;
  return (
    <div className="mb-14 last:mb-0">
      <span
        className={`mb-6 block border-b-2 pb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] ${
          red ? "border-red text-red" : "border-black text-ink"
        }`}
      >
        {label}
      </span>
      <div className="flex flex-col">
        {stories.slice(0, 2).map((story, i) => (
          <Link
            key={story.id}
            href={`/article/${story.slug}`}
            className={`group block ${i > 0 ? "mt-6 border-t border-border2 pt-6" : ""}`}
          >
            {i === 0 && (
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="16/9"
                className="mb-4"
                sizes="100vw"
              />
            )}
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red">
              {story.tags[0] || story.category}
            </div>
            <div className="font-[family-name:var(--font-bask)] text-[19px] font-bold leading-[1.3] text-black">
              {story.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DesktopCol({
  label,
  stories,
  red,
}: {
  label: string;
  stories: Article[];
  red?: boolean;
}) {
  if (!stories.length) return null;
  return (
    <div className="min-w-0">
      <span
        className={`mb-6 block border-b-2 pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
          red ? "border-red text-red" : "border-black text-ink"
        }`}
      >
        {label}
      </span>
      {stories.slice(0, 2).map((story, i) => (
        <Link
          key={story.id}
          href={`/article/${story.slug}`}
          className={`group block ${i > 0 ? "mt-6 border-t border-border2 pt-6" : ""}`}
        >
          {i === 0 && (
            <div className="mb-4 overflow-hidden">
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="3/2"
                className="transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 1280px) 30vw, 340px"
              />
            </div>
          )}
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red">
            {story.tags[0] || story.category}
          </div>
          <div className="font-[family-name:var(--font-bask)] text-[16px] font-bold leading-[1.35] text-black transition-colors group-hover:text-red">
            {story.title}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function EditorialGrid({
  fashion,
  music,
  celebrities,
}: {
  fashion: Article[];
  music: Article[];
  celebrities: Article[];
}) {
  return (
    <section className="mb-14 border-b border-border pb-14 md:mb-16 md:pb-16">
      <div className="md:hidden">
        <MobileSection label="Fashion" stories={fashion} red />
        <MobileSection label="Music" stories={music} />
        <MobileSection label="Celebrities" stories={celebrities} />
      </div>

      <div className="hidden md:grid md:grid-cols-[1fr_1px_1fr_1px_1fr]">
        <div className="pr-8">
          <DesktopCol label="Fashion" stories={fashion} red />
        </div>
        <div className="bg-border2" aria-hidden />
        <div className="px-8">
          <DesktopCol label="Music" stories={music} />
        </div>
        <div className="bg-border2" aria-hidden />
        <div className="pl-8">
          <DesktopCol label="Celebrities" stories={celebrities} />
        </div>
      </div>
    </section>
  );
}
