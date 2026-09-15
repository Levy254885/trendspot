import type { NavItem } from "@/types";

export const SITE_NAME = "TrendSpot";
export const SITE_DOMAIN = "TrendSpot.co.ke";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://trendspot.co.ke";
export const SITE_TAGLINE =
  "The Definitive Voice of Entertainment & Pop Culture";
export const SITE_DESCRIPTION =
  "Kenya's premier entertainment, celebrity, fashion, music and trending news publication.";

export const NAV_ITEMS: NavItem[] = [
  { label: "News", href: "/" },
  { label: "Fashion", href: "/category/fashion" },
  { label: "Celebrities", href: "/category/celebrities" },
  { label: "Music", href: "/category/music" },
  { label: "Entertainment", href: "/category/entertainment" },
  { label: "Trending", href: "/category/trending" },
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
      { label: "Lifestyle", href: "/category/lifestyle" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Newsletter", href: "/#newsletter" },
      { label: "Tip Line", href: "/contact" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];
