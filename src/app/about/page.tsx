import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { fetchBreakingArticles } from "@/services/articles";

export const metadata: Metadata = {
  title: "About Us",
};

export default async function Page() {
  const breaking = await fetchBreakingArticles();
  return (
    <>
      <SiteHeader breaking={breaking} />
      <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
        <h1 className="mb-6 font-[family-name:var(--font-bask)] text-[28px] font-bold">
          About Us
        </h1>
        <div className="article-prose">
          <p>TrendSpot.co.ke is Kenya's definitive voice for entertainment, celebrity, fashion, music and pop culture. We cover the stories shaping culture across East Africa and the global stage.</p>
<p>Our team of editors and correspondents delivers sharp reporting, exclusive interviews and authoritative coverage of awards, runway moments and the people who define the moment.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
