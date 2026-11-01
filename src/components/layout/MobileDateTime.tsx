"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 15_000);
  return () => window.clearInterval(id);
}

function snapshot(): string {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Nairobi",
  });
  return `${date}|${time}`;
}

/** Live Nairobi date + time strip shown under the sticky bar on phones. */
export function MobileDateTime() {
  // Empty on the server, filled in right after hydration (no mismatch).
  const value = useSyncExternalStore(subscribe, snapshot, () => "");
  const [date, time] = value.split("|");

  return (
    <div className="mdt" aria-live="off">
      <span className="mdt-date">
        <i className="ti ti-calendar-event" aria-hidden="true"></i>
        {date || "\u00A0"}
      </span>
      {time && (
        <span className="mdt-time">
          <i className="ti ti-clock" aria-hidden="true"></i>
          {time} <b>EAT</b>
        </span>
      )}
    </div>
  );
}
