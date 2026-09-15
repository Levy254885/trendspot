import Link from "next/link";
import type { Article } from "@/types";
import { ArticleImage } from "@/components/shared/ArticleImage";
import { formatRelative } from "@/lib/utils";

export function TopStory({
  featured,
  sideStories,
}: {
  featured: Article;
  sideStories: Article[];
}) {
  const secondary = sideStories[0];
  const tertiary = sideStories[1];

  return (
    <section className="mb-8">
      <h1 className="mb-6 text-center font-[family-name:var(--font-bask)] text-[28px] font-bold uppercase tracking-wide text-red sm:mb-8 sm:text-[32px]">
        TrendSpot
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="order-1 lg:order-2 lg:col-span-5">
          <Link href={`/article/${featured.slug}`} className="block">
            <ArticleImage
              src={featured.featuredImage.url}
              alt={featured.featuredImage.alt}
              aspect="4/3"
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </Link>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-4 lg:flex lg:flex-col lg:justify-center">
          <h2 className="mb-3 font-[family-name:var(--font-bask)] text-[26px] font-bold leading-[1.15] tracking-[-0.01em] text-black sm:text-[30px] lg:text-[32px]">
            <Link href={`/article/${featured.slug}`} className="hover:underline">
              {featured.title}
            </Link>
          </h2>
          <p className="mb-4 text-[16px] leading-[1.5] text-[#3a3a3a]">
            {featured.excerpt}
          </p>
          <div className="text-[13px] text-[#6e6e6e]">
            <span>{formatRelative(featured.publishedAt)}</span>
            <span className="mx-2 text-[#ccc]">|</span>
            <Link href={`/category/${featured.categorySlug}`} className="hover:underline">
              {featured.category}
            </Link>
          </div>
        </div>

        {secondary && (
          <div className="order-3 border-t border-[#e5e5e5] pt-6 lg:col-span-3 lg:border-t-0 lg:border-l lg:border-[#e5e5e5] lg:pl-8 lg:pt-0">
            <Link href={`/article/${secondary.slug}`} className="group block">
              <ArticleImage
                src={secondary.featuredImage.url}
                alt={secondary.featuredImage.alt}
                aspect="16/9"
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="mb-3"
              />
              <h3 className="mb-2 font-[family-name:var(--font-bask)] text-[18px] font-bold leading-[1.25] text-black group-hover:underline sm:text-[20px]">
                {secondary.title}
              </h3>
              <p className="mb-3 line-clamp-2 text-[14px] leading-[1.45] text-[#3a3a3a]">
                {secondary.excerpt}
              </p>
              <div className="text-[13px] text-[#6e6e6e]">
                <span>{formatRelative(secondary.publishedAt)}</span>
                <span className="mx-2 text-[#ccc]">|</span>
                <span>{secondary.category}</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {tertiary && (
        <div className="mt-6 border-t border-[#e5e5e5] pt-6 lg:hidden">
          <Link href={`/article/${tertiary.slug}`} className="group flex gap-4">
            <div className="w-[120px] shrink-0">
              <ArticleImage
                src={tertiary.featuredImage.url}
                alt={tertiary.featuredImage.alt}
                aspect="16/9"
                sizes="120px"
              />
            </div>
            <div className="min-w-0">
              <h3 className="mb-1 font-[family-name:var(--font-bask)] text-[16px] font-bold leading-[1.25] text-black group-hover:underline">
                {tertiary.title}
              </h3>
              <div className="text-[12px] text-[#6e6e6e]">
                {formatRelative(tertiary.publishedAt)}
                <span className="mx-1.5 text-[#ccc]">|</span>
                {tertiary.category}
              </div>
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}
