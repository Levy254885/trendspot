import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-black text-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/admin" className="font-[family-name:var(--font-bask)] text-lg font-bold">
            TrendSpot <span className="text-red">Admin</span>
          </Link>
          <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-white/70">
            <Link href="/admin/articles" className="hover:text-white">
              Articles
            </Link>
            <Link href="/admin/media" className="hover:text-white">
              Media
            </Link>
            <Link href="/" className="hover:text-white">
              View site
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
