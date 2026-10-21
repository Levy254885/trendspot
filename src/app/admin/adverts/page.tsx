"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AuthProvider";
import { ImageField, type ImageValue } from "@/components/admin/ImageField";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  Modal,
  PageHeader,
  Spinner,
  Toggle,
  fmtNum,
  inputClass,
  useToast,
} from "@/components/admin/ui";
import { optimizeImageUrl } from "@/lib/cloudinary";
import { AD_PLACEMENTS } from "@/lib/constants";
import type { Advert, AdPlacement } from "@/types";

type Form = {
  id: string | null;
  name: string;
  placement: AdPlacement;
  image: ImageValue | null;
  linkUrl: string;
  alt: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

const blank: Form = {
  id: null,
  name: "",
  placement: "home-top",
  image: null,
  linkUrl: "",
  alt: "",
  startDate: "",
  endDate: "",
  active: true,
};

function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
}

function statusOf(a: Advert): { label: string; tone: "green" | "gray" | "blue" | "amber" } {
  const t = today();
  if (!a.active) return { label: "Paused", tone: "gray" };
  if (a.startDate && t < a.startDate) return { label: "Scheduled", tone: "blue" };
  if (a.endDate && t > a.endDate) return { label: "Expired", tone: "amber" };
  return { label: "Live", tone: "green" };
}

