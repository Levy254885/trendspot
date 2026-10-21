"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AuthProvider";
import {
  Badge,
  Button,
  Card,
  ErrorBanner,
  PageHeader,
  Spinner,
  useToast,
} from "@/components/admin/ui";

type Status = {
  firebaseAdmin: boolean;
  firestore: string;
  articleCount: number;
  clientConfig: boolean;
  cloudinaryCloud: boolean;
  cloudinaryPreset: boolean;
  ownerEmails: number;
  siteUrl: string;
};

export default function SettingsPage() {
  const { api, me, user } = useAdmin();
  const toast = useToast();
  const [s, setS] = useState<Status | null>(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setS(await api<Status>("/api/admin/status"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check the connection.");
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  async function seed() {
    setImporting(true);
    try {
      const r = await api<{ created: number; skipped: number }>("/api/admin/seed", { method: "POST" });
      toast.ok(`Imported ${r.created} articles (${r.skipped} already existed).`);
      await load();
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  }

  const rows: { label: string; ok: boolean; detail: string; fix?: string }[] = s
    ? [
        {
          label: "Firebase sign-in (browser)",
          ok: s.clientConfig,
          detail: s.clientConfig ? "Configured" : "Missing NEXT_PUBLIC_FIREBASE_* variables",
        },
        {
          label: "Firebase admin (server)",
          ok: s.firebaseAdmin,
          detail: s.firebaseAdmin ? "Service account found" : "Missing FIREBASE_SERVICE_ACCOUNT_JSON",
        },
        {
          label: "Firestore database",
          ok: s.firestore === "ok",
          detail: s.firestore === "ok" ? `Connected · ${s.articleCount} articles` : s.firestore,
        },
        {
          label: "Cloudinary cloud name",
          ok: s.cloudinaryCloud,
          detail: s.cloudinaryCloud ? "Configured" : "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
        },
        {
          label: "Cloudinary upload preset",
          ok: s.cloudinaryPreset,
          detail: s.cloudinaryPreset ? "Configured (must be an unsigned preset)" : "Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
        },
        {
          label: "Owner emails",
          ok: s.ownerEmails > 0,
          detail: s.ownerEmails > 0 ? `${s.ownerEmails} set in ADMIN_EMAILS` : "Optional: ADMIN_EMAILS auto-promotes these accounts to admin",
        },
      ]
    : [];

  return (
    <>
      <PageHeader title="Settings" subtitle="Connection status for Firebase and Cloudinary, and your account." />
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {!s && !error && <Spinner label="Checking connections…" />}

      {s && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card title="Connections" padded={false} action={<Button size="sm" onClick={() => void load()}>Re-check</Button>}>
            <ul>
              {rows.map((r) => (
                <li key={r.label} className="flex items-start gap-3 border-b border-border2 px-5 py-3.5 last:border-0">
                  <i
                    className={`ti ${r.ok ? "ti-circle-check text-[#15803d]" : "ti-alert-circle text-red"} mt-0.5 text-[18px]`}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-[14px] font-semibold">{r.label}</div>
                    <div className="text-[12.5px] text-mid">{r.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="px-5 pb-4 text-[12px] text-pale">
              Environment variables are changed in Vercel → Project → Settings → Environment Variables, then redeploy.
            </p>
          </Card>

          <div className="space-y-6">
            <Card title="Your account">
              <div className="text-[14px] font-semibold">{me?.name}</div>
              <div className="text-[12.5px] text-mid">{user?.email}</div>
              <div className="mt-3">
                <Badge tone="black">{me?.role}</Badge>
              </div>
            </Card>

            {me?.role === "admin" && (
              <Card title="Sample content">
                <p className="mb-4 text-[13.5px] text-mid">
                  Copies the demo stories into Firestore so the site isn&apos;t empty. Safe to run more than once.
                </p>
                <Button variant="primary" disabled={importing || s.firestore !== "ok"} onClick={() => void seed()}>
                  {importing ? "Importing…" : "Import sample articles"}
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
}
