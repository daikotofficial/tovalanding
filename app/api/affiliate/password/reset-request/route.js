import { NextResponse } from "next/server";
import { challenge, emailAddress, failure, input, limit } from "../../../../../lib/auth";
import db, { hash } from "../../../../../lib/db";

export async function POST(req) {
  try {
    const data = await input(req); const email = emailAddress(data.email);
    if (!(await limit("password-reset:" + email, 3))) return failure("Please wait before requesting another code.", 429);
    const affiliate = await db.prepare("SELECT id FROM affiliates WHERE email=?").get(email);
    console.info("Affiliate password reset request handled", {
      emailHash: hash(email).slice(0, 12),
      accountFound: Boolean(affiliate),
    });
    if (affiliate) {
      await challenge(email, "password-reset");
      console.info("Affiliate password reset email handed to mail transport", {
        emailHash: hash(email).slice(0, 12),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Affiliate password reset request failed", {
      code: error?.code || error?.cause?.code || "UNKNOWN",
      message: String(error?.message || error || "Unknown error").slice(0, 300),
    });
    return failure(error.message === "ORIGIN" ? "Request origin not allowed." : "Unable to process that request.", error.message === "ORIGIN" ? 403 : 400);
  }
}
