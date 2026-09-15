import { MainNav } from "./MainNav";
import { Masthead } from "./Masthead";
import type { Article } from "@/types";

export function SiteHeader({ breaking }: { breaking?: Article[] }) {
  return (
    <header className="border-b border-[#e5e5e5] bg-white">
      <Masthead />
      <MainNav />
    </header>
  );
}
