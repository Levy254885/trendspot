"use client";

import Link from "next/link";
import { useState } from "react";
import { FOOTER_SECTIONS, SITE_TAGLINE } from "@/lib/constants";

function Accordion({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/50"
        aria-expanded={open}
      >
        {label}
        <span className="text-lg leading-none text-white/40">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-black pb-8 pt-10">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6">
        <div className="font-[family-name:var(--font-bask)] text-[26px] font-bold text-white md:text-[28px]">
          TrendSpot
          <span className="ml-0.5 text-[12px] font-semibold text-red md:text-[13px]">.co.ke</span>
        </div>
        <div className="mb-6 mt-1.5 text-[11px] uppercase tracking-[0.12em] text-white/30">
          {SITE_TAGLINE}
        </div>
        <div className="mb-6 h-px bg-white/10" />

        <div className="md:hidden">
          {FOOTER_SECTIONS.map((section) => (
            <Accordion key={section.label} label={section.label}>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-white/55 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>
          ))}
          <Accordion label="Social">
            <div className="flex flex-wrap gap-2">
              {["IG", "TT", "X", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-[12px] font-semibold text-white/45"
                  aria-label={s}
                >
                  {s}
                </a>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="mb-8 hidden grid-cols-2 gap-6 sm:grid-cols-3 md:grid md:grid-cols-5 md:gap-7">
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

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] text-white/25">
            © {new Date().getFullYear()} TrendSpot.co.ke. All rights reserved.
          </span>
          <span className="text-[11px] text-white/25">
            <Link href="/privacy" className="hover:text-white/50">Privacy</Link>
            {" · "}
            <Link href="/terms" className="hover:text-white/50">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
