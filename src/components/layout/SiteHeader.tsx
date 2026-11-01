import { UtilityBar } from "./UtilityBar";
import { Masthead } from "./Masthead";
import { MainNav } from "./MainNav";
import { Ticker } from "./Ticker";
import { MobileMenu } from "./MobileMenu";
import type { Article } from "@/types";

export function SiteHeader({ breaking }: { breaking?: Article[] }) {
  return (
    <>
      {/* Phone-only sticky bar + slide-in menu (hidden on tablets/desktop). */}
      <MobileMenu />
      <header>
        <UtilityBar />
        <Masthead />
        <MainNav />
        {breaking && breaking.length > 0 && <Ticker stories={breaking} />}
      </header>
    </>
  );
}
