"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b border-border bg-white" aria-label="Main">
      <div className="mx-auto hidden max-w-[1040px] items-center justify-center gap-1 px-8 md:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors",
              isActive(item.href)
                ? "text-red"
                : "text-ink hover:text-red"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1040px] items-center justify-between px-5 py-3 md:hidden">
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink">
          Sections
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-border2"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border2 bg-white md:hidden"
        >
          <div className="flex flex-col px-5 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-border2 py-4 text-[14px] font-semibold uppercase tracking-[0.1em] last:border-b-0",
                  isActive(item.href) ? "text-red" : "text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="border-t border-border2 py-4 text-[14px] font-semibold uppercase tracking-[0.1em] text-mid"
            >
              Search
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
