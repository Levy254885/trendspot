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
  const lead = stories[0];
  const rest = stories.slice(1);
  if (!lead) return null;

  return (
    <div className="min-w-0">
      <span
        className={`mb-5 block border-b-2 pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
          red ? "border-red text-red" : "border-black text-mid"
        }`}
      >
        {label}
      </span>
      <Link
        href={`/article/${lead.slug}`}
        className="group mb-6 block border-b border-border2 pb-6"
      >
        <ArticleImage
          src={lead.featuredImage.url}
          alt={lead.featuredImage.alt}
          aspect="3/2"
          className="mb-4"
          sizes="(max-width: 768px) 100vw, 30vw"
        />
        <div className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
          {lead.tags[0] || lead.category}
        </div>
        <div className="mb-2 font-[family-name:var(--font-bask)] text-[16px] font-bold leading-[1.35] text-black group-hover:text-red">
          {lead.title}
        </div>
        <div className="mb-2 line-clamp-2 font-[family-name:var(--font-serif)] text-[13px] leading-[1.55] text-gray">
          {lead.excerpt}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-pale">
          By {lead.author}
        </div>
      </Link>
      {rest.map((story) => (
        <Link
          key={story.id}
          href={`/article/${story.slug}`}
          className="group block py-1"
        >
          <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-red">
            {story.tags[0] || story.category}
          </div>
          <div className="mb-1.5 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.35] text-black group-hover:text-red">
            {story.title}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-pale">
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
    <section className="mb-14 border-b border-border pb-14">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-0">
        <div className="md:pr-8">
          <Col label="Fashion" stories={fashion} red />
        </div>
        <div className="md:border-x md:border-border2 md:px-8">
          <Col label="Music" stories={music} />
        </div>
        <div className="md:pl-8">
          <Col label="Celebrities" stories={celebrities} />
        </div>
      </div>
    </section>
  );
}
