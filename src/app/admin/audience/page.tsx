"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AuthProvider";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Spinner,
  fmtDateTime,
  inputClass,
  useToast,
} from "@/components/admin/ui";

type Sub = { id: string; email: string; subscribedAt: string; source: string };
type Msg = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AudiencePage() {
  const { api } = useAdmin();
  const toast = useToast();
  const [tab, setTab] = useState<"subs" | "msgs">("subs");
  const [subs, setSubs] = useState<Sub[] | null>(null);
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const [s, m] = await Promise.all([
        api<{ subscribers: Sub[] }>("/api/admin/subscribers"),
        api<{ messages: Msg[] }>("/api/admin/messages"),
      ]);
      setSubs(s.subscribers);
      setMsgs(m.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load audience data.");
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredSubs = useMemo(() => {
    const n = q.trim().toLowerCase();
    return (subs || []).filter((s) => !n || s.email.toLowerCase().includes(n));
  }, [subs, q]);

  const unread = (msgs || []).filter((m) => !m.read).length;

  function exportCsv() {
    const rows = [["email", "subscribed_at", "source"], ...(subs || []).map((s) => [s.email, s.subscribedAt, s.source])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `trendspot-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function delSub(s: Sub) {
    if (!confirm(`Remove ${s.email} from the list?`)) return;
    try {
      await api(`/api/admin/subscribers?id=${encodeURIComponent(s.id)}`, { method: "DELETE" });
      setSubs((c) => (c || []).filter((x) => x.id !== s.id));
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not remove.");
    }
  }

  async function mark(m: Msg, read: boolean) {
    try {
      await api("/api/admin/messages", { method: "PATCH", body: { id: m.id, read } });
      setMsgs((c) => (c || []).map((x) => (x.id === m.id ? { ...x, read } : x)));
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not update.");
    }
  }

  async function delMsg(m: Msg) {
    if (!confirm("Delete this message?")) return;
    try {
      await api(`/api/admin/messages?id=${encodeURIComponent(m.id)}`, { method: "DELETE" });
      setMsgs((c) => (c || []).filter((x) => x.id !== m.id));
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not delete.");
    }
  }

  return (
    <>
      <PageHeader title="Audience" subtitle="Newsletter subscribers and messages from readers." />
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {!subs && !error && <Spinner label="Loading…" />}

      {subs && msgs && (
        <Card padded={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-border2 px-5 py-3.5">
            <div className="flex gap-1" role="tablist">
              <button
                role="tab"
                aria-selected={tab === "subs"}
                onClick={() => setTab("subs")}
                className={`rounded-md px-3 py-1.5 text-[12.5px] font-semibold ${tab === "subs" ? "bg-black text-white" : "text-mid hover:bg-surface"}`}
              >
                Subscribers <span className="opacity-60">{subs.length}</span>
              </button>
              <button
                role="tab"
                aria-selected={tab === "msgs"}
                onClick={() => setTab("msgs")}
                className={`rounded-md px-3 py-1.5 text-[12.5px] font-semibold ${tab === "msgs" ? "bg-black text-white" : "text-mid hover:bg-surface"}`}
              >
                Messages{" "}
                {unread > 0 && <span className="ml-1 rounded-full bg-red px-1.5 text-[10px] text-white">{unread}</span>}
              </button>
            </div>
            {tab === "subs" && (
              <div className="ml-auto flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search email…"
                  aria-label="Search subscribers"
                  className={`${inputClass} !w-52 !py-2 !text-[13px]`}
                />
                <Button size="sm" onClick={exportCsv} disabled={!subs.length}>
                  <i className="ti ti-download" aria-hidden="true" /> Export CSV
                </Button>
              </div>
            )}
          </div>

          {tab === "subs" &&
            (filteredSubs.length === 0 ? (
              <EmptyState icon="ti-mail" title="No subscribers" text="Sign-ups from the website appear here." />
            ) : (
              <ul>
                {filteredSubs.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 border-b border-border2 px-5 py-3 last:border-0">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold">{s.email}</div>
                      <div className="text-[12px] text-mid">{fmtDateTime(s.subscribedAt)}</div>
                    </div>
                    <button
                      onClick={() => void delSub(s)}
                      aria-label={`Remove ${s.email}`}
                      className="grid h-8 w-8 place-items-center rounded-md text-mid hover:bg-[#fff5f5] hover:text-red"
                    >
                      <i className="ti ti-trash" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ))}

          {tab === "msgs" &&
            (msgs.length === 0 ? (
              <EmptyState icon="ti-message" title="No messages" text="Messages from the contact form appear here." />
            ) : (
              <ul>
                {msgs.map((m) => {
                  const isOpen = open === m.id;
                  return (
                    <li key={m.id} className="border-b border-border2 last:border-0">
                      <button
                        onClick={() => {
                          setOpen(isOpen ? null : m.id);
                          if (!m.read) void mark(m, true);
                        }}
                        className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-[#fafaf8]"
                      >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-red"}`} />
                        <div className="min-w-0 flex-1">
                          <div className={`truncate text-[14px] ${m.read ? "" : "font-bold"}`}>
                            {m.subject || "(no subject)"}
                          </div>
                          <div className="truncate text-[12px] text-mid">
                            {m.name} · {m.email}
                          </div>
                        </div>
                        <span className="hidden text-[12px] text-mid sm:block">{fmtDateTime(m.createdAt)}</span>
                        <i className={`ti ${isOpen ? "ti-chevron-up" : "ti-chevron-down"} text-mid`} aria-hidden="true" />
                      </button>
                      {isOpen && (
                        <div className="bg-[#fafaf8] px-5 pb-5 pl-10">
                          <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{m.message}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <a
                              href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`}
                              className="inline-flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-[12px] font-semibold text-white"
                            >
                              <i className="ti ti-mail-forward" aria-hidden="true" /> Reply
                            </a>
                            <Button size="sm" onClick={() => void mark(m, false)}>
                              Mark unread
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => void delMsg(m)}>
                              Delete
                            </Button>
                            {m.read && <Badge tone="gray">read</Badge>}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ))}
        </Card>
      )}
    </>
  );
}
