"use client";

import { useState } from "react";
import { fmtCompact, fmtNum } from "@/components/admin/ui";

/** Round a maximum up to a friendly axis value (1, 2, 5 × 10ⁿ). */
function niceMax(v: number): number {
  if (v <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function shortDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * Single-series area chart. HTML axis labels (so text stays readable on small
 * screens), an SVG plot with 2px non-scaling line, hover crosshair + tooltip,
 * and a "table" view for accessibility.
 */
export function AreaChart({
  data,
  seriesLabel = "Views",
  height = 230,
}: {
  data: { date: string; value: number }[];
  seriesLabel?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);

  const n = data.length;
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const x = (i: number) => (n <= 1 ? 50 : (i / (n - 1)) * 100);
  const y = (v: number) => 100 - (v / max) * 100;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const area = n ? `${line} L${x(n - 1)},100 L${x(0)},100 Z` : "";

  const total = data.reduce((s, d) => s + d.value, 0);

  function pick(clientX: number, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setHover(Math.round(pct * (n - 1)));
  }

  const active = hover !== null ? data[hover] : null;
  const leftPct = hover !== null ? x(hover) : 0;

  if (table) {
    return (
      <div>
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setTable(false)}
            className="text-[12px] font-semibold text-mid hover:text-ink"
          >
            ← Back to chart
          </button>
        </div>
        <div className="max-h-[260px] overflow-auto rounded-md border border-border2">
          <table className="w-full text-left text-[13px]">
            <thead className="sticky top-0 bg-surface text-[10.5px] font-extrabold uppercase tracking-wider text-mid">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2 text-right">{seriesLabel}</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.date} className="border-t border-border2">
                  <td className="px-3 py-1.5">{shortDate(d.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmtNum(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[12px] text-mid">
        <span>
          <strong className="font-semibold text-ink">{fmtNum(total)}</strong> {seriesLabel.toLowerCase()} in
          this period
        </span>
        <button
          type="button"
          onClick={() => setTable(true)}
          className="font-semibold hover:text-ink"
        >
          View as table
        </button>
      </div>

      <div className="relative pl-11 pr-1">
        {/* y-axis labels */}
        {[0, 0.5, 1].map((f) => (
          <span
            key={f}
            className="absolute left-0 -translate-y-1/2 text-[11px] tabular-nums text-pale"
            style={{ top: `${(1 - f) * height}px` }}
          >
            {fmtCompact(max * f)}
          </span>
        ))}

        <div
          className="relative touch-pan-y"
          style={{ height }}
          onMouseMove={(e) => pick(e.clientX, e.currentTarget)}
          onMouseLeave={() => setHover(null)}
          onTouchMove={(e) => pick(e.touches[0].clientX, e.currentTarget)}
          onTouchEnd={() => setHover(null)}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            role="img"
            aria-label={`${seriesLabel} over time`}
          >
            {[0, 50, 100].map((g) => (
              <line
                key={g}
                x1="0"
                x2="100"
                y1={g}
                y2={g}
                stroke="#e5e5e5"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {area && <path d={area} fill="rgba(204,0,0,0.08)" />}
            {line && (
              <path
                d={line}
                fill="none"
                stroke="#cc0000"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          {active && (
            <>
              <div
                className="pointer-events-none absolute top-0 h-full w-px bg-ink/30"
                style={{ left: `${leftPct}%` }}
              />
              <div
                className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red"
                style={{ left: `${leftPct}%`, top: `${y(active.value)}%` }}
              />
              <div
                className="pointer-events-none absolute z-10 rounded-md bg-black px-3 py-2 text-[12px] text-white shadow-lg"
                style={{
                  left: `${leftPct}%`,
                  top: 0,
                  transform:
                    leftPct < 15
                      ? "translateX(0)"
                      : leftPct > 85
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                }}
              >
                <div className="text-white/60">{shortDate(active.date)}</div>
                <div className="font-semibold tabular-nums">
                  {fmtNum(active.value)} {seriesLabel.toLowerCase()}
                </div>
              </div>
            </>
          )}
        </div>

        {/* x-axis labels */}
        {n > 0 && (
          <div className="mt-2 flex justify-between text-[11px] text-pale">
            <span>{shortDate(data[0].date)}</span>
            {n > 6 && <span>{shortDate(data[Math.floor((n - 1) / 2)].date)}</span>}
            <span>{shortDate(data[n - 1].date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Horizontal bars for ranked comparisons (single colour — length carries the value). */
export function BarList({
  items,
  unit = "views",
}: {
  items: { label: string; value: number; sub?: string }[];
  unit?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (!items.length) {
    return <p className="py-6 text-center text-[13px] text-mid">No data yet.</p>;
  }
  return (
    <ul className="space-y-3.5">
      {items.map((it) => (
        <li key={it.label} title={`${it.label}: ${fmtNum(it.value)} ${unit}`}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
            <span className="min-w-0 truncate font-medium text-ink">{it.label}</span>
            <span className="shrink-0 tabular-nums text-mid">{fmtNum(it.value)}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface">
            <div
              className="h-1.5 rounded-full bg-red"
              style={{ width: `${Math.max(2, (it.value / max) * 100)}%` }}
            />
          </div>
          {it.sub && <div className="mt-1 text-[11.5px] text-pale">{it.sub}</div>}
        </li>
      ))}
    </ul>
  );
}
