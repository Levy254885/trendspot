export type ArticleStatus = "draft" | "published" | "scheduled" | "archived";

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  email?: string;
  role?: string;
  social?: {
    twitter?: string;
    instagram?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleImage {
  url: string;
  publicId?: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: ArticleImage;
  additionalImages?: ArticleImage[];
  category: string;
  categorySlug: string;
  tags: string[];
  author: string;
  authorId: string;
  authorSlug?: string;
  publishedAt: string | null;
  updatedAt: string;
  status: ArticleStatus;
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  views: number;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: string;
  scheduledAt?: string | null;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
  source?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  read: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  social: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
  };
  contactEmail?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "editor" | "author";
  photoURL?: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type Role = "admin" | "editor" | "author";

export type AdPlacement = "home-top" | "home-mid" | "sidebar" | "in-article";

export interface Advert {
  id: string;
  name: string;
  placement: AdPlacement;
  imageUrl: string;
  imagePublicId?: string;
  linkUrl: string;
  alt: string;
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  active: boolean;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

/** What the public site needs to render an advert. */
export interface PublicAd {
  id: string;
  imageUrl: string;
  alt: string;
  hasLink: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  name: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  uploadedBy: string;
  createdAt: string;
}

export interface AdminSession {
  uid: string;
  email: string;
  name: string;
  role: Role;
}
