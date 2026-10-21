"use client";

import { useEffect } from "react";

/** Counts one view per article per browser session. Renders nothing. */
export function ViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    const key = `ts:view:${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: count anyway */
    }
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
      keepalive: true,
    }).catch(() => {});
  }, [articleId]);
  return null;
}
