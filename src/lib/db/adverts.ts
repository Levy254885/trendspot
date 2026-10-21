/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError, clean } from "@/lib/api";
import { AD_PLACEMENTS } from "@/lib/constants";

const isDay = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Validates an advert payload; used for both create and update. */
export function buildAdvertData(input: Record<string, any>) {
  const name = clean(input.name, 120);
  if (!name) throw new ApiError(400, "Give the advert a name.");

  const placement = AD_PLACEMENTS.find((p) => p.value === input.placement);
  if (!placement) throw new ApiError(400, "Choose where the advert should appear.");

  const imageUrl = clean(input.imageUrl, 1000);
  if (!/^https:\/\//i.test(imageUrl)) {
    throw new ApiError(400, "Upload an image for the advert.");
  }

  const linkUrl = clean(input.linkUrl, 1000);
  if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
    throw new ApiError(400, "The link must start with http:// or https://");
  }

  const startDate = isDay(input.startDate) ? input.startDate : null;
  const endDate = isDay(input.endDate) ? input.endDate : null;
  if (startDate && endDate && endDate < startDate) {
    throw new ApiError(400, "The end date is before the start date.");
  }

  return {
    name,
    placement: placement.value,
    imageUrl,
    imagePublicId: clean(input.imagePublicId, 200),
    linkUrl,
    alt: clean(input.alt, 200),
    startDate,
    endDate,
    active: input.active !== false,
  };
}
