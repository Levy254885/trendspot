"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SocialLinks } from "./SocialIcons";

type Item = { label: string; href: string; icon: string; external?: boolean };
type Group = { key: string; title: string; icon: string; items: Item[] };

/** Everything reachable from the phone menu, grouped into dropdowns. */
const GROUPS: Group[] = [
  {
    key: "entertainment",
    title: "Entertainment",
    icon: "ti-masks-theater",
    items: [
      { label: "Entertainment", href: "/category/entertainment", icon: "ti-masks-theater" },
      { label: "Music", href: "/category/music", icon: "ti-music" },
      { label: "TV", href: "/category/tv", icon: "ti-device-tv" },
      { label: "Movies", href: "/category/movies", icon: "ti-movie" },
      { label: "Video", href: "/category/video", icon: "ti-player-play" },
      { label: "Charts", href: "/category/charts", icon: "ti-chart-bar" },
    ],
  },
  {
    key: "style",
    title: "Celebrity & Style",
    icon: "ti-star",
    items: [
      { label: "Celebrities", href: "/category/celebrities", icon: "ti-star" },
      { label: "Royals", href: "/category/royals", icon: "ti-crown" },
      { label: "Fashion", href: "/category/fashion", icon: "ti-hanger" },
      { label: "Beauty", href: "/category/beauty", icon: "ti-sparkles" },
      { label: "Lifestyle", href: "/category/lifestyle", icon: "ti-heart" },
    ],
  },
  {
    key: "news",
    title: "News & Features",
    icon: "ti-news",
    items: [
      { label: "Trending", href: "/category/trending", icon: "ti-flame" },
      { label: "Business", href: "/category/business", icon: "ti-briefcase" },
      { label: "Awards", href: "/category/awards", icon: "ti-trophy" },
      { label: "Lists", href: "/category/lists", icon: "ti-list-details" },
    ],
  },
  {
    key: "company",
    title: "TrendSpot",
    icon: "ti-info-circle",
    items: [
      { label: "About Us", href: "/about", icon: "ti-info-circle" },
      { label: "Contact", href: "/contact", icon: "ti-mail" },
      { label: "Advertise", href: "/contact", icon: "ti-speakerphone" },
      { label: "Tip Line", href: "/contact", icon: "ti-send" },
      { label: "Newsletter", href: "/#newsletter", icon: "ti-mailbox" },
      { label: "RSS Feed", href: "/feed.xml", icon: "ti-rss", external: true },
    ],
  },
  {
    key: "legal",
    title: "Legal & Info",
    icon: "ti-shield-lock",
    items: [
      { label: "Privacy Policy", href: "/privacy", icon: "ti-shield-lock" },
      { label: "Terms of Use", href: "/terms", icon: "ti-file-text" },
      { label: "Disclaimer", href: "/disclaimer", icon: "ti-alert-triangle" },
      { label: "Cookies", href: "/privacy", icon: "ti-cookie" },
      { label: "Sitemap", href: "/sitemap.xml", icon: "ti-sitemap", external: true },
    ],
  },
];

export function MobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>("entertainment");
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

      {/* Backdrop */}
      <div
        className={open ? "mm-overlay open" : "mm-overlay"}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
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
            <i className="ti ti-search" aria-hidden="true"></i>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search stories, stars, music…"
              aria-label="Search TrendSpot"
              enterKeyHint="search"
            />
            <button type="submit">Go</button>
          </form>

          <Link
            href="/"
            className={isActive("/") ? "mm-home act" : "mm-home"}
            onClick={close}
            style={{ ["--i" as string]: 0 }}
          >
            <i className="ti ti-home" aria-hidden="true"></i>
            <span>Home · Latest News</span>
          </Link>

          <div className="mm-groups">
            {GROUPS.map((g, gi) => {
              const isOpen = openGroup === g.key;
              return (
                <div
                  key={g.key}
                  className={isOpen ? "mm-group open" : "mm-group"}
                  style={{ ["--i" as string]: gi + 1 }}
                >
                  <button
                    type="button"
                    className="mm-group-btn"
                    aria-expanded={isOpen}
                    aria-controls={`mm-panel-${g.key}`}
                    onClick={() => setOpenGroup(isOpen ? null : g.key)}
                  >
                    <span className="mm-group-ico">
                      <i className={`ti ${g.icon}`} aria-hidden="true"></i>
                    </span>
                    <span className="mm-group-title">{g.title}</span>
                    <span className="mm-group-count">{g.items.length}</span>
                    <i className="ti ti-chevron-down mm-chev" aria-hidden="true"></i>
                  </button>
                  <div className="mm-panel" id={`mm-panel-${g.key}`} inert={!isOpen}>
                    <div className="mm-panel-in">
                      <div className="mm-items">
                        {g.items.map((it) =>
                          it.external ? (
                            <a key={it.label} href={it.href} className="mm-item" onClick={close}>
                              <i className={`ti ${it.icon}`} aria-hidden="true"></i>
                              {it.label}
                            </a>
                          ) : (
                            <Link
                              key={it.label}
                              href={it.href}
                              className={isActive(it.href) ? "mm-item act" : "mm-item"}
                              onClick={close}
                            >
                              <i className={`ti ${it.icon}`} aria-hidden="true"></i>
                              {it.label}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/#newsletter" className="mm-cta" onClick={close}>
            <i className="ti ti-mail-fast" aria-hidden="true"></i>
            Get the TrendSpot newsletter
          </Link>

          <div className="mm-follow">
            <span>Follow us</span>
            <div className="mm-socials">
              <SocialLinks className="mm-soc" size={20} />
            </div>
          </div>
          <div className="mm-copy">
            © {new Date().getFullYear()} TrendSpot.co.ke
          </div>
        </div>
      </aside>
    </>
  );
}
