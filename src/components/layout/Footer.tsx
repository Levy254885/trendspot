import Link from "next/link";
import { FOOTER_SECTIONS, SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-black pb-6 pt-10">
      <div className="mx-auto max-w-[1040px] px-5 sm:px-10 lg:px-8">
        <div className="font-[family-name:var(--font-bask)] text-[24px] font-bold text-white sm:text-[28px]">
          TrendSpot
          <span className="relative top-[-3px] ml-0.5 align-super font-[family-name:var(--font-ui)] text-[12px] font-semibold text-red sm:text-[13px]">
            .co.ke
          </span>
        </div>
        <div className="mb-8 mt-1.5 text-[11px] uppercase tracking-[0.12em] text-white/30">
          {SITE_TAGLINE}
        </div>
        <div className="mb-8 h-px bg-white/8" />

        <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5 md:gap-7">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/28">
                {section.label}
              </div>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[12.5px] text-white/45 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/28">
              Follow Us
            </div>
            <div className="flex flex-wrap gap-2">
              {["IG", "TT", "X", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center border border-white/12 text-[11px] font-semibold text-white/40 transition-colors hover:border-red hover:text-white"
                  aria-label={s}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center">
          <span className="text-[11px] text-white/20">
            © {new Date().getFullYear()} TrendSpot.co.ke. All rights reserved.
          </span>
          <span className="text-[11px] text-white/20">
            <Link href="/privacy" className="hover:text-white/40">
              Privacy
            </Link>
            {" · "}
            <Link href="/terms" className="hover:text-white/40">
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
