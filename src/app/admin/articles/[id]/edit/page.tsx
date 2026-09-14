import Link from "next/link";
import { fetchPublishedArticles } from "@/services/articles";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const articles = await fetchPublishedArticles();
  const article = articles.find((a) => a.id === id);
  if (!article) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-bask)] text-2xl font-bold">Edit article</h1>
          <p className="text-sm text-mid">{article.title}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/article/${article.slug}`} className="text-xs font-semibold uppercase tracking-wider text-mid hover:text-red">
            View live
          </Link>
          <Link href="/admin/articles" className="text-xs font-semibold uppercase tracking-wider text-mid hover:text-red">
            Back
          </Link>
        </div>
      </div>
      <div className="border border-border bg-white p-6">
        <p className="mb-4 text-sm text-gray">
          Full rich-text editing is available when Firebase is connected. In seed mode, use the create form or update content in <code className="text-xs">src/data/seed.ts</code>.
        </p>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-extrabold uppercase tracking-widest text-mid">Category</dt>
            <dd>{article.category}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-extrabold uppercase tracking-widest text-mid">Status</dt>
            <dd className="capitalize">{article.status}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-extrabold uppercase tracking-widest text-mid">Author</dt>
            <dd>{article.author}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-extrabold uppercase tracking-widest text-mid">Views</dt>
            <dd>{article.views}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[10px] font-extrabold uppercase tracking-widest text-mid">Excerpt</dt>
            <dd className="font-[family-name:var(--font-serif)]">{article.excerpt}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <Link href="/admin/articles/new" className="inline-block bg-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red">
            Create new instead
          </Link>
        </div>
      </div>
    </div>
  );
}
