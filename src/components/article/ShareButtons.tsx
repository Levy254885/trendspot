"use client";

import { useState } from "react";
import { absoluteUrl } from "@/lib/utils";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = absoluteUrl(`/article/${slug}`);
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
    },
  ];

  return (
    <div className="mt-8 border-t border-border2 pt-5">
      <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
        Share
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink transition-colors hover:border-red hover:text-red"
          >
            {l.label}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          className="border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink transition-colors hover:border-red hover:text-red"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
