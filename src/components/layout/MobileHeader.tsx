"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="border-b border-border">
      <div className="flex h-14 items-center justify-between px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center -ml-2"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>

        <Link href="/" className="text-center">
          <span className="font-[family-name:var(--font-bask)] text-[22px] font-bold tracking-[-0.02em] text-black">
            TrendSpot
            <span className="ml-0.5 text-[11px] font-semibold text-red">.co.ke</span>
          </span>
        </Link>

        <Link
          href="/search"
          className="flex h-11 w-11 items-center justify-center -mr-2"
          aria-label="Search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </Link>
      </div>

      {open && (
        <nav
          id="mobile-drawer"
          className="border-t border-border2 bg-white px-4 pb-4"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[48px] items-center border-b border-border2 text-[15px] font-bold uppercase tracking-[0.08em] last:border-0",
                isActive(item.href) ? "text-red" : "text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="flex min-h-[48px] items-center text-[15px] font-bold uppercase tracking-[0.08em] text-mid"
          >
            Contact / Tips
          </Link>
        </nav>
      )}
    </div>
  );
}
