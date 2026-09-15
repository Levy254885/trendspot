import Link from "next/link";
import type { Article } from "@/types";

export function Ticker({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;

  const items = [...stories, ...stories, ...stories];

  return (
    <div className="overflow-hidden border-b border-border2 bg-surface py-2.5">
      <div className="mx-auto flex max-w-[1040px] items-center gap-0 px-5 sm:px-10 lg:px-8">
        <span className="mr-4 shrink-0 bg-red px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white">
          Breaking
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track">
            {items.map((story, i) => (
              <span
                key={`${story.id}-${i}`}
                className="inline-flex items-center px-8 text-[13px] font-medium text-ink"
              >
                <Link href={`/article/${story.slug}`} className="hover:text-red">
                  {story.title}
                </Link>
                <span className="ml-8 text-border" aria-hidden>
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
