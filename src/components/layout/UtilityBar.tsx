import Link from "next/link";
import { SubscribeButton } from "./SubscribeButton";

export function UtilityBar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  });

  return (
    <div className="util-bar">
      <div className="util-i">
        <div className="util-left">
          <span className="util-date">{today}</span>
          <Link className="util-tip" href="/contact">
            <i className="ti ti-send" style={{ fontSize: "12px" }} aria-hidden="true"></i> Got a tip?
          </Link>
        </div>
        <div className="util-right">
          <Link className="util-link" href="/#newsletter">Newsletters</Link>
          <Link className="util-link" href="/category/awards">Awards</Link>
          <Link className="util-link" href="/category/charts">Charts</Link>
          <SubscribeButton />
        </div>
      </div>
    </div>
  );
}
