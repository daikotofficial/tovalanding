import { NextResponse } from "next/server";
import { checkOrigin, failure } from "../../../../../lib/auth";
import { destroySuperadminSession } from "../../../../../lib/superadmin";

export async function POST(req) {
  try { checkOrigin(req); } catch { return failure("Request origin not allowed.", 403); }
  const response = NextResponse.json({ ok: true });
  await destroySuperadminSession(response);
  return response;
}
