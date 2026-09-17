import { NextResponse } from "next/server";
import db, { makeCode } from "../../../../lib/db";
import {
  input,
  emailAddress,
  passwordError,
  createPassword,
  limit,
  challenge,
  failure,
} from "../../../../lib/auth";

export async function POST(req) {
  try {
    const data = await input(req),
      email = emailAddress(data.email);
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const passwordIssue = passwordError(data.password);
    if (name.length < 2 || name.length > 120 || data.consent !== true)
      return failure(
        "Enter your name and confirm your email will be used to manage your account.",
      );
    if (passwordIssue || data.password !== data.passwordConfirmation)
      return failure(passwordIssue || "Your passwords do not match.");
    if (!limit("signup:global", 100) || !limit("email:" + email, 3))
      return failure("Please wait before requesting another code.", 429);
    if (
      String(data.phone || "").length > 40 ||
      String(data.location || "").length > 160 ||
      String(data.channel || "").length > 100
    )
      return failure("Please check your details.");
    const password = createPassword(data.password);
    // The unique constraint arbitrates concurrent inserts; retry random code collisions.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        db.prepare(
          "INSERT INTO affiliates(name,email,phone,location,channel,code,verification_code,password_hash,password_salt,password_updated_at,created_at) VALUES(?,?,?,?,?,?,?, ?,?,?,?) ON CONFLICT(email) DO NOTHING",
        ).run(
          name,
          email,
          String(data.phone || ""),
          String(data.location || ""),
          String(data.channel || ""),
          makeCode(),
          "",
          password.hash,
          password.salt,
          new Date().toISOString(),
          new Date().toISOString(),
        );
        break;
      } catch (error) {
        if (attempt === 4 || !String(error.message).includes("affiliates.code"))
          throw error;
      }
    }
    await challenge(email);
    return NextResponse.json({ ok: true, email });
  } catch (error) {
    if (error.message === "ORIGIN")
      return failure("Request origin not allowed.", 403);
    if (
      ["INPUT", "SyntaxError"].includes(error.message) ||
      error instanceof SyntaxError
    )
      return failure("Please check your registration details.");
    return failure(
      "We could not send your code. Please try again shortly.",
      503,
    );
  }
}
