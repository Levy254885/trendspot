"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { getClientAuth, isClientConfigured } from "@/lib/firebase/client";
import type { AdminSession } from "@/types";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

type Ctx = {
  configured: boolean;
  loading: boolean;
  user: User | null;
  me: AdminSession | null;
  accessError: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Calls an /api/admin/* endpoint with the signed-in user's token. */
  api: <T = Record<string, unknown>>(path: string, opts?: ApiOptions) => Promise<T>;
};

const AuthContext = createContext<Ctx | null>(null);

export function useAdmin(): Ctx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AuthProvider>");
  return ctx;
}

export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || "";
  if (
    code === "auth/invalid-credential" ||
    code === "auth/wrong-password" ||
    code === "auth/user-not-found" ||
    code === "auth/invalid-email"
  ) {
    return "Wrong email or password.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Wait a few minutes and try again.";
  }
  if (code === "auth/user-disabled") return "This account has been disabled.";
  if (code === "auth/network-request-failed") {
    return "Network problem. Check your connection and try again.";
  }
  return err instanceof Error ? err.message : "Sign-in failed.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isClientConfigured();
  const [loading, setLoading] = useState(configured);
  const [user, setUser] = useState<User | null>(null);
  const [me, setMe] = useState<AdminSession | null>(null);
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    const auth = getClientAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAccessError("");
      if (!u) {
        setMe(null);
        setLoading(false);
        return;
      }
      try {
        const token = await u.getIdToken();
        const res = await fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setMe(data as AdminSession);
        } else {
          setMe(null);
          setAccessError(data.error || "Could not verify your access.");
        }
      } catch {
        setMe(null);
        setAccessError("Could not reach the server.");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getClientAuth();
    if (!auth) throw new Error("Firebase isn't configured.");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    const auth = getClientAuth();
    if (auth) await fbSignOut(auth);
    setMe(null);
  }, []);

  const api = useCallback(
    async <T,>(path: string, opts: ApiOptions = {}): Promise<T> => {
      const auth = getClientAuth();
      const current = auth?.currentUser;
      if (!current) throw new Error("You're signed out. Please sign in again.");
      const token = await current.getIdToken();
      const res = await fetch(path, {
        method: opts.method || "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      return data as T;
    },
    []
  );

  const value = useMemo<Ctx>(
    () => ({ configured, loading, user, me, accessError, signIn, signOut, api }),
    [configured, loading, user, me, accessError, signIn, signOut, api]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
