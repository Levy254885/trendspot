import type { Article } from "@/types";
import { StoryCard } from "@/components/shared/StoryCard";

export function MoreStories({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <section className="mb-16">
      <div className="mb-8 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
        More Stories
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
        {stories.map((story) => (
          <StoryCard key={story.id} article={story} variant="standard" />
        ))}
      </div>
    </section>
  );
}
