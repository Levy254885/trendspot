"use client";

import { usePathname } from "next/navigation";
import { SocialLinks } from "./SocialIcons";

/** Social buttons pinned to the bottom-right of every public screen. */
export function SocialFloat() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="social-float" aria-label="Follow TrendSpot on social media">
      <SocialLinks className="sf-btn" size={24} />
    </nav>
  );
}
