import { UtilityBar } from "./UtilityBar";
import { Masthead } from "./Masthead";
import { MainNav } from "./MainNav";
import { Ticker } from "./Ticker";
import type { Article } from "@/types";

export function SiteHeader({ breaking }: { breaking?: Article[] }) {
  return (
    <header>
      <UtilityBar />
      <Masthead />
      <MainNav />
      {breaking && breaking.length > 0 && <Ticker stories={breaking} />}
    </header>
  );
}
