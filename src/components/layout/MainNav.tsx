"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MainNav() {
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
    <nav className="border-b border-border bg-white" aria-label="Main">
      <div className="mx-auto hidden max-w-[1180px] items-center justify-center px-6 md:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap border-b-[3px] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors",
              isActive(item.href)
                ? "border-red text-red"
                : "border-transparent text-ink hover:text-red"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="md:hidden">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
            Menu
          </button>
          <Link href="/search" className="text-[12px] font-bold uppercase tracking-wider text-mid">
            Search
          </Link>
        </div>
        {open && (
          <div id="mobile-menu" className="border-t border-border2 bg-white px-6 pb-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block border-b border-border2 py-3.5 text-[13px] font-bold uppercase tracking-wider last:border-0",
                  isActive(item.href) ? "text-red" : "text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
