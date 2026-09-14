/**
 * Cloudinary helpers for image delivery and transforms.
 * Upload operations that need API secret must run on the server only.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

export type ImageTransform =
  | "thumbnail"
  | "card"
  | "medium"
  | "hero"
  | "og"
  | "avatar";

const TRANSFORMS: Record<ImageTransform, string> = {
  thumbnail: "c_fill,w_200,h_133,f_auto,q_auto",
  card: "c_fill,w_600,h_400,f_auto,q_auto",
  medium: "c_fill,w_900,h_600,f_auto,q_auto",
  hero: "c_fill,w_1400,h_788,f_auto,q_auto",
  og: "c_fill,w_1200,h_630,f_auto,q_auto",
  avatar: "c_fill,w_96,h_96,f_auto,q_auto,g_face",
};

export function cloudinaryUrl(
  src: string | undefined | null,
  transform: ImageTransform = "card"
): string {
  if (!src) return "/placeholder-article.svg";
  if (!CLOUD_NAME) return src;

  if (src.includes("res.cloudinary.com")) {
    if (src.includes("/upload/")) {
      const parts = src.split("/upload/");
      if (parts.length === 2 && !parts[1].startsWith("c_") && !parts[1].startsWith("w_")) {
        return `${parts[0]}/upload/${TRANSFORMS[transform]}/${parts[1]}`;
      }
    }
    return src;
  }

  const publicId = src.replace(/^\//, "");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${TRANSFORMS[transform]}/${publicId}`;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME);
}

export async function uploadToCloudinary(
  file: File | Blob,
  options?: { folder?: string; publicId?: string }
): Promise<{ publicId: string; url: string; width: number; height: number }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) {
    throw new Error("Cloudinary is not configured for uploads.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  if (options?.folder) form.append("folder", options.folder);
  if (options?.publicId) form.append("public_id", options.publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cloudinary upload failed: ${err}`);
  }

  const data = await res.json();
  return {
    publicId: data.public_id,
    url: data.secure_url,
    width: data.width,
    height: data.height,
  };
}
