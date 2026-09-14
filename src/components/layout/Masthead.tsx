import Link from "next/link";
import { SITE_DOMAIN, SITE_TAGLINE } from "@/lib/constants";

export function Masthead() {
  return (
    <div className="border-b-[3px] border-black py-[18px]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-2.5 px-4 sm:px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mid">
          {SITE_TAGLINE}
        </span>
        <Link href="/" className="text-center">
          <span className="font-[family-name:var(--font-bask)] text-[36px] font-bold leading-none tracking-[-0.02em] text-black sm:text-[44px] md:text-[52px]">
            TrendSpot
            <span className="relative top-[-4px] ml-0.5 align-super font-[family-name:var(--font-ui)] text-[14px] font-semibold tracking-normal text-red sm:top-[-6px] sm:text-[18px] md:text-[22px]">
              .co.ke
            </span>
          </span>
          <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-mid sm:text-[10px]">
            Fashion · Celebrities · Music · Entertainment · Trending
          </div>
        </Link>
        <div className="mt-1 h-px w-full bg-border" />
      </div>
    </div>
  );
}
