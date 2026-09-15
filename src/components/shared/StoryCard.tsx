import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";

type Props = {
  article: Article;
  variant?: "feature" | "standard" | "compact" | "rail";
  showExcerpt?: boolean;
  showImage?: boolean;
  rank?: number;
};

export function StoryCard({
  article,
  variant = "standard",
  showExcerpt = false,
  showImage = true,
  rank,
}: Props) {
  if (variant === "rail") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group flex gap-4 border border-border2 bg-white p-4 transition-colors hover:border-border"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red">
            {article.category}
          </div>
          <div className="mb-2 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.35] text-black group-hover:text-red">
            {article.title}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-pale">
            By {article.author}
          </div>
        </div>
        {showImage && (
          <div className="w-[100px] shrink-0 sm:w-[112px]">
            <ArticleImage
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              aspect="3/2"
              sizes="112px"
            />
          </div>
        )}
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group block border border-border2 bg-white p-4 transition-colors hover:border-border"
      >
        {typeof rank === "number" && (
          <div className="mb-2 font-[family-name:var(--font-bask)] text-[22px] font-bold leading-none text-border">
            {String(rank).padStart(2, "0")}
          </div>
        )}
        <div className="mb-2 font-[family-name:var(--font-bask)] text-[14px] font-bold leading-[1.35] text-black group-hover:text-red">
          {article.title}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-pale">
          By {article.author}
        </div>
      </Link>
    );
  }

  if (variant === "feature") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group block overflow-hidden border border-border2 bg-white transition-colors hover:border-border"
      >
        {showImage && (
          <ArticleImage
            src={article.featuredImage.url}
            alt={article.featuredImage.alt}
            aspect="3/2"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
        <div className="p-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red">
            {article.tags[0] || article.category}
          </div>
          <div className="mb-2 font-[family-name:var(--font-bask)] text-[17px] font-bold leading-[1.3] text-black group-hover:text-red">
            {article.title}
          </div>
          {showExcerpt && (
            <p className="mb-3 line-clamp-2 font-[family-name:var(--font-serif)] text-[13px] leading-[1.55] text-gray">
              {article.excerpt}
            </p>
          )}
          <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-pale">
            By {article.author}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block overflow-hidden border border-border2 bg-white transition-colors hover:border-border"
    >
      {showImage && (
        <ArticleImage
          src={article.featuredImage.url}
          alt={article.featuredImage.alt}
          aspect="3/2"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      )}
      <div className="p-4 sm:p-5">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red">
          {article.category}
        </div>
        <div className="mb-2 font-[family-name:var(--font-bask)] text-[15px] font-bold leading-[1.35] text-black group-hover:text-red sm:text-[16px]">
          {article.title}
        </div>
        {showExcerpt && (
          <p className="mb-3 line-clamp-2 font-[family-name:var(--font-serif)] text-[13px] leading-[1.55] text-gray">
            {article.excerpt}
          </p>
        )}
        <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-pale">
          By {article.author}
        </div>
      </div>
    </Link>
  );
}
