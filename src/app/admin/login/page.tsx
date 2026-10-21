"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { friendlyAuthError, useAdmin } from "@/components/admin/AuthProvider";
import { Button, Field, inputClass } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const { configured, loading, user, me, accessError, signIn, signOut } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (me) router.replace("/admin");
  }, [me, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-black p-12 text-white lg:flex">
        <div>
          <div className="font-[family-name:var(--font-bask)] text-[34px] font-bold leading-none">
            TrendSpot<span className="ml-0.5 align-super text-[15px] font-semibold text-red">.co.ke</span>
          </div>
          <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">
            Content management
          </div>
        </div>
        <div>
          <p className="max-w-md font-[family-name:var(--font-bask)] text-[26px] font-bold leading-snug">
            Write it. Publish it. Watch it travel.
          </p>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/55">
            Manage stories, adverts and media — and see exactly how every article
            performs.
          </p>
        </div>
        <div className="h-[3px] w-24 bg-red" />
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-[#f5f5f3] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="font-[family-name:var(--font-bask)] text-[28px] font-bold leading-none">
              TrendSpot<span className="ml-0.5 align-super text-[12px] font-semibold text-red">.co.ke</span>
            </div>
          </div>
          <h1 className="font-[family-name:var(--font-bask)] text-[26px] font-bold">Sign in</h1>
          <p className="mb-7 mt-1.5 text-[13.5px] text-mid">
            Team members only.{" "}
            <Link href="/" className="font-semibold text-red hover:underline">
              Back to the site
            </Link>
          </p>

          {!configured && (
            <div role="alert" className="mb-5 rounded-md border border-[#f3c4c4] bg-[#fff5f5] px-4 py-3 text-[13.5px] text-red">
              Firebase isn&apos;t configured. Add the <code>NEXT_PUBLIC_FIREBASE_*</code> environment
              variables and redeploy.
            </div>
          )}

          {user && !me && !loading && (
            <div role="alert" className="mb-5 rounded-md border border-[#f3c4c4] bg-[#fff5f5] px-4 py-3 text-[13.5px] text-red">
              {accessError || "This account doesn't have admin access."}
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-2 block font-semibold underline"
              >
                Use a different account
              </button>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border2 bg-white p-6 shadow-sm">
            <Field label="Email">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            {error && (
              <p role="alert" className="text-[13px] text-red">
                {error}
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={busy || !configured}
              className="w-full"
            >
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
