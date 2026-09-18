import { NextResponse } from "next/server";
import { emailAddress, failure, input, limit } from "../../../../../lib/auth";
import {
  createSuperadminSession,
  validCredentials,
} from "../../../../../lib/superadmin";

export async function POST(req) {
  try {
    const data = await input(req);
    const email = emailAddress(data.email);
    const identity = !(await limit("superadmin-login:" + email, 8))
      ? null
      : await validCredentials(email, data.password);
    if (!identity) return failure("Invalid administrator credentials.", 401);
    const response = NextResponse.json({ ok: true });
    await createSuperadminSession(response, identity);
    return response;
  } catch (error) {
    console.error("Administrator login failed", {
      code: error?.code || "UNKNOWN",
      message: String(error?.message || "Unknown error").slice(0, 200),
    });
    const status =
      error.message === "ORIGIN"
        ? 403
        : ["INPUT", "Unexpected end of JSON input"].includes(error.message)
          ? 400
          : 503;
    return failure(
      status === 403
        ? "Request origin not allowed."
        : status === 503
          ? "Administrator sign-in is temporarily unavailable. Please try again shortly."
          : "Invalid administrator credentials.",
      status,
    );
  }
}
