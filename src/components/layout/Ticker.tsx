import Link from "next/link";
import type { Article } from "@/types";

export function Ticker({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;

  const items = [...stories, ...stories];

  return (
    <div className="overflow-hidden border-b border-border2 bg-surface py-[7px]">
      <div className="mx-auto flex max-w-[1180px] items-center gap-0 px-4 sm:px-6">
        <span className="mr-3 shrink-0 bg-red px-2.5 py-[3px] text-[10px] font-extrabold uppercase tracking-[0.14em] text-white sm:mr-4">
          Breaking
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track">
            {items.map((story, i) => (
              <span key={`${story.id}-${i}`} className="px-6 text-[11.5px] font-medium text-ink">
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
