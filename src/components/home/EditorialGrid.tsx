import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";

const DOT = " · ";

function Column({
  label,
  stories,
  red,
}: {
  label: string;
  stories: Article[];
  red?: boolean;
}) {
  return (
    <div className="ed-col">
      <span className={red ? "ec-label red" : "ec-label"}>{label}</span>
      {stories.slice(0, 3).map((story, i) => (
        <Link key={story.id} href={`/article/${story.slug}`} className="ec-item">
          {i === 0 && (
            <div className="ec-img">
              <Image
                src={story.featuredImage.url}
                alt={story.featuredImage.alt}
                fill
                sizes="(max-width: 960px) 100vw, 360px"
                style={{ objectFit: "cover" }}
              />
              <div className="ec-img-accent"></div>
            </div>
          )}
          <div className="ec-item-cat">{story.tags[0] || story.category}</div>
          <div className="ec-item-hl">{story.title}</div>
          {i < 2 && <div className="ec-item-deck">{story.excerpt}</div>}
          <div className="ec-item-by">
            By {story.author}
            {DOT}
            {story.readingTime} min
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
    <div className="ed-grid">
      <Column label="Fashion" stories={fashion} red />
      <div className="ed-divider"></div>
      <Column label="Music" stories={music} />
      <div className="ed-divider"></div>
      <Column label="Celebrities" stories={celebrities} />
    </div>
  );
}
