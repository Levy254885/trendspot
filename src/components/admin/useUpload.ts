"use client";

import { useCallback } from "react";
import { useAdmin } from "@/components/admin/AuthProvider";
import { uploadImage, type UploadedImage } from "@/lib/cloudinary";

/**
 * Uploads an image to Cloudinary and records it in the media library
 * (Firestore) so it shows up on the Media page.
 */
export function useUpload() {
  const { api } = useAdmin();
  return useCallback(
    async (
      file: File,
      folder: string,
      onProgress?: (percent: number) => void
    ): Promise<UploadedImage> => {
      const img = await uploadImage(file, { folder, onProgress });
      try {
        await api("/api/admin/media", {
          method: "POST",
          body: {
            url: img.url,
            publicId: img.publicId,
            name: img.name,
            width: img.width,
            height: img.height,
            bytes: img.bytes,
            format: img.format,
          },
        });
      } catch {
        /* the upload itself succeeded; the library entry is best-effort */
      }
      return img;
    },
    [api]
  );
}
