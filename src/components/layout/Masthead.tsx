import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/constants";

export function Masthead() {
  return (
    <div>
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-3 px-6 py-8">
        <Link href="/" className="text-center">
          <span className="font-[family-name:var(--font-bask)] text-[48px] font-bold leading-none tracking-[-0.02em] text-black lg:text-[56px]">
            TrendSpot
            <span className="relative top-[-8px] ml-0.5 align-super font-[family-name:var(--font-ui)] text-[18px] font-semibold text-red lg:text-[22px]">
              .co.ke
            </span>
          </span>
        </Link>
        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-mid">
          {SITE_TAGLINE}
        </div>
      </div>
    </div>
  );
}
