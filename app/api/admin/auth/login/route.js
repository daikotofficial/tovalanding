import { NextResponse } from "next/server";
import { emailAddress, failure, input, limit } from "../../../../../lib/auth";
import { createSuperadminSession, validCredentials } from "../../../../../lib/superadmin";

export async function POST(req) {
  try {
    const data = await input(req);
    const email = emailAddress(data.email);
    const identity = !(await limit("superadmin-login:" + email, 8)) ? null : await validCredentials(email, data.password);
    if (!identity) return failure("Invalid administrator credentials.", 401);
    const response = NextResponse.json({ ok: true });
    await createSuperadminSession(response, identity);
    return response;
  } catch (error) {
    return failure(error.message === "ORIGIN" ? "Request origin not allowed." : "Invalid administrator credentials.", error.message === "ORIGIN" ? 403 : 401);
  }
}
