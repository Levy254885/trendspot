/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDb, isAdminConfigured } from "@/lib/firebase/admin";
import { cached } from "@/lib/server-cache";
import { nairobiDate } from "@/lib/dates";
import type { AdPlacement, Advert, PublicAd } from "@/types";

export function toAdvert(id: string, d: Record<string, any>): Advert {
  return {
    id,
    name: String(d.name || ""),
    placement: (d.placement || "sidebar") as AdPlacement,
    imageUrl: String(d.imageUrl || ""),
    imagePublicId: d.imagePublicId || undefined,
    linkUrl: String(d.linkUrl || ""),
    alt: String(d.alt || ""),
    startDate: d.startDate || null,
    endDate: d.endDate || null,
    active: d.active !== false,
    impressions: Number(d.impressions) || 0,
    clicks: Number(d.clicks) || 0,
    createdAt: String(d.createdAt || ""),
    updatedAt: String(d.updatedAt || ""),
  };
}

/** Is this advert switched on and inside its date window right now? */
export function isLive(ad: Advert, today = nairobiDate()): boolean {
  if (!ad.active || !ad.imageUrl) return false;
  if (ad.startDate && today < ad.startDate) return false;
  if (ad.endDate && today > ad.endDate) return false;
  return true;
}

async function liveAdverts(): Promise<Advert[]> {
  if (!isAdminConfigured()) return [];
  return cached("live-adverts", 60_000, async () => {
    try {
      const db = getDb();
      if (!db) return [];
      const snap = await db
        .collection("adverts")
        .where("active", "==", true)
        .limit(200)
        .get();
      return snap.docs
        .map((d) => toAdvert(d.id, d.data()))
        .filter((a) => isLive(a));
    } catch (err) {
      console.error("Could not load adverts:", err);
      return [];
    }
  });
}

/** One live advert for a placement (random when several are running). */
export async function fetchAdvert(
  placement: AdPlacement
): Promise<PublicAd | null> {
  const ads = (await liveAdverts()).filter((a) => a.placement === placement);
  if (!ads.length) return null;
  const ad = ads[Math.floor(Math.random() * ads.length)];
  return {
    id: ad.id,
    imageUrl: ad.imageUrl,
    alt: ad.alt || ad.name,
    hasLink: Boolean(ad.linkUrl),
  };
}
