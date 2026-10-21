"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AuthProvider";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Modal,
  PageHeader,
  Spinner,
  fmtDate,
  fmtNum,
  inputClass,
  useToast,
} from "@/components/admin/ui";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { optimizeImageUrl } from "@/lib/cloudinary";

type Item = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  author: string;
  authorId: string;
  status: string;
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  views: number;
  publishedAt: string | null;
  updatedAt: string;
  image: string;
};

type Tab = "all" | "published" | "scheduled" | "draft";
const PAGE = 25;

function stateOf(a: Item): "published" | "scheduled" | "draft" {
  if (a.status !== "published") return "draft";
  if (a.publishedAt && new Date(a.publishedAt).getTime() > Date.now()) return "scheduled";
  return "published";
}

export default function ArticlesPage() {
  const { api, me } = useAdmin();
  const toast = useToast();
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Item | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const r = await api<{ articles: Item[] }>("/api/admin/articles");
      setItems(r.articles);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load articles.");
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { all: 0, published: 0, scheduled: 0, draft: 0 };
    (items || []).forEach((a) => {
      c.all++;
      c[stateOf(a)]++;
    });
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (items || []).filter(
      (a) =>
        (tab === "all" || stateOf(a) === tab) &&
        (!cat || a.categorySlug === cat) &&
        (!needle ||
          a.title.toLowerCase().includes(needle) ||
          a.author.toLowerCase().includes(needle))
    );
  }, [items, tab, q, cat]);

  useEffect(() => setPage(1), [tab, q, cat]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const shown = filtered.slice((page - 1) * PAGE, page * PAGE);

  async function remove() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await api(`/api/admin/articles/${toDelete.id}`, { method: "DELETE" });
      setItems((cur) => (cur || []).filter((a) => a.id !== toDelete.id));
      toast.ok("Article deleted.");
      setToDelete(null);
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusy(false);
    }
  }

  const tabs: [Tab, string][] = [
    ["all", "All"],
    ["published", "Published"],
    ["scheduled", "Scheduled"],
    ["draft", "Drafts"],
  ];

  return (
    <>
      <PageHeader
        title="Articles"
        subtitle={me?.role === "author" ? "Your stories." : "Every story on the site."}
        actions={
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-red px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-red-hover"
          >
            <i className="ti ti-plus" aria-hidden="true" /> New article
          </Link>
        }
      />
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {!items && !error && <Spinner label="Loading articles…" />}

      {items && (
        <Card padded={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-border2 px-5 py-3.5">
            <div className="flex flex-wrap gap-1" role="tablist">
              {tabs.map(([k, l]) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={`rounded-md px-3 py-1.5 text-[12.5px] font-semibold ${
                    tab === k ? "bg-black text-white" : "text-mid hover:bg-surface"
                  }`}
                >
                  {l} <span className="opacity-60">{counts[k]}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className={`${inputClass} !w-auto !py-2 !text-[13px]`}
                aria-label="Filter by category"
              >
                <option value="">All categories</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search title or author…"
                className={`${inputClass} !w-56 !py-2 !text-[13px]`}
                aria-label="Search articles"
              />
            </div>
          </div>

          {shown.length === 0 ? (
            <EmptyState
              icon="ti-news"
              title={items.length ? "No articles match" : "No articles yet"}
              text={items.length ? "Try a different filter or search." : "Write your first story."}
              action={
                !items.length && (
                  <Link
                    href="/admin/articles/new"
                    className="rounded-md bg-red px-4 py-2.5 text-[13px] font-semibold text-white"
                  >
                    New article
                  </Link>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-border2 text-[10.5px] uppercase tracking-[0.12em] text-mid">
                    <th className="px-5 py-3 font-extrabold">Story</th>
                    <th className="px-3 py-3 font-extrabold">Status</th>
                    <th className="px-3 py-3 text-right font-extrabold">Views</th>
                    <th className="px-3 py-3 font-extrabold">Date</th>
                    <th className="px-5 py-3 text-right font-extrabold">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((a) => {
                    const s = stateOf(a);
                    return (
                      <tr key={a.id} className="border-b border-border2 last:border-0 hover:bg-[#fafaf8]">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-surface">
                              {a.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={optimizeImageUrl(a.image, 160)}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/admin/articles/${a.id}/edit`}
                                className="line-clamp-1 text-[14px] font-semibold text-ink hover:text-red"
                              >
                                {a.title || "Untitled"}
                              </Link>
                              <div className="text-[12px] text-mid">
                                {a.category} · {a.author}
                                {a.breaking && <span className="ml-1.5 font-bold text-red">BREAKING</span>}
                                {a.featured && <span className="ml-1.5 font-bold">★</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <Badge tone={s === "published" ? "green" : s === "scheduled" ? "blue" : "amber"}>
                            {s}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-right text-[13.5px] font-semibold tabular-nums">
                          {fmtNum(a.views)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-[12.5px] text-mid">
                          {fmtDate(a.publishedAt || a.updatedAt)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            {s === "published" && (
                              <a
                                href={`/article/${a.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="View on site"
                                className="grid h-8 w-8 place-items-center rounded-md text-mid hover:bg-surface hover:text-ink"
                              >
                                <i className="ti ti-external-link" aria-hidden="true" />
                              </a>
                            )}
                            <Link
                              href={`/admin/articles/${a.id}/edit`}
                              aria-label="Edit"
                              className="grid h-8 w-8 place-items-center rounded-md text-mid hover:bg-surface hover:text-ink"
                            >
                              <i className="ti ti-pencil" aria-hidden="true" />
                            </Link>
                            {(me?.role !== "author" || s === "draft") && (
                              <button
                                onClick={() => setToDelete(a)}
                                aria-label="Delete"
                                className="grid h-8 w-8 place-items-center rounded-md text-mid hover:bg-[#fff5f5] hover:text-red"
                              >
                                <i className="ti ti-trash" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-border2 px-5 py-3 text-[12.5px] text-mid">
              <span>
                {filtered.length} articles · page {page} of {pages}
              </span>
              <div className="flex gap-2">
                <Button size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <Modal open={!!toDelete} title="Delete this article?" onClose={() => setToDelete(null)}>
        <p className="text-[14px] text-gray">
          “{toDelete?.title}” will be removed from the site permanently. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="red" disabled={busy} onClick={() => void remove()}>
            {busy ? "Deleting…" : "Delete article"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
