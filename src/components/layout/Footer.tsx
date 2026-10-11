import Link from "next/link";
import { FOOTER_SECTIONS, SITE_TAGLINE } from "@/lib/constants";

const SOCIALS = [
  { label: "Instagram", icon: "ti-brand-instagram" },
  { label: "TikTok", icon: "ti-brand-tiktok" },
  { label: "X", icon: "ti-brand-x" },
  { label: "YouTube", icon: "ti-brand-youtube" },
  { label: "Pinterest", icon: "ti-brand-pinterest" },
];

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
            <div
              className="foot-socials"
              style={{ flexWrap: "wrap", gap: "8px", marginTop: 0 }}
            >
              {SOCIALS.map((s) => (
                <a key={s.label} className="soc" aria-label={s.label}>
                  <i className={`ti ${s.icon}`} aria-hidden="true"></i>
                </a>
              ))}
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
