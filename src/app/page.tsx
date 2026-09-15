import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { TopStory } from "@/components/home/TopStory";
import { EditorialGrid } from "@/components/home/EditorialGrid";
import { NewsRail } from "@/components/home/NewsRail";
import { Newsletter } from "@/components/home/Newsletter";
import { MoreStories } from "@/components/home/MoreStories";
import { fetchHomeData } from "@/services/articles";

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchHomeData();

  return (
    <>
      <SiteHeader breaking={data.breaking} />
      <main className="mx-auto max-w-[1040px] px-5 pt-10 sm:px-10 lg:px-8">
        {data.featured && (
          <TopStory featured={data.featured} sideStories={data.sideStories} />
        )}
        <EditorialGrid
          fashion={data.fashion}
          music={data.music}
          celebrities={data.celebrities}
        />
        <NewsRail latest={data.latest} mostRead={data.mostRead} />
        <Newsletter />
        <MoreStories stories={data.more} />
      </main>
      <Footer />
    </>
  );
}
