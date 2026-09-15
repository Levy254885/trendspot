import Link from "next/link";
import { SITE_DOMAIN, SITE_TAGLINE } from "@/lib/constants";

export function Masthead() {
  return (
    <div className="border-b-[3px] border-black py-5 sm:py-6">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-2 px-5 sm:px-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mid">
          {SITE_TAGLINE}
        </span>
        <Link href="/" className="text-center">
          <span className="font-[family-name:var(--font-bask)] text-[34px] font-bold leading-none tracking-[-0.02em] text-black sm:text-[42px] md:text-[48px]">
            TrendSpot
            <span className="relative top-[-3px] ml-0.5 align-super font-[family-name:var(--font-ui)] text-[13px] font-semibold tracking-normal text-red sm:top-[-5px] sm:text-[17px] md:text-[20px]">
              .co.ke
            </span>
          </span>
          <div className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-mid sm:text-[10px]">
            Fashion · Celebrities · Music · Entertainment · Trending
          </div>
        </Link>
      </div>
    </div>
  );
}