export default function AdvertsPage() {
  const { api } = useAdmin();
  const toast = useToast();
  const [ads, setAds] = useState<Advert[] | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toDelete, setToDelete] = useState<Advert | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setAds((await api<{ adverts: Advert[] }>("/api/admin/adverts")).adverts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load adverts.");
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  function edit(a: Advert) {
    setFormError("");
    setForm({
      id: a.id,
      name: a.name,
      placement: a.placement,
      image: a.imageUrl ? { url: a.imageUrl, publicId: a.imagePublicId } : null,
      linkUrl: a.linkUrl,
      alt: a.alt,
      startDate: a.startDate || "",
      endDate: a.endDate || "",
      active: a.active,
    });
  }

  async function save() {
    if (!form) return;
    setFormError("");
    setSaving(true);
    try {
      const body = {
        name: form.name,
        placement: form.placement,
        imageUrl: form.image?.url || "",
        imagePublicId: form.image?.publicId || "",
        linkUrl: form.linkUrl,
        alt: form.alt,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        active: form.active,
      };
      if (form.id) await api(`/api/admin/adverts/${form.id}`, { method: "PUT", body });
      else await api("/api/admin/adverts", { method: "POST", body });
      toast.ok(form.id ? "Advert updated." : "Advert created.");
      setForm(null);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!toDelete) return;
    try {
      await api(`/api/admin/adverts/${toDelete.id}`, { method: "DELETE" });
      toast.ok("Advert deleted.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not delete.");
    }
  }

  async function toggle(a: Advert) {
    try {
      await api(`/api/admin/adverts/${a.id}`, {
        method: "PUT",
        body: {
          name: a.name,
          placement: a.placement,
          imageUrl: a.imageUrl,
          imagePublicId: a.imagePublicId || "",
          linkUrl: a.linkUrl,
          alt: a.alt,
          startDate: a.startDate,
          endDate: a.endDate,
          active: !a.active,
        },
      });
      await load();
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not update.");
    }
  }

  const placement = AD_PLACEMENTS.find((p) => p.value === form?.placement);

  return (
    <>
      <PageHeader
        title="Adverts"
        subtitle="Upload banners, choose where they appear, set dates, and track impressions and clicks."
        actions={
          <Button
            variant="red"
            onClick={() => {
              setFormError("");
              setForm({ ...blank });
            }}
          >
            <i className="ti ti-plus" aria-hidden="true" /> New advert
          </Button>
        }
      />
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {!ads && !error && <Spinner label="Loading adverts…" />}

      {ads && ads.length === 0 && (
        <Card>
          <EmptyState
            icon="ti-ad-2"
            title="No adverts yet"
            text="Create your first advert. It goes live as soon as you save, within the dates you set."
            action={
              <Button variant="red" onClick={() => setForm({ ...blank })}>
                New advert
              </Button>
            }
          />
        </Card>
      )}

      {ads && ads.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {ads.map((a) => {
            const st = statusOf(a);
            const ctr = a.impressions ? (a.clicks / a.impressions) * 100 : 0;
            return (
              <Card key={a.id} padded={false}>
                <div className="flex h-36 items-center justify-center overflow-hidden rounded-t-lg bg-surface">
                  {a.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={optimizeImageUrl(a.imageUrl, 700)}
                      alt={a.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[15px] font-bold">{a.name}</div>
                      <div className="text-[12px] text-mid">
                        {AD_PLACEMENTS.find((p) => p.value === a.placement)?.label}
                      </div>
                    </div>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 border-y border-border2 py-3 text-center">
                    <Metric label="Impressions" value={fmtNum(a.impressions)} />
                    <Metric label="Clicks" value={fmtNum(a.clicks)} />
                    <Metric label="CTR" value={`${ctr.toFixed(2)}%`} />
                  </div>
                  <div className="mt-2 text-[12px] text-mid">
                    {a.startDate || "Now"} → {a.endDate || "No end date"}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => edit(a)}>
                      <i className="ti ti-pencil" aria-hidden="true" /> Edit
                    </Button>
                    <Button size="sm" onClick={() => void toggle(a)}>
                      {a.active ? "Pause" : "Resume"}
                    </Button>
                    <Button size="sm" variant="danger" className="ml-auto" onClick={() => setToDelete(a)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!form} title={form?.id ? "Edit advert" : "New advert"} onClose={() => setForm(null)} wide>
        {form && (
          <div className="space-y-5">
            {formError && <ErrorBanner>{formError}</ErrorBanner>}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" hint="Only you see this.">
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Safaricom December campaign"
                />
              </Field>
              <Field label="Placement" hint={placement ? `${placement.size} — ${placement.help}` : undefined}>
                <select
                  className={inputClass}
                  value={form.placement}
                  onChange={(e) => setForm({ ...form, placement: e.target.value as AdPlacement })}
                >
                  {AD_PLACEMENTS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label} ({p.size})
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div>
              <span className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-mid">
                Banner image
              </span>
              <ImageField
                value={form.image}
                onChange={(image) => setForm({ ...form, image })}
                folder="trendspot/adverts"
                aspectClass={form.placement === "home-top" ? "aspect-[970/160]" : "aspect-[300/250]"}
                label="Upload banner"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Link (where a click goes)" hint="Optional. Must start with https://">
                <input
                  className={inputClass}
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="https://advertiser.com/offer"
                />
              </Field>
              <Field label="Alt text" hint="Describe the banner for screen readers.">
                <input
                  className={inputClass}
                  value={form.alt}
                  onChange={(e) => setForm({ ...form, alt: e.target.value })}
                />
              </Field>
              <Field label="Start date" hint="Leave empty to start now.">
                <input
                  type="date"
                  className={inputClass}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="End date" hint="Leave empty to run until paused.">
                <input
                  type="date"
                  className={inputClass}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
            </div>

            <Toggle
              checked={form.active}
              onChange={(active) => setForm({ ...form, active })}
              label="Active"
              hint="Switch off to pause without deleting."
            />

            <div className="flex justify-end gap-2 border-t border-border2 pt-5">
              <Button onClick={() => setForm(null)}>Cancel</Button>
              <Button variant="red" disabled={saving} onClick={() => void save()}>
                {saving ? "Saving…" : form.id ? "Save changes" : "Create advert"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!toDelete} title="Delete this advert?" onClose={() => setToDelete(null)}>
        <p className="text-[14px] text-gray">
          “{toDelete?.name}” and its statistics will be removed permanently.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="red" onClick={() => void remove()}>
            Delete advert
          </Button>
        </div>
      </Modal>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-bask)] text-[19px] font-bold leading-none">{value}</div>
      <div className="mt-1 text-[10.5px] uppercase tracking-wider text-mid">{label}</div>
    </div>
  );
}
