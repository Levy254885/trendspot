/**
 * Firebase Admin (server-only).
 * Use only in Server Components, Route Handlers, or server actions.
 * Requires FIREBASE_ADMIN_* env vars. Falls back gracefully when unset.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

let adminApp: any = null;
let adminAuth: any = null;
let adminDb: any = null;

function hasAdminCreds(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

export async function getAdminApp(): Promise<any | null> {
  if (!hasAdminCreds()) return null;
  if (adminApp) return adminApp;

  try {
    const adminAppMod = await import("firebase-admin/app");
    const { initializeApp, getApps, cert } = adminAppMod;
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
  } catch {
    return null;
  }
}

export async function getAdminAuth(): Promise<any | null> {
  const app = await getAdminApp();
  if (!app) return null;
  if (!adminAuth) {
    try {
      const { getAuth } = await import("firebase-admin/auth");
      adminAuth = getAuth(app);
    } catch {
      return null;
    }
  }
  return adminAuth;
}

export async function getAdminDb(): Promise<any | null> {
  const app = await getAdminApp();
  if (!app) return null;
  if (!adminDb) {
    try {
      const { getFirestore } = await import("firebase-admin/firestore");
      adminDb = getFirestore(app);
    } catch {
      return null;
    }
  }
  return adminDb;
}

export function isAdminConfigured(): boolean {
  return hasAdminCreds();
}
