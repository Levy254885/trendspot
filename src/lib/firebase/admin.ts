/**
 * Firebase Admin (server-only).
 * Use only in Server Components, Route Handlers, or server actions.
 * Requires FIREBASE_ADMIN_* env vars. Falls back gracefully when unset.
 */

import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function hasAdminCreds(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

export async function getAdminApp(): Promise<App | null> {
  if (!hasAdminCreds()) return null;
  if (adminApp) return adminApp;

  const { initializeApp, getApps, cert } = await import("firebase-admin/app");
  if (getApps().length) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(
    /\\n/g,
    "\n"
  );

  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey,
    }),
  });
  return adminApp;
}

export async function getAdminAuth(): Promise<Auth | null> {
  const app = await getAdminApp();
  if (!app) return null;
  if (!adminAuth) {
    const { getAuth } = await import("firebase-admin/auth");
    adminAuth = getAuth(app);
  }
  return adminAuth;
}

export async function getAdminDb(): Promise<Firestore | null> {
  const app = await getAdminApp();
  if (!app) return null;
  if (!adminDb) {
    const { getFirestore } = await import("firebase-admin/firestore");
    adminDb = getFirestore(app);
  }
  return adminDb;
}

export function isAdminConfigured(): boolean {
  return hasAdminCreds();
}
