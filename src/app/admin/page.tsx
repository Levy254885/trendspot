import Link from "next/link";
import { fetchPublishedArticles, fetchLatest } from "@/services/articles";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [published, latest] = await Promise.all([
    fetchPublishedArticles(),
    fetchLatest(5),
  ]);

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-bask)] text-2xl font-bold text-black">
        Dashboard
      </h1>
      <p className="mb-8 text-sm text-mid">
        Manage content for TrendSpot.co.ke. Configure Firebase to enable full CMS
        authentication and persistence.
      </p>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="border border-border bg-white p-5">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-mid">
            Published
          </div>
          <div className="mt-1 font-[family-name:var(--font-bask)] text-3xl font-bold">
            {published.length}
          </div>
        </div>
        <div className="border border-border bg-white p-5">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-mid">
            Status
          </div>
          <div className="mt-1 text-sm font-semibold text-ink">
            {process.env.NEXT_PUBLIC_USE_FIREBASE === "true"
              ? "Firebase mode"
              : "Seed data mode"}
          </div>
        </div>
        <div className="border border-border bg-white p-5">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-mid">
            Quick actions
          </div>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <Link href="/admin/articles/new" className="font-semibold text-red hover:underline">
              New article
            </Link>
            <Link href="/admin/articles" className="text-ink hover:underline">
              All articles
            </Link>
          </div>
        </div>
      </div>

      <h2 className="mb-3 border-b-2 border-black pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-mid">
        Latest published
      </h2>
      <ul className="divide-y divide-border2 border border-border bg-white">
        {latest.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-red">
                {a.category}
              </div>
              <div className="font-[family-name:var(--font-bask)] text-sm font-bold">
                {a.title}
              </div>
            </div>
            <Link
              href={`/admin/articles/${a.id}/edit`}
              className="shrink-0 text-xs font-semibold uppercase tracking-wider text-mid hover:text-red"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded border border-border2 bg-white p-5 text-sm text-gray">
        <strong className="text-ink">Setup:</strong> Copy{" "}
        <code className="text-xs">.env.example</code> to{" "}
        <code className="text-xs">.env.local</code>, add Firebase and Cloudinary
        credentials, set{" "}
        <code className="text-xs">NEXT_PUBLIC_USE_FIREBASE=true</code>, and deploy
        <code className="text-xs"> firestore.rules</code>. Until then the site runs
        on rich seed content so you can develop and demo the full UI.
      </div>
    </div>
  );
}
