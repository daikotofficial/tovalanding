import { NextResponse } from "next/server";
import db from "../../../../lib/db";
import {
  input,
  emailAddress,
  limit,
  challenge,
  failure,
} from "../../../../lib/auth";
export async function POST(req) {
  try {
    const data = await input(req),
      email = emailAddress(data.email);
    if (!(await limit("request:global", 100)) || !(await limit("email:" + email, 3)))
      return failure("Please wait before requesting another code.", 429);
    if (await db.prepare("SELECT id FROM affiliates WHERE email=?").get(email))
      await challenge(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return failure(
      error.message === "ORIGIN"
        ? "Request origin not allowed."
        : "Unable to send a code. Check your details and try again.",
      error.message === "ORIGIN" ? 403 : 400,
    );
  }
}
