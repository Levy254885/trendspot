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
      className="mb-8 flex flex-col items-start justify-between gap-5 border border-border bg-surface px-5 py-6 sm:flex-row sm:items-center sm:gap-7 sm:px-7"
    >
      <div>
        <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-red">
          Daily Newsletter
        </div>
        <div className="mb-1 font-[family-name:var(--font-bask)] text-[17px] font-bold text-black sm:text-[18px]">
          Get TrendSpot.co.ke in Your Inbox
        </div>
        <div className="font-[family-name:var(--font-serif)] text-[13px] text-gray">
          Celebrity news, fashion drops, and viral moments — every morning.
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
        <div className="flex w-full sm:w-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="Enter your email address"
            className="w-full border border-border border-r-0 bg-white px-4 py-2.5 text-[13px] text-ink outline-none focus:border-ink sm:w-[220px]"
            required
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="whitespace-nowrap border border-black bg-black px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:border-red hover:bg-red disabled:opacity-60 sm:px-5"
          >
            {status === "loading" ? "..." : "Sign Up"}
          </button>
        </div>
        {status === "ok" && <p className="text-[12px] text-green-700">{message}</p>}
        {status === "err" && <p className="text-[12px] text-red">{message}</p>}
      </form>
    </section>
  );
}
