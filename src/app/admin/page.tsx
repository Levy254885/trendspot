"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AuthProvider";
import { AreaChart, BarList } from "@/components/admin/charts";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Spinner,
  StatCard,
  fmtCompact,
  fmtDate,
  fmtNum,
} from "@/components/admin/ui";
import { AD_PLACEMENTS } from "@/lib/constants";

type Slim = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  views: number;
  author: string;
  publishedAt: string | null;
  updatedAt: string;
  image: string;
  periodViews?: number;
};

type Stats = {
  role: string;
  counts: { total: number; published: number; scheduled: number; drafts: number };
  totalViews: number;
  daily: { date: string; views: number }[];
  topAllTime: Slim[];
  top30: Slim[];
  byCategory: { category: string; views: number }[];
  recent: Slim[];
  adverts:
    | {
        id: string;
        name: string;
        placement: string;
        active: boolean;
        impressions: number;
        clicks: number;
        ctr: number;
      }[]
    | null;
  audience: { subscribers: number; newSubscribers30: number; unreadMessages: number } | null;
};

const RANGES = [7, 30, 90] as const;

function sum(a: { views: number }[]) {
  return a.reduce((s, d) => s + d.views, 0);
}

export default function DashboardPage() {
  const { api, me } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const [topTab, setTopTab] = useState<"period" | "all">("period");

  const load = useCallback(async () => {
    setError("");
    try {
      setStats(await api<Stats>("/api/admin/stats"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the dashboard.");
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  const view = useMemo(() => {
    if (!stats) return null;
    const cur = stats.daily.slice(-range);
    const prev = stats.daily.slice(-range * 2, -range);
    const curTotal = sum(cur);
    const prevTotal = sum(prev);
    const delta =
      prev.length === range && prevTotal > 0
        ? ((curTotal - prevTotal) / prevTotal) * 100
        : null;
    const today = stats.daily[stats.daily.length - 1]?.views ?? 0;
    return {
      cur,
      curTotal,
      delta,
      avg: curTotal / range,
      today,
      peak: cur.reduce((m, d) => (d.views > m.views ? d : m), cur[0] || { date: "", views: 0 }),
    };
  }, [stats, range]);

  const greeting = me?.name ? `Welcome back, ${me.name.split(" ")[0]}` : "Dashboard";

  if (error) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <ErrorBanner>{error}</ErrorBanner>
        <Button onClick={() => void load()}>Try again</Button>
      </>
    );
  }
  if (!stats || !view) return <Spinner label="Loading performance…" />;

  const isAuthor = stats.role === "author";
  const noArticles = stats.counts.total === 0;
  const topList = topTab === "period" ? stats.top30 : stats.topAllTime;
  const adTotals = (stats.adverts || []).reduce(
    (t, a) => ({ i: t.i + a.impressions, c: t.c + a.clicks }),
    { i: 0, c: 0 }
  );

  return (
    <>
      <PageHeader
        title={greeting}
        subtitle={
          isAuthor
            ? "Here's how your stories are doing."
            : "Here's how the newsroom and the site are performing."
        }
        actions={
          <>
            <Button onClick={() => void load()}>
              <i className="ti ti-refresh" aria-hidden="true" /> Refresh
            </Button>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-red px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-red-hover"
            >
              <i className="ti ti-plus" aria-hidden="true" /> New article
            </Link>
          </>
        }
      />

      {noArticles && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border2 bg-white p-5">
          <div>
            <div className="font-[family-name:var(--font-bask)] text-[17px] font-bold">
              Your newsroom is empty
            </div>
            <p className="mt-1 text-[13.5px] text-mid">
              Write your first article, or import the sample stories to see the site filled out.
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-semibold hover:border-ink"
          >
            Import sample content
          </Link>
        </div>
      )}

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label={`Views · ${range} days`}
          value={fmtCompact(view.curTotal)}
          delta={view.delta}
          sub={view.delta === null ? "no earlier data" : `vs previous ${range}`}
          icon="ti-eye"
        />
        <StatCard
          label="Views today"
          value={fmtNum(view.today)}
          sub={`${fmtNum(view.avg)} / day average`}
          icon="ti-bolt"
        />
        <StatCard
          label="All-time views"
          value={fmtCompact(stats.totalViews)}
          sub={`${fmtNum(stats.counts.published)} published`}
          icon="ti-chart-line"
        />
        <StatCard
          label="Articles"
          value={fmtNum(stats.counts.total)}
          sub={`${stats.counts.scheduled} scheduled · ${stats.counts.drafts} drafts`}
          icon="ti-news"
        />
      </div>

      {/* Traffic */}
      <Card
        title="Traffic"
        className="mb-6"
        action={
          <div className="flex gap-1" role="tablist" aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={range === r}
                onClick={() => setRange(r)}
                className={`rounded-md px-3 py-1 text-[12px] font-semibold ${
                  range === r ? "bg-black text-white" : "text-mid hover:bg-surface"
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
        }
      >
        <AreaChart
          data={view.cur.map((d) => ({ date: d.date, value: d.views }))}
          seriesLabel="Page views"
        />
        {view.peak.views > 0 && (
          <p className="mt-3 text-[12.5px] text-mid">
            Best day: <strong className="text-ink">{fmtDate(view.peak.date + "T12:00:00+03:00")}</strong>{" "}
            with {fmtNum(view.peak.views)} views.
          </p>
        )}
      </Card>

      <div className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title="Top articles"
          padded={false}
          action={
            <div className="flex gap-1">
              {(
                [
                  ["period", "30 days"],
                  ["all", "All time"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setTopTab(k)}
                  className={`rounded-md px-3 py-1 text-[12px] font-semibold ${
                    topTab === k ? "bg-black text-white" : "text-mid hover:bg-surface"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          }
        >
          {topList.length === 0 ? (
            <EmptyState
              icon="ti-chart-bar"
              title="No views yet"
              text="Views appear here as readers open your stories."
            />
          ) : (
            <ol>
              {topList.map((a, i) => (
                <li key={a.id} className="flex items-center gap-4 border-b border-border2 px-5 py-3 last:border-0">
                  <span className="w-5 text-center font-[family-name:var(--font-bask)] text-[16px] font-bold text-pale">
                    {i + 1}
                  </span>
                  <Link href={`/admin/articles/${a.id}/edit`} className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-[14px] font-semibold text-ink hover:text-red">
                      {a.title}
                    </div>
                    <div className="text-[12px] text-mid">
                      {a.category} · {a.author}
                    </div>
                  </Link>
                  <span className="text-[13.5px] font-bold tabular-nums">
                    {fmtNum(topTab === "period" ? a.periodViews ?? 0 : a.views)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card title="Views by category">
          {stats.byCategory.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-mid">No category data yet.</p>
          ) : (
            <BarList
              unit="views"
              items={stats.byCategory.map((c) => ({ label: c.category, value: c.views }))}
            />
          )}
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card title="Recently updated" padded={false}>
          {stats.recent.length === 0 ? (
            <EmptyState icon="ti-news" title="Nothing yet" />
          ) : (
            <ul>
              {stats.recent.map((a) => (
                <li key={a.id} className="flex items-center gap-3 border-b border-border2 px-5 py-3 last:border-0">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="line-clamp-1 text-[14px] font-semibold hover:text-red"
                    >
                      {a.title}
                    </Link>
                    <div className="text-[12px] text-mid">{fmtDate(a.updatedAt)}</div>
                  </div>
                  <Badge tone={a.status === "published" ? "green" : "amber"}>{a.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {!isAuthor && stats.audience && (
          <Card title="Audience">
            <div className="grid grid-cols-3 gap-4">
              <Mini label="Subscribers" value={fmtNum(stats.audience.subscribers)} />
              <Mini label="New · 30 days" value={fmtNum(stats.audience.newSubscribers30)} />
              <Mini label="Unread messages" value={fmtNum(stats.audience.unreadMessages)} />
            </div>
            <Link
              href="/admin/audience"
              className="mt-5 inline-block text-[13px] font-semibold text-red hover:underline"
            >
              Manage audience →
            </Link>
          </Card>
        )}
      </div>

      {stats.adverts && (
        <Card
          title="Advert performance"
          padded={false}
          action={
            <Link href="/admin/adverts" className="text-[12.5px] font-semibold text-red hover:underline">
              Manage adverts
            </Link>
          }
        >
          {stats.adverts.length === 0 ? (
            <EmptyState
              icon="ti-ad-2"
              title="No adverts yet"
              text="Upload a banner and choose where it appears on the site."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-border2 text-[10.5px] uppercase tracking-[0.12em] text-mid">
                    <th className="px-5 py-3 font-extrabold">Advert</th>
                    <th className="px-3 py-3 font-extrabold">Placement</th>
                    <th className="px-3 py-3 text-right font-extrabold">Impressions</th>
                    <th className="px-3 py-3 text-right font-extrabold">Clicks</th>
                    <th className="px-5 py-3 text-right font-extrabold">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.adverts.map((a) => (
                    <tr key={a.id} className="border-b border-border2 last:border-0">
                      <td className="px-5 py-3 font-semibold">
                        {a.name} {!a.active && <Badge>paused</Badge>}
                      </td>
                      <td className="px-3 py-3 text-mid">
                        {AD_PLACEMENTS.find((p) => p.value === a.placement)?.label ?? a.placement}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{fmtNum(a.impressions)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{fmtNum(a.clicks)}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">
                        {a.ctr.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-surface text-[13px] font-bold">
                    <td className="px-5 py-3" colSpan={2}>
                      Total
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtNum(adTotals.i)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmtNum(adTotals.c)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {adTotals.i ? ((adTotals.c / adTotals.i) * 100).toFixed(2) : "0.00"}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-bask)] text-[26px] font-bold leading-none">
        {value}
      </div>
      <div className="mt-1.5 text-[11.5px] text-mid">{label}</div>
    </div>
  );
}
