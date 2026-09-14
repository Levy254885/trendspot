import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { fetchBreakingArticles } from "@/services/articles";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default async function Page() {
  const breaking = await fetchBreakingArticles();
  return (
    <>
      <SiteHeader breaking={breaking} />
      <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
        <h1 className="mb-6 font-[family-name:var(--font-bask)] text-[28px] font-bold">
          Terms of Use
        </h1>
        <div className="article-prose">
          <p>By using TrendSpot.co.ke you agree to these terms. Content is for personal, non-commercial use. Reproducing our work without permission is prohibited.</p>
<p>We strive for accuracy but do not guarantee completeness. Views expressed by contributors are their own.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
