import type { NavItem } from "@/types";

export const SITE_NAME = "TrendSpot";
export const SITE_DOMAIN = "TrendSpot.co.ke";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://trendspot.co.ke";
export const SITE_TAGLINE =
  "The Definitive Voice of Entertainment & Pop Culture";
export const SITE_DESCRIPTION =
  "Kenya's premier entertainment, celebrity, fashion, music and trending news publication.";

export const CATEGORY_OPTIONS: { name: string; slug: string }[] = [
  { name: "Trending", slug: "trending" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Celebrities", slug: "celebrities" },
  { name: "Music", slug: "music" },
  { name: "Fashion", slug: "fashion" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "TV", slug: "tv" },
  { name: "Movies", slug: "movies" },
  { name: "Awards", slug: "awards" },
  { name: "Royals", slug: "royals" },
  { name: "Business", slug: "business" },
  { name: "Lists", slug: "lists" },
  { name: "Video", slug: "video" },
  { name: "Charts", slug: "charts" },
  { name: "Beauty", slug: "beauty" },
];

export const AD_PLACEMENTS: {
  value: "home-top" | "home-mid" | "sidebar" | "in-article";
  label: string;
  size: string;
  help: string;
}[] = [
  {
    value: "home-top",
    label: "Homepage — top banner",
    size: "970 × 90 px",
    help: "Wide banner above the top story on the homepage.",
  },
  {
    value: "home-mid",
    label: "Homepage — middle banner",
    size: "970 × 250 px",
    help: "Between the section columns and the Latest News block.",
  },
  {
    value: "sidebar",
    label: "Article & category sidebar",
    size: "300 × 250 px",
    help: "Top of the right-hand column on article and category pages.",
  },
  {
    value: "in-article",
    label: "Inside articles",
    size: "728 × 90 px or 300 × 250 px",
    help: "Shown after the second paragraph of every article.",
  },
];

export const NAV_ITEMS: NavItem[] = [
  { label: "News", href: "/" },
  { label: "Fashion", href: "/category/fashion" },
  { label: "Celebrities", href: "/category/celebrities" },
  { label: "Music", href: "/category/music" },
  { label: "Entertainment", href: "/category/entertainment" },
  { label: "Awards", href: "/category/awards" },
  { label: "Royals", href: "/category/royals" },
  { label: "Business", href: "/category/business" },
  { label: "TV", href: "/category/tv" },
  { label: "Lists", href: "/category/lists" },
  { label: "Video", href: "/category/video" },
];

export const FOOTER_SECTIONS = [
  {
    label: "Sections",
    links: [
      { label: "Fashion", href: "/category/fashion" },
      { label: "Celebrities", href: "/category/celebrities" },
      { label: "Music", href: "/category/music" },
      { label: "Entertainment", href: "/category/entertainment" },
      { label: "Trending", href: "/category/trending" },
    ],
  },
  {
    label: "More",
    links: [
      { label: "Awards", href: "/category/awards" },
      { label: "TV", href: "/category/tv" },
      { label: "Royals", href: "/category/royals" },
      { label: "Beauty", href: "/category/beauty" },
      { label: "Lists", href: "/category/lists" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Advertise", href: "/contact" },
      { label: "Newsletter", href: "/#newsletter" },
      { label: "Contact", href: "/contact" },
      { label: "Tip Line", href: "/contact" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Cookies", href: "/privacy" },
      { label: "Accessibility", href: "/contact" },
    ],
  },
];
