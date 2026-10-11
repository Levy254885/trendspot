"use client";

import { useState, FormEvent } from "react";

const DEFAULT_SUB =
  "Celebrity news, fashion drops, and viral moments — delivered every morning.";

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

  const subClass = status === "ok" ? "nl-sub ok" : status === "err" ? "nl-sub err" : "nl-sub";

  return (
    <div className="nl-strip" id="newsletter">
      <div className="nl-left">
        <div className="nl-eyebrow">Daily Newsletter</div>
        <div className="nl-title">Get TrendSpot.co.ke in Your Inbox</div>
        {/* Success / error feedback replaces the sub-line so the strip never changes height. */}
        <div className={subClass}>
          {status === "ok" || status === "err" ? message : DEFAULT_SUB}
        </div>
      </div>
      <form className="nl-form" onSubmit={onSubmit}>
        <input
          className="nl-input"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          required
          disabled={status === "loading"}
        />
        <button className="nl-btn" type="submit" disabled={status === "loading"}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
