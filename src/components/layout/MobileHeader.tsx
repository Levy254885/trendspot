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
      <div className="flex h-14 items-center justify-between px-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="-ml-2 flex h-11 w-11 items-center justify-center"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
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
          className="-mr-2 flex h-11 w-11 items-center justify-center"
          aria-label="Search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </Link>
      </div>

      {open && (
        <div
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-cream"
        >
          <div className="flex h-14 items-center justify-between px-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-ml-2 flex h-11 w-11 items-center justify-center"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <Link
              href="/#newsletter"
              className="bg-black px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white"
            >
              Subscribe
            </Link>
          </div>

          <div className="px-6 pb-12 pt-4">
            <form action="/search" method="get" className="mb-8 flex items-center gap-3 border-b border-black pb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                name="q"
                placeholder="Search"
                aria-label="Search"
                className="min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-mid"
              />
            </form>

            <nav aria-label="Mobile">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block py-4 text-[16px] font-bold uppercase tracking-[0.08em]",
                    isActive(item.href) ? "text-red" : "text-ink"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-black pt-6">
              <Link href="/contact" className="block py-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-gray">
                Contact / Tips
              </Link>
              <Link href="/about" className="block py-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-gray">
                About Us
              </Link>
              <Link href="/#newsletter" className="block py-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-gray">
                Newsletter
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
