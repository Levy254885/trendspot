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
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 sm:px-8">
        {/* Desktop */}
        <div className="hidden items-center justify-center gap-0 overflow-x-auto md:flex md:w-full">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-[11px] text-[11.5px] font-bold uppercase tracking-[0.1em] transition-colors lg:px-4",
                isActive(item.href)
                  ? "border-red text-red"
                  : "border-transparent text-ink hover:text-red"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <div className="flex w-full items-center justify-between py-3 md:hidden">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mid">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border2 bg-white md:hidden"
        >
          <div className="flex flex-col px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-border2 py-3.5 text-[13px] font-bold uppercase tracking-wider",
                  isActive(item.href) ? "text-red" : "text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="py-3.5 text-[13px] font-bold uppercase tracking-wider text-ink"
            >
              Search
            </Link>
            <Link
              href="/contact"
              className="py-3.5 text-[13px] font-bold uppercase tracking-wider text-ink"
            >
              Contact / Tips
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
