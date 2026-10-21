"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/components/admin/AuthProvider";
import { ImageField, type ImageValue } from "@/components/admin/ImageField";
import { RichEditor } from "@/components/admin/RichEditor";
import { useUpload } from "@/components/admin/useUpload";
import {
  Badge,
  Button,
  Card,
  ErrorBanner,
  Field,
  PageHeader,
  Spinner,
  Toggle,
  fmtDateTime,
  fmtNum,
  inputClass,
  useToast,
} from "@/components/admin/ui";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { optimizeImageUrl } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";
import type { Article } from "@/types";

function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

type Loaded = { article: Article };

export function ArticleForm({ id }: { id?: string }) {
  const router = useRouter();
  const { api, me } = useAdmin();
  const toast = useToast();
  const upload = useUpload();

  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const [initialBody, setInitialBody] = useState("");
  const bodyRef = useRef("");
  const dirty = useRef(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [categorySlug, setCategorySlug] = useState("entertainment");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [image, setImage] = useState<ImageValue | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [author, setAuthor] = useState(me?.name || "");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [featured, setFeatured] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [trending, setTrending] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [stats, setStats] = useState<{ views: number; readingTime: number; updatedAt: string } | null>(null);

  const isAuthor = me?.role === "author";
  const touch = () => {
    dirty.current = true;
  };

  /* ── load an existing article ── */
  useEffect(() => {
    if (!id) return;
    let alive = true;
    api<Loaded>(`/api/admin/articles/${id}`)
      .then(({ article: a }) => {
        if (!alive) return;
        setTitle(a.title);
        setSlug(a.slug);
        setSlugTouched(true);
        setExcerpt(a.excerpt);
        setCategorySlug(a.categorySlug);
        setTags(a.tags);
        setImage(
          a.featuredImage.url && !a.featuredImage.url.endsWith("placeholder-article.svg")
            ? {
                url: a.featuredImage.url,
                publicId: a.featuredImage.publicId,
                width: a.featuredImage.width,
                height: a.featuredImage.height,
              }
            : null
        );
        setImageAlt(a.featuredImage.alt === a.title ? "" : a.featuredImage.alt);
        setImageCaption(a.featuredImage.caption || "");
        setAuthor(a.author);
        setStatus(a.status === "published" ? "published" : "draft");
        setPublishedAt(toLocalInput(a.publishedAt));
        setFeatured(a.featured);
        setBreaking(a.breaking);
        setTrending(a.trending);
        setSeoTitle(a.seoTitle || "");
        setSeoDescription(a.seoDescription || "");
        setStats({ views: a.views, readingTime: a.readingTime, updatedAt: a.updatedAt });
        bodyRef.current = a.body;
        setInitialBody(a.body);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (!alive) return;
        setLoadError(e.message);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id, api]);

  /* ── warn before leaving with unsaved work ── */
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, []);

  const onUploadImage = useCallback(
    async (file: File) => {
      const img = await upload(file, "trendspot/articles");
      return { url: optimizeImageUrl(img.url, 1400) };
    },
    [upload]
  );

  function addTag(raw: string) {
    const t = raw.trim().replace(/,+$/, "");
    if (!t || tags.includes(t) || tags.length >= 10) return;
    setTags([...tags, t]);
    setTagDraft("");
    touch();
  }

  function onTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === "Backspace" && !tagDraft && tags.length) {
      setTags(tags.slice(0, -1));
      touch();
    }
  }

  async function save(nextStatus: "draft" | "published") {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        excerpt,
        body: bodyRef.current,
        categorySlug,
        tags,
        featuredImage: {
          url: image?.url || "",
          publicId: image?.publicId || "",
          width: image?.width || 0,
          height: image?.height || 0,
          alt: imageAlt,
          caption: imageCaption,
        },
        author,
        status: nextStatus,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : "",
        featured,
        breaking,
        trending,
        seoTitle,
        seoDescription,
      };

      const res = id
        ? await api<{ id: string; slug: string; status: string }>(`/api/admin/articles/${id}`, {
            method: "PUT",
            body: payload,
          })
        : await api<{ id: string; slug: string; status: string }>("/api/admin/articles", {
            method: "POST",
            body: payload,
          });

      dirty.current = false;
      setSlug(res.slug);
      setStatus(res.status === "published" ? "published" : "draft");
      toast.ok(
        res.status === "published"
          ? nextStatus === "published" && id
            ? "Article updated."
            : "Article published."
          : "Draft saved."
      );
      if (!id) router.replace(`/admin/articles/${res.id}/edit`);
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not save the article.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Loading article…" />;
  if (loadError) {
    return (
      <div>
        <ErrorBanner>{loadError}</ErrorBanner>
        <Link href="/admin/articles" className="text-[13px] font-semibold text-red hover:underline">
          ← Back to articles
        </Link>
      </div>
    );
  }

  const scheduled =
    status !== "published" && publishedAt !== "" && new Date(publishedAt).getTime() > Date.now();
  const futurePublish = publishedAt !== "" && new Date(publishedAt).getTime() > Date.now();

  const actions = (
    <>
      {status === "published" ? (
        <>
          <Button variant="secondary" disabled={saving || isAuthor} onClick={() => void save("draft")}>
            Unpublish
          </Button>
          <Button variant="red" disabled={saving} onClick={() => void save("published")}>
            {saving ? "Saving…" : "Update article"}
          </Button>
        </>
      ) : (
        <>
          <Button variant="secondary" disabled={saving} onClick={() => void save("draft")}>
            {saving ? "Saving…" : "Save draft"}
          </Button>
          {!isAuthor && (
            <Button variant="red" disabled={saving} onClick={() => void save("published")}>
              {futurePublish ? "Schedule" : "Publish now"}
            </Button>
          )}
        </>
      )}
    </>
  );

  return (
    <div>
      <PageHeader
        title={id ? "Edit article" : "New article"}
        subtitle={
          isAuthor
            ? "Write your story and save it as a draft — an editor will review and publish it."
            : undefined
        }
        actions={
          <>
            <Link
              href="/admin/articles"
              className="mr-1 text-[13px] font-semibold text-mid hover:text-ink"
            >
              ← All articles
            </Link>
            {actions}
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ───── Writing column ───── */}
        <div className="min-w-0 space-y-5">
          <div className="rounded-lg border border-border2 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <textarea
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
                touch();
              }}
              rows={2}
              placeholder="Headline"
              aria-label="Headline"
              className="w-full resize-none border-0 bg-transparent font-[family-name:var(--font-bask)] text-[28px] font-bold leading-[1.2] text-black outline-none placeholder:text-border sm:text-[32px]"
            />
            <div className="mt-2 flex items-center gap-1.5 text-[12.5px] text-mid">
              <span className="shrink-0">/article/</span>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugTouched(true);
                  touch();
                }}
                aria-label="URL slug"
                placeholder="url-of-the-article"
                className="min-w-0 flex-1 border-0 border-b border-dashed border-border bg-transparent py-0.5 text-ink outline-none focus:border-ink"
              />
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                touch();
              }}
              rows={3}
              maxLength={400}
              placeholder="Short summary — shown under the headline and in search results"
              aria-label="Summary"
              className="mt-5 w-full resize-y rounded-md border border-border2 bg-[#fafafa] px-4 py-3 font-[family-name:var(--font-serif)] text-[16px] leading-relaxed text-gray outline-none placeholder:text-pale focus:border-ink"
            />
            <div className="mt-1 text-right text-[11.5px] text-pale">{excerpt.length}/400</div>
          </div>

          <RichEditor
            initialHtml={initialBody}
            onChange={(html) => {
              bodyRef.current = html;
              touch();
            }}
            onUploadImage={onUploadImage}
          />
        </div>

        {/* ───── Settings column ───── */}
        <div className="space-y-5 lg:sticky lg:top-6">
          <Card title="Publish">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] text-mid">Status</span>
              {status === "published" ? (
                futurePublish ? (
                  <Badge tone="blue">Scheduled</Badge>
                ) : (
                  <Badge tone="green">Published</Badge>
                )
              ) : scheduled ? (
                <Badge tone="blue">Draft · dated</Badge>
              ) : (
                <Badge tone="amber">Draft</Badge>
              )}
            </div>

            {!isAuthor && (
              <Field
                label="Publish date & time"
                hint="Leave empty to publish immediately. A future time schedules the article."
              >
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => {
                    setPublishedAt(e.target.value);
                    touch();
                  }}
                  className={inputClass}
                />
              </Field>
            )}

            <div className="mt-5 flex flex-wrap gap-2">{actions}</div>

            {status === "published" && slug && (
              <Link
                href={`/article/${slug}`}
                target="_blank"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-red hover:underline"
              >
                <i className="ti ti-external-link" aria-hidden="true" />
                View on site
              </Link>
            )}

            {stats && (
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border2 pt-4 text-[12.5px]">
                <div>
                  <dt className="text-mid">Views</dt>
                  <dd className="font-[family-name:var(--font-bask)] text-[20px] font-bold">
                    {fmtNum(stats.views)}
                  </dd>
                </div>
                <div>
                  <dt className="text-mid">Read time</dt>
                  <dd className="font-[family-name:var(--font-bask)] text-[20px] font-bold">
                    {stats.readingTime} min
                  </dd>
                </div>
                <div className="col-span-2 text-[11.5px] text-pale">
                  Last saved {fmtDateTime(stats.updatedAt)}
                </div>
              </dl>
            )}
          </Card>

          <Card title="Cover image">
            <ImageField
              value={image}
              onChange={(v) => {
                setImage(v);
                touch();
              }}
              folder="trendspot/covers"
              label="Upload cover image"
            />
            <div className="mt-4 space-y-3">
              <Field label="Alt text" hint="Describe the image for screen readers.">
                <input
                  value={imageAlt}
                  onChange={(e) => {
                    setImageAlt(e.target.value);
                    touch();
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Caption / credit">
                <input
                  value={imageCaption}
                  onChange={(e) => {
                    setImageCaption(e.target.value);
                    touch();
                  }}
                  placeholder="Photo: …"
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>

          <Card title="Category & tags">
            <Field label="Category">
              <select
                value={categorySlug}
                onChange={(e) => {
                  setCategorySlug(e.target.value);
                  touch();
                }}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="mt-4">
              <Field label="Tags" hint="Press Enter or comma to add. Up to 10.">
                <div className="flex flex-wrap gap-1.5 rounded-md border border-border bg-white p-2 focus-within:border-ink">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium"
                    >
                      {t}
                      <button
                        type="button"
                        aria-label={`Remove ${t}`}
                        onClick={() => {
                          setTags(tags.filter((x) => x !== t));
                          touch();
                        }}
                        className="text-mid hover:text-red"
                      >
                        <i className="ti ti-x text-[12px]" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagDraft}
                    onChange={(e) => setTagDraft(e.target.value)}
                    onKeyDown={onTagKey}
                    onBlur={() => addTag(tagDraft)}
                    placeholder={tags.length ? "" : "e.g. afrobeats"}
                    className="min-w-[90px] flex-1 border-0 bg-transparent px-1 py-1 text-[13px] outline-none"
                  />
                </div>
              </Field>
            </div>
          </Card>

          {!isAuthor && (
            <Card title="Placement">
              <div className="space-y-4">
                <Toggle
                  checked={featured}
                  onChange={(v) => {
                    setFeatured(v);
                    touch();
                  }}
                  label="Top story"
                  hint="Cover story at the top of the homepage."
                />
                <Toggle
                  checked={breaking}
                  onChange={(v) => {
                    setBreaking(v);
                    touch();
                  }}
                  label="Breaking news"
                  hint="Appears in the red ticker."
                />
                <Toggle
                  checked={trending}
                  onChange={(v) => {
                    setTrending(v);
                    touch();
                  }}
                  label="Trending"
                  hint="Also appears in the ticker."
                />
              </div>
            </Card>
          )}

          <Card title="Byline & SEO">
            <div className="space-y-4">
              <Field label="Author name">
                <input
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    touch();
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="SEO title" hint={`${seoTitle.length}/60 — defaults to the headline`}>
                <input
                  value={seoTitle}
                  maxLength={120}
                  onChange={(e) => {
                    setSeoTitle(e.target.value);
                    touch();
                  }}
                  className={inputClass}
                />
              </Field>
              <Field
                label="SEO description"
                hint={`${seoDescription.length}/160 — defaults to the summary`}
              >
                <textarea
                  value={seoDescription}
                  rows={3}
                  maxLength={300}
                  onChange={(e) => {
                    setSeoDescription(e.target.value);
                    touch();
                  }}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
