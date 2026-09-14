import { fetchLatest } from "@/services/articles";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

export const revalidate = 300;

export async function GET() {
  const articles = await fetchLatest(30);
  const base = SITE_URL.replace(/\/$/, "");

  const items = articles
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${base}/article/${a.slug}</link>
      <guid isPermaLink="true">${base}/article/${a.slug}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <pubDate>${a.publishedAt ? new Date(a.publishedAt).toUTCString() : ""}</pubDate>
      <category>${a.category}</category>
      <dc:creator>${a.author}</dc:creator>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${base}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-ke</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
  });
}
