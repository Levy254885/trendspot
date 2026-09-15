import type { Article } from "@/types";
import { StoryCard } from "@/components/shared/StoryCard";

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
  const [lead, ...rest] = stories;

  return (
    <div className="min-w-0">
      <span
        className={`mb-5 block border-b-2 pb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
          red ? "border-red text-red" : "border-black text-mid"
        }`}
      >
        {label}
      </span>
      <div className="flex flex-col gap-5">
        <StoryCard article={lead} variant="feature" showExcerpt />
        {rest.map((story) => (
          <StoryCard
            key={story.id}
            article={story}
            variant="compact"
            showImage={false}
          />
        ))}
      </div>
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
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        <Col label="Fashion" stories={fashion} red />
        <Col label="Music" stories={music} />
        <Col label="Celebrities" stories={celebrities} />
      </div>
    </section>
  );
}
