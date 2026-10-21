import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { TopStory } from "@/components/home/TopStory";
import { EditorialGrid } from "@/components/home/EditorialGrid";
import { NewsRail } from "@/components/home/NewsRail";
import { AwardsBand } from "@/components/home/AwardsBand";
import { Newsletter } from "@/components/home/Newsletter";
import { MoreStories } from "@/components/home/MoreStories";
import { AdSlot } from "@/components/ads/AdSlot";
import { fetchHomeData } from "@/services/articles";

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchHomeData();

  return (
    <>
      <SiteHeader breaking={data.breaking} />

      <div className="page">
        <AdSlot placement="home-top" />
        {data.featured && (
          <TopStory featured={data.featured} sideStories={data.sideStories} />
        )}
        <EditorialGrid
          fashion={data.fashion}
          music={data.music}
          celebrities={data.celebrities}
        />
        <AdSlot placement="home-mid" />
        <NewsRail latest={data.latest} mostRead={data.mostRead} />
      </div>

      <AwardsBand stories={data.awards} />

      <div className="page">
        <Newsletter />
        <MoreStories stories={data.more} />
      </div>

      <Footer />
    </>
  );
}
