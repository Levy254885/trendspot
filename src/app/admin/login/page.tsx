"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { getFirebaseAuth, isFirebaseEnabled } = await import(
        "@/lib/firebase/client"
      );
      if (!isFirebaseEnabled()) {
        setError(
          "Firebase is not configured. Set NEXT_PUBLIC_USE_FIREBASE=true and Firebase env vars. For local demo, visit /admin directly."
        );
        setLoading(false);
        return;
      }
      const auth = getFirebaseAuth();
      if (!auth) {
        setError("Auth unavailable.");
        setLoading(false);
        return;
      }
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sign-in failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 font-[family-name:var(--font-bask)] text-2xl font-bold">
        Admin sign in
      </h1>
      <p className="mb-6 text-sm text-mid">
        Editors and admins only.{" "}
        <Link href="/" className="text-red hover:underline">
          Back to site
        </Link>
      </p>
      <form onSubmit={onSubmit} className="border border-border bg-white p-6">
        <label className="mb-4 block">
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-mid">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            autoComplete="email"
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-mid">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="mb-4 text-sm text-red" role="alert">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
