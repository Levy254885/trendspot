import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";
import { formatTime, formatViews } from "@/lib/utils";

const DOT = " · ";

export function NewsRail({
  latest,
  mostRead,
}: {
  latest: Article[];
  mostRead: Article[];
}) {
  return (
    <div className="news-rail">
      <div className="nr-main">
        <span className="nr-label">Latest News</span>
        <div className="nr-list">
          {latest.slice(0, 4).map((story) => (
            <Link key={story.id} href={`/article/${story.slug}`} className="nr-row">
              <div className="nr-row-body">
                <div className="nr-row-cat">{story.category}</div>
                <div className="nr-row-hl">{story.title}</div>
                <div className="nr-row-by">
                  By {story.author}
                  {DOT}
                  <span className="nr-row-time">{formatTime(story.publishedAt)}</span>
                </div>
              </div>
              <div className="nr-thumb">
                <Image
                  src={story.featuredImage.url}
                  alt={story.featuredImage.alt}
                  fill
                  sizes="100px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="nr-side">
        <span className="nrs-label">Most Read</span>
        <div className="nrs-list">
          {mostRead.slice(0, 5).map((story, i) => (
            <Link key={story.id} href={`/article/${story.slug}`} className="nrs-item">
              <div className="nrs-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="nrs-hl">{story.title}</div>
              <div className="nrs-meta">
                {story.category} · {formatViews(story.views)} views
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
