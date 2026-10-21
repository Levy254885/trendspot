/**
 * Cloudinary helpers.
 *
 * Uploads go straight from the browser to Cloudinary using an UNSIGNED upload
 * preset, so no API secret is needed in the app:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

export type UploadedImage = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  name: string;
};

/** Upload one image file to Cloudinary, reporting progress (0–100). */
export function uploadImage(
  file: File,
  opts: { folder?: string; onProgress?: (percent: number) => void } = {}
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(
        new Error(
          "Cloudinary isn't configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
        )
      );
      return;
    }
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      reject(new Error("That image is larger than 15 MB."));
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    if (opts.folder) form.append("folder", opts.folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && opts.onProgress) {
        opts.onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading."));
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            bytes: data.bytes,
            format: data.format,
            name: data.original_filename || file.name,
          });
        } else {
          reject(
            new Error(data?.error?.message || "Cloudinary rejected the upload.")
          );
        }
      } catch {
        reject(new Error("Unexpected response from Cloudinary."));
      }
    };
    xhr.send(form);
  });
}

/**
 * Adds automatic format/quality (and optional max width) to a Cloudinary URL.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function optimizeImageUrl(url: string, width?: number): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const [head, tail] = url.split("/upload/");
  if (/^(c_|w_|f_|q_)/.test(tail)) return url; // already transformed
  const t = ["f_auto", "q_auto", width ? `w_${width}` : ""].filter(Boolean).join(",");
  return `${head}/upload/${t}/${tail}`;
}
