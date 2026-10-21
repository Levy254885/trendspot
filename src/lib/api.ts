import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clearCache } from "@/lib/server-cache";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Wrap a route handler so thrown ApiErrors become clean JSON responses. */
export async function run(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    if (body && typeof body === "object") return body as Record<string, unknown>;
  } catch {
    /* ignore */
  }
  throw new ApiError(400, "Invalid request body.");
}

/** Call after any change that should appear on the public site. */
export function refreshSite() {
  clearCache();
  try {
    revalidatePath("/", "layout");
  } catch {
    /* revalidation is best-effort */
  }
}

export function clean(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
