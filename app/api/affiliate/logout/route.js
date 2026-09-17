import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkOrigin, failure } from "../../../../lib/auth";
import db, { hash } from "../../../../lib/db";
export async function POST(req) {
  try {
    checkOrigin(req);
  } catch {
    return failure("Request origin not allowed.", 403);
  }
  const token = (await cookies()).get("tova_session")?.value;
  if (token)
    await db.prepare("DELETE FROM sessions WHERE token_hash=?").run(hash(token));
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("tova_session");
  response.cookies.delete("tova_affiliate");
  return response;
}
