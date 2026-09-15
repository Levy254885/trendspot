import Link from "next/link";
import type { Article } from "@/types";

export function Ticker({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;

  const items = [...stories, ...stories];

  return (
    <div className="overflow-hidden border-b border-border2 bg-surface py-2">
      <div className="mx-auto flex max-w-[1180px] items-center px-4 md:px-6">
        <span className="mr-3 shrink-0 bg-red px-2 py-[3px] text-[9px] font-extrabold uppercase tracking-[0.12em] text-white md:mr-4 md:text-[10px]">
          Breaking
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track">
            {items.map((story, i) => (
              <span
                key={`${story.id}-${i}`}
                className="inline-block whitespace-nowrap px-5 text-[12px] font-medium text-ink md:px-6 md:text-[11.5px]"
              >
                <Link href={`/article/${story.slug}`} className="hover:text-red">
                  {story.title}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
