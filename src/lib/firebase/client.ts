/**
 * Firebase client helpers.
 * Gracefully no-ops when Firebase is not configured or the package is missing.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function isConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.apiKey !== "undefined"
  );
}

let app: any = null;
let auth: any = null;
let db: any = null;

export function getFirebaseApp(): any {
  if (!isConfigured()) return null;
  if (app) return app;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initializeApp, getApps, getApp } = require("firebase/app");
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return app;
  } catch {
    return null;
  }
}

export function getFirebaseAuth(): any {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!auth) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getAuth } = require("firebase/auth");
      auth = getAuth(a);
    } catch {
      return null;
    }
  }
  return auth;
}

export function getFirebaseDb(): any {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!db) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getFirestore } = require("firebase/firestore");
      db = getFirestore(a);
    } catch {
      return null;
    }
  }
  return db;
}

export function isFirebaseEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_FIREBASE === "true" && isConfigured();
}
