"use client";

import { useRef, useState } from "react";
import { useUpload } from "@/components/admin/useUpload";
import { optimizeImageUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

export type ImageValue = {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
};

/** Drag-and-drop / click-to-upload image box that stores to Cloudinary. */
export function ImageField({
  value,
  onChange,
  folder,
  aspectClass = "aspect-video",
  label = "Upload image",
}: {
  value: ImageValue | null;
  onChange: (v: ImageValue | null) => void;
  folder: string;
  aspectClass?: string;
  label?: string;
}) {
  const upload = useUpload();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  async function handle(file: File | undefined) {
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      const img = await upload(file, folder, setProgress);
      onChange({
        url: img.url,
        publicId: img.publicId,
        width: img.width,
        height: img.height,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handle(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative w-full overflow-hidden rounded-lg border-2 border-dashed bg-surface transition-colors",
          aspectClass,
          drag ? "border-red bg-[#fff5f5]" : "border-border",
          value && "border-solid border-border2"
        )}
      >
        {value?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={optimizeImageUrl(value.url, 900)}
            alt="Selected"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-mid hover:text-ink"
          >
            <i className="ti ti-cloud-upload text-[30px]" aria-hidden="true" />
            <span className="text-[13px] font-semibold">{label}</span>
            <span className="text-[12px] text-pale">Drag a file here or click to browse</span>
          </button>
        )}

        {progress !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85">
            <div className="h-1.5 w-2/3 max-w-[220px] overflow-hidden rounded-full bg-border2">
              <div
                className="h-full rounded-full bg-red transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[12px] font-semibold text-ink">Uploading… {progress}%</span>
          </div>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          void handle(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {value?.url && (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="rounded-md border border-border px-3 py-1.5 text-[12px] font-semibold hover:border-ink"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-md border border-border px-3 py-1.5 text-[12px] font-semibold text-red hover:border-red"
          >
            Remove
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] text-red">
          {error}
        </p>
      )}
    </div>
  );
}
