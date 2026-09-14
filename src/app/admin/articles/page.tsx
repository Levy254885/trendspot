import Link from "next/link";
import { fetchPublishedArticles } from "@/services/articles";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await fetchPublishedArticles();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-bask)] text-2xl font-bold">
          Articles
        </h1>
        <Link
          href="/admin/articles/new"
          className="bg-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red"
        >
          New article
        </Link>
      </div>

      <div className="overflow-x-auto border border-border bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-[10px] font-extrabold uppercase tracking-widest text-mid">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-border2 last:border-0">
                <td className="max-w-[280px] px-4 py-3">
                  <div className="truncate font-semibold text-ink">{a.title}</div>
                  <div className="text-xs text-pale">By {a.author}</div>
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-wider text-red">
                  {a.category}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold uppercase text-ink">{a.status}</span>
                  {a.featured && <span className="ml-1 text-[10px] text-mid">· Featured</span>}
                  {a.breaking && <span className="ml-1 text-[10px] text-red">· Breaking</span>}
                </td>
                <td className="px-4 py-3 text-xs text-mid">{formatDateShort(a.publishedAt)}</td>
                <td className="px-4 py-3 text-xs text-mid">{a.views}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="text-xs font-semibold uppercase tracking-wider text-mid hover:text-red"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
