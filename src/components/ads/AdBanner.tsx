"use client";

import { useEffect } from "react";
import type { PublicAd } from "@/types";

/** A single advert. Counts one impression per session; clicks go through /api/ads/click. */
export function AdBanner({ ad, className = "" }: { ad: PublicAd; className?: string }) {
  useEffect(() => {
    const key = `ts:ad:${ad.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ad.id }),
      keepalive: true,
    }).catch(() => {});
  }, [ad.id]);

  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src={ad.imageUrl} alt={ad.alt} loading="lazy" />;
  return (
    <div className={`ad-slot ${className}`}>
      <span className="ad-label">Advertisement</span>
      {ad.hasLink ? (
        <a href={`/api/ads/click?id=${encodeURIComponent(ad.id)}`} target="_blank" rel="sponsored noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
