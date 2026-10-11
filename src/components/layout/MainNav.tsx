"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="border-y border-black bg-white" aria-label="Main">
      <div className="mx-auto flex max-w-[1180px] items-center justify-center gap-2 px-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap border-b-[3px] px-5 py-4 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors",
              isActive(item.href)
                ? "border-red text-red"
                : "border-transparent text-ink hover:text-red"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
