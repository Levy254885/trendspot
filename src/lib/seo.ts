import type { Article } from "@/types";
import { SITE_NAME, SITE_URL, SITE_DOMAIN } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    image: article.ogImage || article.featuredImage.url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/article/${article.slug}`),
    },
    articleSection: article.category,
    keywords: article.tags.join(", "),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    sameAs: [],
    description:
      "Kenya's premier entertainment, celebrity, fashion, music and trending news publication.",
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildArticleMetadata(article: Article) {
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const url = absoluteUrl(`/article/${article.slug}`);
  const image = article.ogImage || article.featuredImage.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article" as const,
      title,
      description,
      url,
      siteName: SITE_DOMAIN,
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image],
    },
  };
}
