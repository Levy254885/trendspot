import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";

const DOT = " · ";

export function MoreStories({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <div className="more-grid">
      {stories.slice(0, 4).map((story) => (
        <Link key={story.id} href={`/article/${story.slug}`} className="mg-item">
          <div className="mg-img">
            <Image
              src={story.featuredImage.url}
              alt={story.featuredImage.alt}
              fill
              sizes="(max-width: 640px) 100vw, 280px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="mg-cat">{story.category}</div>
          <div className="mg-hl">{story.title}</div>
          <div className="mg-by">
            By {story.author}
            {DOT}
            {story.readingTime} min
          </div>
        </Link>
      ))}
    </div>
  );
}
