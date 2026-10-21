/**
 * Firebase Admin SDK (server only).
 *
 * Credentials come from EITHER:
 *   - FIREBASE_SERVICE_ACCOUNT_JSON  (the whole downloaded service-account JSON, one line), or
 *   - FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY
 *
 * Every database write and every protected read in this project goes through
 * the Admin SDK inside a Next.js route handler, so the browser never talks to
 * Firestore directly and Firestore security rules can stay fully locked.
 */
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import {
  FieldValue,
  getFirestore,
  type Firestore,
} from "firebase-admin/firestore";

type Creds = { projectId: string; clientEmail: string; privateKey: string };

function fixKey(key: string): string {
  return key.trim().replace(/^"|"$/g, "").replace(/\\n/g, "\n");
}

function readCreds(): Creds | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      const p = JSON.parse(json) as Record<string, string>;
      if (p.project_id && p.client_email && p.private_key) {
        return {
          projectId: p.project_id,
          clientEmail: p.client_email,
          privateKey: fixKey(p.private_key),
        };
      }
    } catch {
      /* fall through to the split variables */
    }
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey: fixKey(privateKey) };
  }
  return null;
}

export function isAdminConfigured(): boolean {
  return readCreds() !== null;
}

let app: App | null = null;

export function getAdminApp(): App | null {
  if (app) return app;
  const creds = readCreds();
  if (!creds) return null;
  try {
    const existing = getApps();
    app = existing.length
      ? existing[0]
      : initializeApp({ credential: cert(creds) });
    return app;
  } catch (err) {
    console.error("Firebase Admin failed to initialise:", err);
    return null;
  }
}

export function getDb(): Firestore | null {
  const a = getAdminApp();
  return a ? getFirestore(a) : null;
}

export function getAdminAuth(): Auth | null {
  const a = getAdminApp();
  return a ? getAuth(a) : null;
}

export { FieldValue };
