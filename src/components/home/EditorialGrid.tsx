import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

function Col({
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
            <ArticleImage
              src={story.featuredImage.url}
              alt={story.featuredImage.alt}
              aspect="3/2"
              className="mb-2.5"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
          )}
          <div className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
            {story.tags[0] || story.category}
          </div>
          <div className="mb-1 font-[family-name:var(--font-bask)] text-[14px] font-bold leading-[1.3] text-black group-hover:text-red">
            {story.title}
          </div>
          {i === 0 && (
            <div className="mb-1 line-clamp-2 font-[family-name:var(--font-serif)] text-[12px] leading-[1.55] text-gray">
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
    <section className="mb-8 border-b border-border pb-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
        <div className="md:pr-6">
          <Col label="Fashion" stories={fashion} red />
        </div>
        <div className="md:border-x md:border-border2 md:px-6">
          <Col label="Music" stories={music} />
        </div>
        <div className="md:pl-6">
          <Col label="Celebrities" stories={celebrities} />
        </div>
      </div>
    </section>
  );
}
