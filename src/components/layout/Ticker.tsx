import Link from "next/link";
import type { Article } from "@/types";

export function Ticker({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;

  // Two identical halves so the -50% scroll loops without a jump.
  const half = stories.length >= 6 ? stories : [...stories, ...stories];
  const items = [...half, ...half];

  return (
    <div className="ticker">
      <div className="ticker-i">
        <span className="ticker-label">Breaking</span>
        <div className="ticker-scroll">
          <div className="ticker-t">
            {items.map((story, i) => (
              <span key={`${story.id}-${i}`}>
                <Link href={`/article/${story.slug}`}>{story.title}</Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
