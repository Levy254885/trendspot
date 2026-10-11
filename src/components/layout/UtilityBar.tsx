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
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-2.5">
        <span className="text-[11px] tracking-wide text-mid">{today}</span>
        <div className="flex items-center gap-6">
          <Link
            href="/search"
            className="text-[11px] font-semibold uppercase tracking-wider text-mid transition-colors hover:text-ink"
          >
            Search
          </Link>
          <Link
            href="/#newsletter"
            className="bg-black px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-red"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  );
}
