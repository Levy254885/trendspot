import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";

export function AwardsBand({ stories }: { stories: Article[] }) {
  if (!stories.length) return null;
  return (
    <div className="special-band">
      <div className="spec-i">
        <div className="spec-label">Awards Season &amp; Features</div>
        <div className="spec-grid">
          {stories.slice(0, 4).map((story) => (
            <Link key={story.id} href={`/article/${story.slug}`} className="spec-card">
              <div className="spec-card-img">
                <Image
                  src={story.featuredImage.url}
                  alt={story.featuredImage.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 280px"
                  style={{ objectFit: "cover" }}
                />
                <div className="spec-card-bot"></div>
              </div>
              <div className="spec-card-cat">{story.category}</div>
              <div className="spec-card-hl">{story.title}</div>
              <div className="spec-card-by">By {story.author}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
