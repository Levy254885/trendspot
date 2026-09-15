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
      setMessage("You're subscribed.");
      setEmail("");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Subscription failed.");
    }
  }

  return (
    <section
      id="newsletter"
      className="mb-12 border border-[#e5e5e5] bg-[#f6f6f6] px-5 py-8 sm:px-8"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mb-1 font-[family-name:var(--font-bask)] text-[20px] font-bold text-black">
            Get the newsletter
          </h2>
          <p className="text-[14px] text-[#3a3a3a]">
            Celebrity, fashion and trending news — every morning.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-2 sm:w-auto">
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Email address"
              className="w-full border border-[#ccc] border-r-0 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-black sm:w-[220px]"
              required
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-black px-4 py-2.5 text-[13px] font-bold text-white hover:bg-red disabled:opacity-60"
            >
              {status === "loading" ? "..." : "Sign up"}
            </button>
          </div>
          {status === "ok" && <p className="text-[13px] text-green-700">{message}</p>}
          {status === "err" && <p className="text-[13px] text-red">{message}</p>}
        </form>
      </div>
    </section>
  );
}
