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
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-[7px] sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden text-[11px] tracking-wide text-mid sm:inline">
            {today}
          </span>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink transition-colors hover:text-red"
          >
            Got a tip?
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/#newsletter" className="hidden text-[11px] font-semibold uppercase tracking-wider text-mid transition-colors hover:text-ink sm:inline">
            Newsletters
          </Link>
          <Link href="/search" className="text-[11px] font-semibold uppercase tracking-wider text-mid transition-colors hover:text-ink">
            Search
          </Link>
          <Link href="/#newsletter" className="bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-red sm:px-4">
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  );
}
