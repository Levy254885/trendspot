import Link from "next/link";
import Image from "next/image";
import { SITE_DOMAIN, SITE_LOGO, SITE_TAGLINE } from "@/lib/constants";

export function Masthead() {
  return (
    <div className="masthead">
      <div className="mast-i">
        <span className="mast-tagline">{SITE_TAGLINE}</span>
        <div className="mast-logo">
          <Link href="/" aria-label={`${SITE_DOMAIN} home`}>
            <Image
              src={SITE_LOGO}
              alt={SITE_DOMAIN}
              width={360}
              height={90}
              priority
              className="mast-logo-img"
            />
          </Link>
          <div className="mast-sub">Fashion · Celebrities · Music · Entertainment · Trending</div>
        </div>
        <div className="mast-rule"></div>
      </div>
    </div>
  );
}
