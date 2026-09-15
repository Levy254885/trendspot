import Link from "next/link";

export function Masthead() {
  return (
    <div className="border-b border-[#e5e5e5]">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/search"
          className="flex h-10 w-10 items-center justify-center text-ink"
          aria-label="Search"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </Link>

        <Link href="/" className="text-center">
          <span className="font-[family-name:var(--font-bask)] text-[26px] font-bold tracking-[-0.02em] text-black sm:text-[30px]">
            TrendSpot
            <span className="ml-0.5 text-[14px] font-semibold text-red sm:text-[16px]">
              .co.ke
            </span>
          </span>
        </Link>

        <Link
          href="/#newsletter"
          className="hidden rounded-full bg-[#0072e3] px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#005bb5] sm:inline-block"
        >
          Subscribe
        </Link>
        <Link
          href="/#newsletter"
          className="flex h-10 w-10 items-center justify-center text-ink sm:hidden"
          aria-label="Subscribe"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16v16H4z" />
            <path d="M4 8l8 5 8-5" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
