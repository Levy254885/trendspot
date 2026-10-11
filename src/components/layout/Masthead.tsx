import Link from "next/link";
import { SITE_TAGLINE } from "@/lib/constants";

export function Masthead() {
  return (
    <div className="masthead">
      <div className="mast-i">
        <span className="mast-tagline">{SITE_TAGLINE}</span>
        <div className="mast-logo">
          <Link href="/">
            <span className="mast-name">
              TrendSpot<span className="mast-name-suffix">.co.ke</span>
            </span>
          </Link>
          <div className="mast-sub">Fashion · Celebrities · Music · Entertainment · Trending</div>
        </div>
        <div className="mast-rule"></div>
      </div>
    </div>
  );
}
