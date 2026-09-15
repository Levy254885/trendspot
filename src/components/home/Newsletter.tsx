"use client";

import { useState, FormEvent } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("ok");
      setMessage("You're subscribed. Welcome to TrendSpot.");
      setEmail("");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Subscription failed.");
    }
  }

  return (
    <section
      id="newsletter"
      className="mb-10 border border-border bg-surface px-4 py-7 sm:px-6 md:mb-8 md:flex md:items-center md:justify-between md:gap-7 md:px-7 md:py-6"
    >
      <div className="mb-5 md:mb-0">
        <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-red">
          Daily Newsletter
        </div>
        <div className="mb-1 font-[family-name:var(--font-bask)] text-[20px] font-bold text-black md:text-[18px]">
          Get TrendSpot.co.ke in Your Inbox
        </div>
        <div className="font-[family-name:var(--font-serif)] text-[15px] text-gray md:text-[13px]">
          Celebrity news, fashion drops, and viral moments — every morning.
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-2 md:w-auto">
        <div className="flex w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="Enter your email"
            className="min-w-0 flex-1 border border-border border-r-0 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-ink md:w-[220px] md:flex-none md:py-2.5 md:text-[13px]"
            required
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 border border-black bg-black px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-white hover:border-red hover:bg-red disabled:opacity-60 md:py-2.5"
          >
            {status === "loading" ? "..." : "Sign Up"}
          </button>
        </div>
        {status === "ok" && <p className="text-[13px] text-green-700">{message}</p>}
        {status === "err" && <p className="text-[13px] text-red">{message}</p>}
      </form>
    </section>
  );
}
