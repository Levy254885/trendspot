
import type { Article, Author, Category } from "@/types";

const img = (s: string, w = 1200, h = 675) =>
  `https://picsum.photos/seed/${s}/${w}/${h}`;

export const seedAuthors: Author[] = [
  { id: "a1", name: "Amara Osei", slug: "amara-osei", bio: "Senior fashion editor.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a2", name: "Layla Hassan", slug: "layla-hassan", bio: "Celebrity correspondent.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a3", name: "Tunde Adeyemi", slug: "tunde-adeyemi", bio: "Music journalist.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a4", name: "Nadia Park", slug: "nadia-park", bio: "Entertainment editor.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a5", name: "Scott Feinberg", slug: "scott-feinberg", bio: "Awards analyst.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a6", name: "Sofia Reyes", slug: "sofia-reyes", bio: "Street style writer.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a7", name: "Priya Shah", slug: "priya-shah", bio: "Beauty and TV culture.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a8", name: "Zara Mensah", slug: "zara-mensah", bio: "Music analysis.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a9", name: "Kofi Asante", slug: "kofi-asante", bio: "Live music coverage.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a10", name: "Liam Torres", slug: "liam-torres", bio: "Hollywood correspondent.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a11", name: "Kezia Obi", slug: "kezia-obi", bio: "Long-form profiles.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a12", name: "Marcus Webb", slug: "marcus-webb", bio: "Music industry business.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "a13", name: "Abid Rahman", slug: "abid-rahman", bio: "Film criticism.", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
];

export const seedCategories: Category[] = [
  { id: "c1", name: "Trending", slug: "trending", order: 1, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c2", name: "Entertainment", slug: "entertainment", order: 2, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c3", name: "Celebrities", slug: "celebrities", order: 3, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c4", name: "Music", slug: "music", order: 4, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c5", name: "Fashion", slug: "fashion", order: 5, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c6", name: "Lifestyle", slug: "lifestyle", order: 6, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c7", name: "TV", slug: "tv", order: 7, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c8", name: "Movies", slug: "movies", order: 8, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c9", name: "Awards", slug: "awards", order: 9, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: "c10", name: "Royals", slug: "royals", order: 10, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
];

function art(
  id: string,
  title: string,
  slug: string,
  excerpt: string,
  category: string,
  categorySlug: string,
  author: string,
  authorId: string,
  authorSlug: string,
  publishedAt: string,
  opts: Partial<Article> = {}
): Article {
  return {
    id,
    title,
    slug,
    excerpt,
    body: `<p>${excerpt}</p><p>Full coverage continues as the story develops across entertainment, fashion and culture.</p>`,
    featuredImage: { url: img(slug), alt: title, width: 1200, height: 675 },
    category,
    categorySlug,
    tags: [categorySlug],
    author,
    authorId,
    authorSlug,
    publishedAt,
    updatedAt: publishedAt,
    status: "published",
    featured: false,
    breaking: false,
    trending: false,
    views: 5000,
    readingTime: 4,
    createdAt: publishedAt,
    ...opts,
  };
}

export const seedArticles: Article[] = [
  art("1", "The Return of Quiet Luxury — Why Everyone Is Dressing Like Old Money This Season", "return-of-quiet-luxury-old-money-dressing",
    "Against the backdrop of maximalist excess, a new restraint is taking hold on the world's runways — and in the wardrobes of those who truly know.",
    "Fashion", "fashion", "Amara Osei", "a1", "amara-osei", "2026-06-11T08:00:00Z",
    { featured: true, trending: true, views: 28400, readingTime: 4,
      body: `<p>Across runways from Paris to Lagos, a quieter language of luxury is asserting itself. Soft neutrals, precise tailoring and understated hardware have replaced the loud logos that defined the last decade.</p>
<p>Designers are responding to a cultural shift: after years of maximalism, a generation of consumers is seeking clothes that signal taste rather than wealth.</p>
<p>In Nairobi and Johannesburg, the same impulse is visible on the street — elevated basics, monochrome palettes and heritage pieces worn with deliberate ease.</p>
<blockquote>Dressing well no longer means being seen. It means being understood.</blockquote>
<p>We spoke to stylists, buyers and young designers shaping this moment across East Africa and beyond.</p>` }),
  art("2", "Rihanna's Surprise Red Carpet Look Left the Entire Internet Speechless", "rihanna-surprise-red-carpet-look",
    "Unannounced, no stylist credit, and already the most dissected outfit of the year.",
    "Celebrities", "celebrities", "Layla Hassan", "a2", "layla-hassan", "2026-06-11T07:30:00Z",
    { breaking: true, trending: true, views: 41200 }),
  art("3", "Kendrick's New Album Breaks Spotify Day-One Record by 40 Million Streams", "kendrick-album-spotify-day-one-record",
    "Industry analysts are calling it the biggest first-day performance since streaming records began.",
    "Music", "music", "Tunde Adeyemi", "a3", "tunde-adeyemi", "2026-06-11T06:45:00Z",
    { breaking: true, trending: true, views: 35600 }),
  art("4", "Paris Couture Week's 10 Most Talked-About Runway Moments of the Season", "paris-couture-week-top-moments",
    "From tearful finales to a surprise musical performance mid-collection — our complete review.",
    "Entertainment", "entertainment", "Nadia Park", "a4", "nadia-park", "2026-06-10T18:00:00Z",
    { views: 18900, readingTime: 6 }),
  art("5", "Why This Summer's Release Calendar Could Produce the Most Competitive Oscar Race in Years", "summer-releases-competitive-oscar-race",
    "A stacked slate of prestige titles is setting up what could be the tightest awards season in a decade.",
    "Awards", "awards", "Scott Feinberg", "a5", "scott-feinberg", "2026-06-10T15:00:00Z",
    { views: 14200, readingTime: 5 }),
  art("6", "The $25 High Street Find Being Mistaken for a $2,000 Designer Bag", "high-street-designer-bag-dupe",
    "Dupes have always existed, but this one is so convincing even fashion editors are doing a double take.",
    "Fashion", "fashion", "Sofia Reyes", "a6", "sofia-reyes", "2026-06-10T12:00:00Z",
    { trending: true, views: 52100, readingTime: 3 }),
  art("7", "Skinimalism Is Back — the Minimal Makeup Movement Redefining Beauty Standards", "skinimalism-minimal-makeup-movement",
    "Less product, more skin — the beauty conversation is shifting again.",
    "Fashion", "fashion", "Priya Shah", "a7", "priya-shah", "2026-06-09T16:00:00Z",
    { views: 9800 }),
  art("8", "Taylor vs. Olivia: Why the Internet Decided There Has to Be a Winner", "taylor-vs-olivia-fanbase-war",
    "Two massive albums, one summer, and a fanbase war that says far more about us than about either artist.",
    "Music", "music", "Zara Mensah", "a8", "zara-mensah", "2026-06-09T14:00:00Z",
    { trending: true, views: 27300, readingTime: 7 }),
  art("9", "The Guitar Revival Nobody Saw Coming — Gen Z Is Leading It", "guitar-revival-gen-z",
    "From bedroom pop to arena rock, a new generation is picking up the instrument their parents abandoned.",
    "Music", "music", "Kofi Asante", "a9", "kofi-asante", "2026-06-09T11:00:00Z",
    { views: 15600, readingTime: 6 }),
  art("10", "Afrobeats Has a Stadium Moment — and the World Is Finally Paying Attention", "afrobeats-stadium-moment",
    "Sold-out arenas, global collaborations and a sound that no longer needs translation.",
    "Music", "music", "Tunde Adeyemi", "a3", "tunde-adeyemi", "2026-06-08T17:00:00Z",
    { trending: true, views: 22100, readingTime: 6 }),
  art("11", "Inside the Most Exclusive Private Party Hollywood Has Seen in a Decade", "exclusive-hollywood-party",
    "Sources reveal the A-list guest list, the theme, and one very unexpected live performance.",
    "Celebrities", "celebrities", "Liam Torres", "a10", "liam-torres", "2026-06-08T14:00:00Z",
    { views: 19800 }),
  art("12", "Inside the Most Scrutinised Royal Wardrobe Moment in a Decade", "royal-wardrobe-moment-decoded",
    "Three continents, six outfits, one deliberate message — decoded by the people who dress heads of state.",
    "Royals", "royals", "Sofia Reyes", "a6", "sofia-reyes", "2026-06-08T10:00:00Z",
    { views: 16700 }),
  art("13", "The New A-List: How Unknowns Conquered Hollywood Without a Studio Deal", "new-a-list-unknowns-hollywood",
    "Streaming, social platforms and sheer persistence are rewriting the path to stardom.",
    "Celebrities", "celebrities", "Kezia Obi", "a11", "kezia-obi", "2026-06-07T16:00:00Z",
    { views: 11200, readingTime: 9 }),
  art("14", "Oscar Nominations Leaked Ahead of Official Announcement — Full List", "oscar-nominations-leak-full-list",
    "An early list is circulating. We break down every major category.",
    "Awards", "awards", "Scott Feinberg", "a5", "scott-feinberg", "2026-06-11T05:45:00Z",
    { breaking: true, trending: true, views: 38900, readingTime: 5 }),
  art("15", "Spielberg's 'Disclosure Day' Critics Roundup: What the Reviews Say", "spielberg-disclosure-day-reviews",
    "Early notices are in. Here's the critical consensus so far.",
    "Movies", "movies", "Abid Rahman", "a13", "abid-rahman", "2026-06-11T05:17:00Z",
    { views: 9400 }),
  art("16", "Warner Music Group Acquires AI Detection Company to Protect Catalogue", "warner-music-ai-detection-acquisition",
    "The deal signals a more aggressive stance on generative AI and artist rights.",
    "Music", "music", "Marcus Webb", "a12", "marcus-webb", "2026-06-11T04:58:00Z",
    { views: 7600 }),
  art("17", "Why the Internet Completely Changed Its Mind About That Controversial Show", "internet-changed-mind-controversial-show",
    "From backlash to reappraisal in under a season — a case study in online culture.",
    "TV", "tv", "Priya Shah", "a7", "priya-shah", "2026-06-11T04:30:00Z",
    { trending: true, views: 20300, readingTime: 8 }),
  art("18", "That \"Ugly\" Sandal Taking Over Every European Street Style Account Right Now", "ugly-sandal-street-style-trend",
    "Uncomfortable, polarising and suddenly unavoidable.",
    "Fashion", "fashion", "Sofia Reyes", "a6", "sofia-reyes", "2026-06-07T09:00:00Z",
    { trending: true, views: 142000, readingTime: 3 }),
  art("19", "Zendaya Confirms the Rumour Everyone on the Internet Saw Coming", "zendaya-confirms-rumour",
    "After months of speculation, the confirmation finally arrived.",
    "Celebrities", "celebrities", "Layla Hassan", "a2", "layla-hassan", "2026-06-06T18:00:00Z",
    { trending: true, views: 98000, readingTime: 3 }),
  art("20", "Welcome to the Oscar Race: 'Toy Story 5' and Taylor Swift", "oscar-race-toy-story-taylor-swift",
    "An unlikely pair of contenders is already shaping early awards conversation.",
    "Awards", "awards", "Scott Feinberg", "a5", "scott-feinberg", "2026-06-05T12:00:00Z",
    { featured: true, views: 13400, readingTime: 5 }),
];

export function getPublishedArticles(): Article[] {
  return seedArticles
    .filter((a) => a.status === "published")
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  return seedArticles.find((a) => a.slug === slug && a.status === "published");
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return getPublishedArticles().filter((a) => a.categorySlug === categorySlug);
}

export function getFeaturedArticle(): Article | undefined {
  return getPublishedArticles().find((a) => a.featured) || getPublishedArticles()[0];
}

export function getBreakingArticles(): Article[] {
  return getPublishedArticles().filter((a) => a.breaking || a.trending).slice(0, 10);
}

export function getMostRead(limit = 5): Article[] {
  return [...getPublishedArticles()].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function getLatest(limit = 10): Article[] {
  return getPublishedArticles().slice(0, limit);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getPublishedArticles().filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}
