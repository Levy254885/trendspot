import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { fetchBreakingArticles } from "@/services/articles";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function Page() {
  const breaking = await fetchBreakingArticles();
  return (
    <>
      <SiteHeader breaking={breaking} />
      <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
        <h1 className="mb-6 font-[family-name:var(--font-bask)] text-[28px] font-bold">
          Privacy Policy
        </h1>
        <div className="article-prose">
          <p>TrendSpot.co.ke respects your privacy. We collect limited data necessary to operate the site, including newsletter subscriptions and contact form submissions.</p>
<p>We do not sell personal data. Cookies may be used for analytics and essential site function. Contact us for data requests.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
