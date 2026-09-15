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
    <div className="mb-10 border-b border-border pb-10 last:mb-0 last:border-0 last:pb-0">
      <span
        className={`mb-5 block border-b-2 pb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] ${
          red ? "border-red text-red" : "border-black text-mid"
        }`}
      >
        {label}
      </span>
      <div className="flex flex-col gap-7">
        {stories.map((story, i) => (
          <Link key={story.id} href={`/article/${story.slug}`} className="group block">
            {i === 0 && (
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="16/9"
                className="mb-3"
                sizes="100vw"
              />
            )}
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-red">
              {story.tags[0] || story.category}
            </div>
            <div className="mb-1.5 font-[family-name:var(--font-bask)] text-[19px] font-bold leading-[1.25] text-black">
              {story.title}
            </div>
            {i === 0 && (
              <p className="mb-2 line-clamp-2 font-[family-name:var(--font-serif)] text-[15px] leading-[1.55] text-gray">
                {story.excerpt}
              </p>
            )}
            <div className="text-[11px] font-semibold uppercase tracking-wider text-pale">
              By {story.author}
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
        className={`mb-3.5 block border-b-2 pb-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
          red ? "border-red text-red" : "border-black text-mid"
        }`}
      >
        {label}
      </span>
      {stories.map((story, i) => (
        <Link
          key={story.id}
          href={`/article/${story.slug}`}
          className={`group block border-b border-border2 py-3 last:border-b-0 ${
            i === stories.length - 1 ? "pb-0" : ""
          }`}
        >
          {i === 0 && (
            <div className="mb-2.5 overflow-hidden">
              <ArticleImage
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                aspect="3/2"
                className="transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 1280px) 30vw, 340px"
              />
            </div>
          )}
          <div className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
            {story.tags[0] || story.category}
          </div>
          <div className="mb-1 font-[family-name:var(--font-bask)] text-[14.5px] font-bold leading-[1.3] text-black transition-colors group-hover:text-red">
            {story.title}
          </div>
          {i === 0 && (
            <div className="mb-1 line-clamp-2 font-[family-name:var(--font-serif)] text-[12.5px] leading-[1.55] text-gray">
              {story.excerpt}
            </div>
          )}
          <div className="text-[10px] font-semibold uppercase tracking-wider text-pale">
            By {story.author}
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
    <section className="mb-10 border-b border-border pb-10 md:mb-7 md:pb-7">
      <div className="md:hidden">
        <MobileSection label="Fashion" stories={fashion} red />
        <MobileSection label="Music" stories={music} />
        <MobileSection label="Celebrities" stories={celebrities} />
      </div>

      <div className="hidden md:grid md:grid-cols-[1fr_1px_1fr_1px_1fr]">
        <div className="pr-6">
          <DesktopCol label="Fashion" stories={fashion} red />
        </div>
        <div className="bg-border2" aria-hidden />
        <div className="px-6">
          <DesktopCol label="Music" stories={music} />
        </div>
        <div className="bg-border2" aria-hidden />
        <div className="pl-6">
          <DesktopCol label="Celebrities" stories={celebrities} />
        </div>
      </div>
    </section>
  );
}
