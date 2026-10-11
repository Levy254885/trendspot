"use client";

import { useRouter } from "next/navigation";

export function SubscribeButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="util-sub"
      onClick={() => router.push("/#newsletter")}
    >
      Subscribe
    </button>
  );
}
