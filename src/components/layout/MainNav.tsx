"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export function MainNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="sec-nav">
      <nav className="sec-nav-i" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? "sn-a act" : "sn-a"}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
