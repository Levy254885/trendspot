"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

const CATEGORIES = NAV_ITEMS.filter((n) => n.href.startsWith("/category")).map(
  (n) => ({ name: n.label, slug: n.href.replace("/category/", "") })
);

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categorySlug, setCategorySlug] = useState(CATEGORIES[0]?.slug || "entertainment");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [trending, setTrending] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          body,
          categorySlug,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          featured,
          breaking,
          trending,
          status,
          seoTitle: seoTitle || title,
          seoDescription: seoDescription || excerpt,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Could not save article.");
        return;
      }
      setMessage(
        data.id
          ? "Article saved. Redirecting…"
          : "Saved locally (Firebase not configured). Wire Firebase to persist."
      );
      if (data.id) {
        router.push(`/admin/articles/${data.id}/edit`);
      }
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-bask)] text-2xl font-bold">New article</h1>
        <Link href="/admin/articles" className="text-xs font-semibold uppercase text-mid hover:text-red">Cancel</Link>
      </div>

      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5 border border-border bg-white p-5">
          <label className="block">
            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-mid">Headline</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-border px-3 py-2.5 font-[family-name:var(--font-bask)] text-lg font-bold outline-none focus:border-ink"
              placeholder="Article title" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-mid">Deck / excerpt</span>
            <textarea required rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border border-border px-3 py-2.5 font-[family-name:var(--font-serif)] text-sm outline-none focus:border-ink" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-mid">Body (HTML allowed)</span>
            <textarea required rows={16} value={body} onChange={(e) => setBody(e.target.value)}
              className="w-full border border-border px-3 py-2.5 font-mono text-sm outline-none focus:border-ink"
              placeholder="<p>First paragraph…</p>" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-mid">SEO title</span>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-ink" />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-mid">SEO description</span>
              <input value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-ink" />
            </label>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="border border-border bg-white p-4">
            <div className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-mid">Publish</div>
            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="mb-3 w-full border border-border px-2 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button type="submit" disabled={loading}
              className="w-full bg-black py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red disabled:opacity-60">
              {loading ? "Saving…" : "Save article"}
            </button>
            {message && <p className="mt-3 text-xs text-gray" role="status">{message}</p>}
          </div>
          <div className="border border-border bg-white p-4">
            <div className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-mid">Category</div>
            <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full border border-border px-2 py-2 text-sm">
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="border border-border bg-white p-4">
            <div className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-mid">Flags</div>
            <label className="mb-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured
            </label>
            <label className="mb-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} /> Breaking
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={trending} onChange={(e) => setTrending(e.target.checked)} /> Trending
            </label>
          </div>
          <div className="border border-border bg-white p-4">
            <label className="block">
              <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-mid">Tags (comma-separated)</span>
              <input value={tags} onChange={(e) => setTags(e.target.value)}
                className="w-full border border-border px-2 py-2 text-sm outline-none focus:border-ink"
                placeholder="fashion, runway" />
            </label>
          </div>
        </aside>
      </form>
    </div>
  );
}
