import { fetchAdvert } from "@/services/adverts";
import { AdBanner } from "@/components/ads/AdBanner";
import type { AdPlacement } from "@/types";

/** Server component: renders a live advert for a placement, or nothing. */
export async function AdSlot({ placement, className }: { placement: AdPlacement; className?: string }) {
  const ad = await fetchAdvert(placement);
  if (!ad) return null;
  return <AdBanner ad={ad} className={className} />;
}
