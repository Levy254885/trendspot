"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ───────────── Layout pieces ───────────── */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-[family-name:var(--font-bask)] text-[26px] font-bold leading-tight text-black">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-[13.5px] text-mid">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className,
  padded = true,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border2 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-border2 px-5 py-3.5">
          {title && (
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  sub,
  delta,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: number | null;
  icon?: string;
}) {
  return (
    <div className="rounded-lg border border-border2 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-mid">
          {label}
        </span>
        {icon && <i className={`ti ${icon} text-[18px] text-pale`} aria-hidden="true" />}
      </div>
      <div className="font-[family-name:var(--font-bask)] text-[30px] font-bold leading-none text-black">
        {value}
      </div>
      <div className="mt-2.5 flex items-center gap-2 text-[12px] text-mid">
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold",
              delta > 0 ? "text-[#15803d]" : delta < 0 ? "text-red" : "text-mid"
            )}
          >
            <i
              className={`ti ${delta >= 0 ? "ti-arrow-up-right" : "ti-arrow-down-right"}`}
              aria-hidden="true"
            />
            {Math.abs(delta).toFixed(0)}%
          </span>
        )}
        {sub && <span>{sub}</span>}
      </div>
    </div>
  );
}

/* ───────────── Controls ───────────── */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "red";
  size?: "sm" | "md";
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  ...rest
}: BtnProps) {
  const variants = {
    primary: "bg-black text-white hover:bg-[#222] border-black",
    red: "bg-red text-white hover:bg-red-hover border-red",
    secondary: "bg-white text-ink border-border hover:border-ink",
    danger: "bg-white text-red border-border hover:border-red hover:bg-[#fff5f5]",
    ghost: "bg-transparent text-gray border-transparent hover:bg-surface",
  };
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2.5 text-[13px]",
        variants[variant],
        className
      )}
      {...rest}
    />
  );
}

export const inputClass =
  "w-full rounded-md border border-border bg-white px-3 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-pale focus:border-ink focus:ring-2 focus:ring-black/5";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-mid">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-pale">{hint}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-red" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </button>
      <span>
        <span className="block text-[13.5px] font-semibold text-ink">{label}</span>
        {hint && <span className="block text-[12px] text-mid">{hint}</span>}
      </span>
    </label>
  );
}

/* ───────────── Feedback ───────────── */

const TONES = {
  green: "bg-[#e8f5ec] text-[#15803d]",
  red: "bg-[#fdeaea] text-red",
  amber: "bg-[#fdf3dc] text-[#a16207]",
  gray: "bg-surface text-gray",
  black: "bg-black text-white",
  blue: "bg-[#e8f0fb] text-[#1d4ed8]",
};

export function Badge({
  tone = "gray",
  children,
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider",
        TONES[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-[13px] text-mid">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-red" />
      {label}
    </div>
  );
}

export function EmptyState({
  icon = "ti-inbox",
  title,
  text,
  action,
}: {
  icon?: string;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <i className={`ti ${icon} mb-3 block text-[34px] text-border`} aria-hidden="true" />
      <div className="font-[family-name:var(--font-bask)] text-[17px] font-bold text-ink">
        {title}
      </div>
      {text && <p className="mx-auto mt-1.5 max-w-md text-[13.5px] text-mid">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-2.5 rounded-md border border-[#f3c4c4] bg-[#fff5f5] px-4 py-3 text-[13.5px] text-red"
    >
      <i className="ti ti-alert-triangle mt-0.5" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "w-full rounded-xl bg-white shadow-2xl",
          wide ? "max-w-3xl" : "max-w-xl"
        )}
      >
        <div className="flex items-center justify-between border-b border-border2 px-6 py-4">
          <h2 className="font-[family-name:var(--font-bask)] text-[19px] font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-mid hover:bg-surface hover:text-ink"
          >
            <i className="ti ti-x text-[18px]" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ───────────── Toasts ───────────── */

type Toast = { id: number; kind: "ok" | "err"; text: string };
type ToastApi = { ok: (t: string) => void; err: (t: string) => void };
const ToastCtx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setItems((cur) => [...cur, { id, kind, text }]);
    setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), 4500);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({ ok: (t) => push("ok", t), err: (t) => push("err", t) }),
    [push]
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-lg px-4 py-3 text-[13.5px] font-medium text-white shadow-lg",
              t.kind === "ok" ? "bg-black" : "bg-red"
            )}
          >
            <i
              className={`ti ${t.kind === "ok" ? "ti-circle-check" : "ti-alert-circle"} mt-0.5`}
              aria-hidden="true"
            />
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────────── Formatting helpers ───────────── */

export function fmtNum(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1)}K`;
  return String(Math.round(n));
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Nairobi",
  });
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  });
}
