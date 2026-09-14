import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { fetchBreakingArticles } from "@/services/articles";

export const metadata: Metadata = {
  title: "Disclaimer",
};

export default async function Page() {
  const breaking = await fetchBreakingArticles();
  return (
    <>
      <SiteHeader breaking={breaking} />
      <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
        <h1 className="mb-6 font-[family-name:var(--font-bask)] text-[28px] font-bold">
          Disclaimer
        </h1>
        <div className="article-prose">
          <p>TrendSpot.co.ke provides entertainment and cultural coverage for informational purposes. Content may include opinions and analysis.</p>
<p>We are not responsible for third-party sites linked from our pages. Always verify critical information independently.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
