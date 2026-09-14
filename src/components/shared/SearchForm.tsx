"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-0" role="search">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search articles, categories, authors..."
        className="w-full border border-border border-r-0 px-4 py-2.5 text-sm outline-none focus:border-ink"
        aria-label="Search query"
      />
      <button
        type="submit"
        className="bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red"
      >
        Search
      </button>
    </form>
  );
}
