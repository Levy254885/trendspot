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
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white" aria-label="Main">
      <div className="mx-auto hidden max-w-[1280px] items-center justify-center gap-0 overflow-x-auto px-4 md:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap border-b-[3px] px-3.5 py-3 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:text-black",
              isActive(item.href)
                ? "border-red font-bold text-black"
                : "border-transparent"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between border-t border-[#e5e5e5] px-4 py-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 py-2 text-[14px] font-bold text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
            Menu
          </button>
          <Link href="/search" className="py-2 text-[14px] font-medium text-ink">
            Search
          </Link>
        </div>
        {open && (
          <div id="mobile-menu" className="border-t border-[#e5e5e5] bg-white px-4 pb-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block border-b border-[#eee] py-3.5 text-[16px]",
                  isActive(item.href) ? "font-bold text-red" : "font-medium text-ink"
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
