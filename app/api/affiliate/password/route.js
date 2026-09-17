import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentUser, createPassword, createSession, failure, input, passwordError, verifyPassword } from "../../../../lib/auth";
import db, { hash } from "../../../../lib/db";

export async function POST(req) {
  const user = await currentUser();
  if (!user) return failure("Not signed in.", 401);
  try {
    const data = await input(req);
    const issue = passwordError(data.newPassword);
    if (issue) return failure(issue);
    const credentials = db.prepare("SELECT password_hash,password_salt FROM affiliates WHERE id=?").get(user.id);
    if (!verifyPassword(data.currentPassword, credentials?.password_hash, credentials?.password_salt)) return failure("Your current password is incorrect.", 401);
    if (data.newPassword !== data.confirmPassword) return failure("Your new passwords do not match.");
    const password = createPassword(data.newPassword);
    db.prepare("UPDATE affiliates SET password_hash=?,password_salt=?,password_updated_at=?,failed_login_attempts=0,locked_until=0 WHERE id=?").run(password.hash, password.salt, new Date().toISOString(), user.id);
    const token = (await cookies()).get("tova_session")?.value;
    db.prepare("DELETE FROM sessions WHERE affiliate_id=?").run(user.id);
    const response = NextResponse.json({ ok: true });
    if (token) {
      // Re-authenticate the current browser after revoking every old session.
      createSession(response, user.id);
    }
    return response;
  } catch {
    return failure("Unable to update your password.");
  }
}
