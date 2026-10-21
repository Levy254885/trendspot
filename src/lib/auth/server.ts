import { ApiError } from "@/lib/api";
import { getAdminAuth, getDb } from "@/lib/firebase/admin";
import type { AdminSession, Role } from "@/types";

const ROLES: Role[] = ["admin", "editor", "author"];

function ownerEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies the Firebase ID token in the Authorization header and works out the
 * user's CMS role.
 *
 *  - Emails listed in the ADMIN_EMAILS env var are always admins (this is how
 *    the very first admin gets in).
 *  - Everyone else needs a document in `users/{uid}` with a valid role.
 */
export async function getSession(req: Request): Promise<AdminSession> {
  const auth = getAdminAuth();
  const db = getDb();
  if (!auth || !db) {
    throw new ApiError(
      503,
      "The server is not connected to Firebase yet. Add the Firebase Admin environment variables."
    );
  }

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new ApiError(401, "Please sign in.");

  let decoded;
  try {
    decoded = await auth.verifyIdToken(token);
  } catch {
    throw new ApiError(401, "Your session expired. Please sign in again.");
  }

  const email = (decoded.email || "").toLowerCase();
  const ref = db.collection("users").doc(decoded.uid);
  const snap = await ref.get();
  const data = snap.exists ? snap.data() || {} : {};

  let role: Role | null = null;
  if (data.disabled !== true && ROLES.includes(data.role as Role)) {
    role = data.role as Role;
  }
  const name: string =
    (typeof data.displayName === "string" && data.displayName) ||
    decoded.name ||
    email.split("@")[0] ||
    "Staff";

  if (ownerEmails().includes(email)) {
    role = "admin";
    if (data.role !== "admin") {
      await ref.set(
        {
          uid: decoded.uid,
          email,
          displayName: name,
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  }

  if (!role) {
    throw new ApiError(
      403,
      "This account doesn't have access to the admin area. Ask an administrator to add you."
    );
  }

  return { uid: decoded.uid, email, name, role };
}

export async function requireRole(
  req: Request,
  roles: Role[]
): Promise<AdminSession> {
  const session = await getSession(req);
  if (!roles.includes(session.role)) {
    throw new ApiError(403, "You don't have permission to do that.");
  }
  return session;
}

export const STAFF: Role[] = ["admin", "editor", "author"];
export const MANAGERS: Role[] = ["admin", "editor"];
