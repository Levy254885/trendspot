"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AuthProvider, useAdmin } from "@/components/admin/AuthProvider";
import { Button, ToastProvider } from "@/components/admin/ui";
import { EXTRA_FONTS_URL } from "@/lib/editor-fonts";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const NAV: {
  href: string;
  label: string;
  icon: string;
  roles: Role[];
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Dashboard", icon: "ti-layout-dashboard", roles: ["admin", "editor", "author"], exact: true },
  { href: "/admin/articles", label: "Articles", icon: "ti-news", roles: ["admin", "editor", "author"] },
  { href: "/admin/adverts", label: "Adverts", icon: "ti-ad-2", roles: ["admin", "editor"] },
  { href: "/admin/media", label: "Media library", icon: "ti-photo", roles: ["admin", "editor", "author"] },
  { href: "/admin/audience", label: "Audience", icon: "ti-mail", roles: ["admin", "editor"] },
  { href: "/admin/team", label: "Team", icon: "ti-users", roles: ["admin"] },
  { href: "/admin/settings", label: "Settings", icon: "ti-settings", roles: ["admin", "editor", "author"] },
];

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  editor: "Editor",
  author: "Author",
};

function FullScreen({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f5f3] px-6">
      {children}
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { configured, loading, user, me, accessError, signOut } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (configured && !loading && !user && !isLogin) router.replace("/admin/login");
  }, [configured, loading, user, isLogin, router]);

  if (isLogin) return <>{children}</>;

  if (!configured) {
    return (
      <FullScreen>
        <div className="max-w-lg rounded-xl border border-border2 bg-white p-8 shadow-sm">
          <h1 className="mb-2 font-[family-name:var(--font-bask)] text-[22px] font-bold">
            Firebase isn&apos;t connected yet
          </h1>
          <p className="text-[14px] leading-relaxed text-gray">
            Add the <code className="rounded bg-surface px-1">NEXT_PUBLIC_FIREBASE_*</code>{" "}
            variables to your hosting environment (Vercel → Settings → Environment
            Variables), then redeploy. The full list is in <code className="rounded bg-surface px-1">.env.example</code>.
          </p>
        </div>
      </FullScreen>
    );
  }

  if (loading || !user) {
    return (
      <FullScreen>
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-red" />
      </FullScreen>
    );
  }

  if (!me) {
    return (
      <FullScreen>
        <div className="max-w-md rounded-xl border border-border2 bg-white p-8 text-center shadow-sm">
          <i className="ti ti-lock mb-3 block text-[34px] text-red" aria-hidden="true" />
          <h1 className="mb-2 font-[family-name:var(--font-bask)] text-[22px] font-bold">
            No access
          </h1>
          <p className="mb-6 text-[14px] leading-relaxed text-gray">
            {accessError || "This account can't open the admin area."}
          </p>
          <Button variant="primary" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </FullScreen>
    );
  }

  const items = NAV.filter((n) => n.roles.includes(me.role));
  const isActive = (n: (typeof NAV)[number]) =>
    n.exact ? pathname === n.href : pathname.startsWith(n.href);

  return (
    <div className="min-h-screen bg-[#f5f5f3] text-ink lg:pl-[248px]">
      <link rel="stylesheet" href={EXTRA_FONTS_URL} />

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-black px-4 text-white lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="-ml-2 grid h-10 w-10 place-items-center"
        >
          <i className="ti ti-menu-2 text-[22px]" aria-hidden="true" />
        </button>
        <span className="font-[family-name:var(--font-bask)] text-[17px] font-bold">
          TrendSpot <span className="text-red">Admin</span>
        </span>
        <Link href="/" target="_blank" aria-label="View site" className="-mr-2 grid h-10 w-10 place-items-center">
          <i className="ti ti-external-link text-[20px]" aria-hidden="true" />
        </Link>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-black text-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-6 pb-6 pt-7">
          <Link href="/admin" className="block font-[family-name:var(--font-bask)] text-[22px] font-bold leading-none">
            TrendSpot
            <span className="ml-0.5 align-super text-[11px] font-semibold text-red">.co.ke</span>
          </Link>
          <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
            Content management
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Admin">
          {items.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                isActive(n)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive(n) && (
                <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r bg-red" />
              )}
              <i className={`ti ${n.icon} text-[18px]`} aria-hidden="true" />
              {n.label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="mt-4 flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <i className="ti ti-external-link text-[18px]" aria-hidden="true" />
            View live site
          </Link>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red text-[14px] font-bold uppercase">
              {me.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">{me.name}</div>
              <div className="truncate text-[11.5px] text-white/45">{ROLE_LABEL[me.role]}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-white/15 py-2 text-[12.5px] font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <i className="ti ti-logout" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="mx-auto max-w-[1240px] px-4 py-7 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Shell>{children}</Shell>
      </ToastProvider>
    </AuthProvider>
  );
}
