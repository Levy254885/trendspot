import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";
import { formatRelative } from "@/lib/utils";

const DOT = " · ";

export function TopStory({
  featured,
  sideStories,
}: {
  featured: Article;
  sideStories: Article[];
}) {
  return (
    <div className="top-story">
      <div className="ts-main">
        <div className="ts-eyebrow">Top Story · Cover</div>
        <Link href={`/article/${featured.slug}`} className="lnk">
          <div className="ts-visual">
            <Image
              src={featured.featuredImage.url}
              alt={featured.featuredImage.alt}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 800px"
              style={{ objectFit: "cover" }}
            />
            <div className="ts-vis-accent"></div>
          </div>
        </Link>
        <h1 className="ts-hl">
          <Link href={`/article/${featured.slug}`}>{featured.title}</Link>
        </h1>
        <p className="ts-deck">{featured.excerpt}</p>
        <div className="ts-byline">
          By <span>{featured.author}</span>
          {DOT}
          {featured.readingTime} min read
          {DOT}
          {formatRelative(featured.publishedAt)}
        </div>
      </div>

      <div className="ts-side">
        {sideStories.slice(0, 4).map((story, i) => (
          <Link key={story.id} href={`/article/${story.slug}`} className="ts-side-item">
            <div className="tsi-cat">{story.category}</div>
            <div className="tsi-hl">{story.title}</div>
            {i < 3 && <div className="tsi-deck">{story.excerpt}</div>}
            <div className="tsi-by">By {story.author}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
