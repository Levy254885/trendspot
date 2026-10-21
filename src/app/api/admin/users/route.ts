/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { ApiError, clean, readJson, run } from "@/lib/api";
import { requireRole } from "@/lib/auth/server";
import { getAdminAuth, getDb } from "@/lib/firebase/admin";
import type { Role } from "@/types";

export const dynamic = "force-dynamic";

const ROLES: Role[] = ["admin", "editor", "author"];

function services() {
  const db = getDb();
  const auth = getAdminAuth();
  if (!db || !auth) throw new ApiError(503, "Firebase is not configured.");
  return { db, auth };
}

export async function GET(req: Request) {
  return run(async () => {
    await requireRole(req, ["admin"]);
    const { db } = services();
    const snap = await db.collection("users").limit(500).get();
    const users = snap.docs
      .map((d) => {
        const x = d.data() as Record<string, any>;
        return {
          uid: d.id,
          email: String(x.email || ""),
          displayName: String(x.displayName || ""),
          role: ROLES.includes(x.role) ? (x.role as Role) : "author",
          disabled: x.disabled === true,
          createdAt: String(x.createdAt || ""),
        };
      })
      .sort((a, b) => a.email.localeCompare(b.email));
    return NextResponse.json({ users });
  });
}

/** Create a team member (Firebase Auth account + CMS role). */
export async function POST(req: Request) {
  return run(async () => {
    await requireRole(req, ["admin"]);
    const { db, auth } = services();
    const input = await readJson(req);

    const email = clean(input.email, 200).toLowerCase();
    const password = typeof input.password === "string" ? input.password : "";
    const displayName = clean(input.displayName, 80);
    const role = ROLES.includes(input.role as Role) ? (input.role as Role) : "author";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(400, "Enter a valid email address.");
    }
    if (password.length < 8) {
      throw new ApiError(400, "The password must be at least 8 characters.");
    }

    let uid: string;
    try {
      const created = await auth.createUser({
        email,
        password,
        displayName: displayName || undefined,
      });
      uid = created.uid;
    } catch (e: any) {
      if (e?.code === "auth/email-already-exists") {
        throw new ApiError(409, "An account with that email already exists.");
      }
      throw new ApiError(400, e?.message || "Could not create the account.");
    }

    await db.collection("users").doc(uid).set({
      uid,
      email,
      displayName: displayName || email.split("@")[0],
      role,
      disabled: false,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, uid });
  });
}

/** Change someone's role or switch their access on/off. */
export async function PATCH(req: Request) {
  return run(async () => {
    const me = await requireRole(req, ["admin"]);
    const { db, auth } = services();
    const input = await readJson(req);
    const uid = clean(input.uid, 128);
    if (!uid) throw new ApiError(400, "Missing user.");

    const update: Record<string, unknown> = {};
    if (input.role !== undefined) {
      if (!ROLES.includes(input.role as Role)) throw new ApiError(400, "Invalid role.");
      update.role = input.role;
    }
    if (input.disabled !== undefined) update.disabled = input.disabled === true;

    if (uid === me.uid && (update.role && update.role !== "admin" || update.disabled)) {
      throw new ApiError(400, "You can't remove your own admin access.");
    }

    await db.collection("users").doc(uid).set(update, { merge: true });
    if (update.disabled !== undefined) {
      await auth.updateUser(uid, { disabled: update.disabled === true });
    }
    return NextResponse.json({ ok: true });
  });
}

export async function DELETE(req: Request) {
  return run(async () => {
    const me = await requireRole(req, ["admin"]);
    const { db, auth } = services();
    const uid = new URL(req.url).searchParams.get("uid") || "";
    if (!uid) throw new ApiError(400, "Missing user.");
    if (uid === me.uid) throw new ApiError(400, "You can't delete your own account.");
    try {
      await auth.deleteUser(uid);
    } catch {
      /* account may already be gone */
    }
    await db.collection("users").doc(uid).delete();
    return NextResponse.json({ ok: true });
  });
}
