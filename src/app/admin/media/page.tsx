"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAdmin } from "@/components/admin/AuthProvider";
import { useUpload } from "@/components/admin/useUpload";
import {
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Spinner,
  fmtDate,
  useToast,
} from "@/components/admin/ui";
import { isCloudinaryConfigured, optimizeImageUrl } from "@/lib/cloudinary";
import type { MediaItem } from "@/types";

function size(b: number) {
  if (b > 1_000_000) return `${(b / 1_000_000).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(b / 1000))} KB`;
}

export default function MediaPage() {
  const { api } = useAdmin();
  const upload = useUpload();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setItems((await api<{ media: MediaItem[] }>("/api/admin/media")).media);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load media.");
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleFiles(files: FileList | File[] | null) {
    if (!files) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return toast.err("Choose image files.");
    await Promise.all(
      list.map(async (f, i) => {
        const key = `${f.name}-${i}-${f.size}`;
        setProgress((p) => ({ ...p, [key]: 0 }));
        try {
          await upload(f, "trendspot/library", (n) => setProgress((p) => ({ ...p, [key]: n })));
        } catch (e) {
          toast.err(`${f.name}: ${e instanceof Error ? e.message : "upload failed"}`);
        } finally {
          setProgress((p) => {
            const c = { ...p };
            delete c[key];
            return c;
          });
        }
      })
    );
    await load();
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.ok("Image URL copied.");
    } catch {
      toast.err("Couldn't copy. Select the URL and copy it manually.");
    }
  }

  async function remove(m: MediaItem) {
    try {
      await api(`/api/admin/media/${m.id}`, { method: "DELETE" });
      setItems((cur) => (cur || []).filter((x) => x.id !== m.id));
      setSelected(null);
      toast.ok("Removed from the library.");
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not remove.");
    }
  }

  const uploading = Object.keys(progress).length > 0;

  return (
    <>
      <PageHeader
        title="Media library"
        subtitle="Every image you've uploaded. Files are stored on Cloudinary."
        actions={
          <Button variant="red" onClick={() => input.current?.click()}>
            <i className="ti ti-upload" aria-hidden="true" /> Upload images
          </Button>
        }
      />
      {!isCloudinaryConfigured() && (
        <ErrorBanner>
          Cloudinary isn&apos;t configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
          NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, then redeploy.
        </ErrorBanner>
      )}
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`mb-6 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
          drag ? "border-red bg-[#fff5f5]" : "border-border bg-white"
        }`}
      >
        {uploading ? (
          <div className="mx-auto max-w-sm space-y-2">
            {Object.entries(progress).map(([k, n]) => (
              <div key={k}>
                <div className="h-1.5 overflow-hidden rounded-full bg-border2">
                  <div className="h-full bg-red transition-all" style={{ width: `${n}%` }} />
                </div>
              </div>
            ))}
            <p className="text-[12.5px] font-semibold">Uploading {Object.keys(progress).length} file(s)…</p>
          </div>
        ) : (
          <>
            <i className="ti ti-cloud-upload text-[28px] text-pale" aria-hidden="true" />
            <p className="mt-1 text-[13.5px] font-semibold">Drag images here to upload</p>
            <p className="text-[12px] text-pale">JPG, PNG, WebP or GIF · up to 15 MB each</p>
          </>
        )}
      </div>

      {!items && !error && <Spinner label="Loading media…" />}
      {items && items.length === 0 && (
        <Card>
          <EmptyState icon="ti-photo" title="No images yet" text="Uploads from articles and adverts appear here too." />
        </Card>
      )}
      {items && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`group overflow-hidden rounded-lg border bg-white text-left transition-shadow hover:shadow-md ${
                selected?.id === m.id ? "border-red" : "border-border2"
              }`}
            >
              <div className="aspect-square overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optimizeImageUrl(m.url, 360)}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="px-3 py-2">
                <div className="truncate text-[12.5px] font-semibold">{m.name || "Image"}</div>
                <div className="text-[11px] text-mid">
                  {m.width}×{m.height} · {size(m.bytes)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:left-[260px]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optimizeImageUrl(selected.url, 120)} alt="" className="h-14 w-14 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-semibold">{selected.name || "Image"}</div>
              <div className="text-[12px] text-mid">
                {selected.width}×{selected.height} · {size(selected.bytes)} · {fmtDate(selected.createdAt)}
                {selected.uploadedBy && ` · ${selected.uploadedBy}`}
              </div>
            </div>
            <Button onClick={() => void copy(selected.url)}>
              <i className="ti ti-copy" aria-hidden="true" /> Copy URL
            </Button>
            <Button variant="danger" onClick={() => void remove(selected)}>
              Remove
            </Button>
            <Button variant="ghost" onClick={() => setSelected(null)} aria-label="Close">
              <i className="ti ti-x" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
