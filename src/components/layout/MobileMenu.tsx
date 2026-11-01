"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SocialLinks } from "./SocialIcons";

type Item = { label: string; href: string; external?: boolean };
type Group = { key: string; title: string; items: Item[] };

/** Top-level rows that are plain links. */
const QUICK: Item[] = [
  { label: "Home", href: "/" },
  { label: "Trending", href: "/category/trending" },
];

/** Dropdown rows — every section of the site is reachable from here. */
const GROUPS: Group[] = [
  {
    key: "entertainment",
    title: "Entertainment",
    items: [
      { label: "All Entertainment", href: "/category/entertainment" },
      { label: "Music", href: "/category/music" },
      { label: "TV", href: "/category/tv" },
      { label: "Movies", href: "/category/movies" },
      { label: "Video", href: "/category/video" },
      { label: "Charts", href: "/category/charts" },
    ],
  },
  {
    key: "celebs",
    title: "Celebrities",
    items: [
      { label: "All Celebrities", href: "/category/celebrities" },
      { label: "Royals", href: "/category/royals" },
    ],
  },
  {
    key: "style",
    title: "Fashion & Lifestyle",
    items: [
      { label: "Fashion", href: "/category/fashion" },
      { label: "Beauty", href: "/category/beauty" },
      { label: "Lifestyle", href: "/category/lifestyle" },
    ],
  },
  {
    key: "news",
    title: "Business & Features",
    items: [
      { label: "Business", href: "/category/business" },
      { label: "Awards", href: "/category/awards" },
      { label: "Lists", href: "/category/lists" },
    ],
  },
  {
    key: "company",
    title: "About TrendSpot",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Advertise With Us", href: "/contact" },
      { label: "Tip Line", href: "/contact" },
      { label: "Newsletter", href: "/#newsletter" },
      { label: "RSS Feed", href: "/feed.xml", external: true },
    ],
  },
  {
    key: "legal",
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Cookies", href: "/privacy" },
      { label: "Sitemap", href: "/sitemap.xml", external: true },
    ],
  },
];

export function MobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 769px)");
    const onResize = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname === href;

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    setQ("");
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      {/* Sticky phone bar */}
      <div className="mm-bar">
        <button
          ref={triggerRef}
          type="button"
          className="mm-trigger"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span className="mm-burger" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span className="mm-trigger-lbl">Menu</span>
        </button>
        <div className="mm-bar-right">
          <Link href="/search" className="mm-icon-btn" aria-label="Search">
            <i className="ti ti-search" aria-hidden="true"></i>
          </Link>
          <Link href="/#newsletter" className="mm-sub">
            Subscribe
          </Link>
        </div>
      </div>

      <div
        className={open ? "mm-overlay open" : "mm-overlay"}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        id="mobile-menu"
        className={open ? "mm-drawer open" : "mm-drawer"}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <div className="mm-head">
          <Link href="/" className="mm-brand" onClick={close}>
            TrendSpot<span>.co.ke</span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            className="mm-close"
            aria-label="Close menu"
            onClick={close}
          >
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>

        <div className="mm-scroll">
          <form className="mm-search" role="search" onSubmit={onSearch}>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search TrendSpot…"
              aria-label="Search TrendSpot"
              enterKeyHint="search"
            />
            <button type="submit" aria-label="Search">
              <i className="ti ti-search" aria-hidden="true"></i>
            </button>
          </form>

          <nav aria-label="Mobile">
            <ul className="mm-list">
              {QUICK.map((it) => (
                <li key={it.label}>
                  <Link
                    href={it.href}
                    className={isActive(it.href) ? "mm-row act" : "mm-row"}
                    onClick={close}
                  >
                    <span>{it.label}</span>
                    {it.label === "Trending" && <em className="mm-hot">Hot</em>}
                  </Link>
                </li>
              ))}

              {GROUPS.map((g) => {
                const isOpen = openGroup === g.key;
                return (
                  <li key={g.key} className={isOpen ? "mm-grp open" : "mm-grp"}>
                    <button
                      type="button"
                      className="mm-row mm-row-btn"
                      aria-expanded={isOpen}
                      aria-controls={`mm-sub-${g.key}`}
                      onClick={() => setOpenGroup(isOpen ? null : g.key)}
                    >
                      <span>{g.title}</span>
                      <i className="ti ti-chevron-down mm-chev" aria-hidden="true"></i>
                    </button>
                    <div className="mm-sub" id={`mm-sub-${g.key}`} inert={!isOpen}>
                      <ul>
                        {g.items.map((it) => (
                          <li key={it.label}>
                            {it.external ? (
                              <a href={it.href} className="mm-subrow" onClick={close}>
                                {it.label}
                              </a>
                            ) : (
                              <Link
                                href={it.href}
                                className={isActive(it.href) ? "mm-subrow act" : "mm-subrow"}
                                onClick={close}
                              >
                                {it.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mm-foot">
          <Link href="/#newsletter" className="mm-cta" onClick={close}>
            Subscribe to our newsletter
          </Link>
          <div className="mm-follow">
            <span>Follow us</span>
            <div className="mm-socials">
              <SocialLinks className="mm-soc" size={20} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
