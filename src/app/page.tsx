import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { TopStory } from "@/components/home/TopStory";
import { EditorialGrid } from "@/components/home/EditorialGrid";
import { NewsRail } from "@/components/home/NewsRail";
import { AwardsBand } from "@/components/home/AwardsBand";
import { Newsletter } from "@/components/home/Newsletter";
import { MoreStories } from "@/components/home/MoreStories";
import { fetchHomeData } from "@/services/articles";

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchHomeData();

  return (
    <>
      <SiteHeader breaking={data.breaking} />
      <main className="mx-auto max-w-[1180px] px-4 pt-6 pb-2 sm:px-5 md:px-6 md:pt-7">
        {data.featured && (
          <TopStory featured={data.featured} sideStories={data.sideStories} />
        )}
        <EditorialGrid
          fashion={data.fashion}
          music={data.music}
          celebrities={data.celebrities}
        />
        <NewsRail latest={data.latest} mostRead={data.mostRead} />
      </main>

      <AwardsBand stories={data.awards} />

      <div className="mx-auto max-w-[1180px] px-4 pt-8 sm:px-5 md:px-6">
        <Newsletter />
        <MoreStories stories={data.more} />
      </div>
      <Footer />
    </>
  );
}
