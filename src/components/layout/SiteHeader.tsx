import { UtilityBar } from "./UtilityBar";
import { Masthead } from "./Masthead";
import { MainNav } from "./MainNav";
import { Ticker } from "./Ticker";
import { MobileHeader } from "./MobileHeader";
import type { Article } from "@/types";

export function SiteHeader({ breaking }: { breaking?: Article[] }) {
  return (
    <header className="bg-white">
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <div className="hidden md:block">
        <UtilityBar />
        <Masthead />
        <MainNav />
      </div>
      {breaking && breaking.length > 0 && <Ticker stories={breaking} />}
    </header>
  );
}
