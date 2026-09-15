import Link from "next/link";

export function UtilityBar() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="border-b border-border2">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-2 sm:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden text-[11px] tracking-wide text-mid sm:inline">
            {today}
          </span>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink transition-colors hover:text-red"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            Got a tip?
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#newsletter"
            className="hidden text-[11px] font-semibold uppercase tracking-wider text-mid transition-colors hover:text-ink sm:inline"
          >
            Newsletters
          </Link>
          <Link
            href="/category/awards"
            className="hidden text-[11px] font-semibold uppercase tracking-wider text-mid transition-colors hover:text-ink md:inline"
          >
            Awards
          </Link>
          <Link
            href="/search"
            className="text-[11px] font-semibold uppercase tracking-wider text-mid transition-colors hover:text-ink"
            aria-label="Search"
          >
            Search
          </Link>
          <Link
            href="/#newsletter"
            className="bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-red sm:px-4"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  );
}
