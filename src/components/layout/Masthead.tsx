import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/constants";

export function Masthead() {
  return (
    <div className="border-b-[3px] border-black">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-2 px-6 py-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mid">
          {SITE_TAGLINE}
        </span>
        <Link href="/" className="text-center">
          <span className="font-[family-name:var(--font-bask)] text-[44px] font-bold leading-none tracking-[-0.02em] text-black lg:text-[52px]">
            TrendSpot
            <span className="relative top-[-6px] ml-0.5 align-super font-[family-name:var(--font-ui)] text-[18px] font-semibold text-red lg:text-[22px]">
              .co.ke
            </span>
          </span>
        </Link>
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-mid">
          Fashion · Celebrities · Music · Entertainment · Trending
        </div>
      </div>
    </div>
  );
}
