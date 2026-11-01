import Link from "next/link";
import { FOOTER_SECTIONS, SITE_TAGLINE } from "@/lib/constants";
import { SocialLinks } from "./SocialIcons";

export function Footer() {
  return (
    <footer>
      <div className="foot-i">
        <div className="foot-logo">
          TrendSpot<span className="foot-logo-suffix">.co.ke</span>
        </div>
        <div className="foot-tagline">{SITE_TAGLINE}</div>
        <div className="foot-rule"></div>
        <div className="foot-grid">
          {FOOTER_SECTIONS.map((section) => (
            <div className="foot-col" key={section.label}>
              <div className="foot-col-lbl">{section.label}</div>
              <ul>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="foot-col">
            <div className="foot-col-lbl">Follow Us</div>
            <div className="foot-socials">
              <SocialLinks className="soc" size={22} />
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span className="foot-copy">
            © {new Date().getFullYear()} TrendSpot.co.ke. All rights reserved.
          </span>
          <span className="foot-copy">
            <Link href="/sitemap.xml">Sitemap</Link>
            {" · "}
            <Link href="/contact">Advertise</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
