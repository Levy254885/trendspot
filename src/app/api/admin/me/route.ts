import { NextResponse } from "next/server";
import { run } from "@/lib/api";
import { getSession } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return run(async () => {
    const session = await getSession(req);
    return NextResponse.json(session);
  });
}
