import { NextResponse } from "next/server";
import { consume, createPassword, createSession, emailAddress, failure, input, passwordError } from "../../../../../lib/auth";
import db from "../../../../../lib/db";

export async function POST(req) {
  try {
    const data = await input(req); const email = emailAddress(data.email); const issue = passwordError(data.newPassword);
    if (issue) return failure(issue);
    if (data.newPassword !== data.confirmPassword) return failure("Your passwords do not match.");
    if (!(await consume(email, String(data.verification || "")))) return failure("This code is invalid or expired.", 401);
    const user = await db.prepare("SELECT id,status FROM affiliates WHERE email=? AND status IN ('pending','active')").get(email);
    if (!user) return failure("This code is invalid or expired.", 401);
    const password = createPassword(data.newPassword);
    await db.transaction(async () => {
      await db.prepare("UPDATE affiliates SET password_hash=?,password_salt=?,password_updated_at=?,verified=1,failed_login_attempts=0,locked_until=0 WHERE id=?").run(password.hash, password.salt, new Date().toISOString(), user.id);
      await db.prepare("DELETE FROM sessions WHERE affiliate_id=?").run(user.id);
    });
    const response = NextResponse.json({ ok: true });
    await createSession(response, user.id);
    return response;
  } catch { return failure("Unable to reset your password."); }
}
