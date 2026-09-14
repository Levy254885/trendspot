import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { fetchBreakingArticles } from "@/services/articles";

export const metadata: Metadata = {
  title: "Contact & Tips",
};

export default async function Page() {
  const breaking = await fetchBreakingArticles();
  return (
    <>
      <SiteHeader breaking={breaking} />
      <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
        <h1 className="mb-6 font-[family-name:var(--font-bask)] text-[28px] font-bold">
          Contact & Tips
        </h1>
        <div className="article-prose">
          <p>Have a tip, story idea or correction? Reach our newsroom.</p>
<p>Email: <a href="mailto:tips@trendspot.co.ke">tips@trendspot.co.ke</a></p>
<p>We read every message. For urgent tips, use the tip line in the site header.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
