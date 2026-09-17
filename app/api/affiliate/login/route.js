import { NextResponse } from "next/server";
import db from "../../../../lib/db";
import {
  input,
  emailAddress,
  limit,
  consume,
  passwordError,
  createPassword,
  verifyPassword,
  createSession,
  failure,
} from "../../../../lib/auth";
import { sendMail } from "../../../../lib/mail";
import { welcomeAffiliateEmail } from "../../../../lib/email-templates";
export async function POST(req) {
  try {
    const data = await input(req),
      email = emailAddress(data.email);
    const user = await db
      .prepare("SELECT * FROM affiliates WHERE email=?")
      .get(email);
    if (!user || !["pending", "active"].includes(user.status))
      return failure("Invalid email or password.", 401);
    if (user.locked_until > Date.now()) return failure("Invalid email or password.", 401);
    if (!(await limit("login:" + email, 8))) return failure("Too many login attempts. Please try again later.", 429);
    const hasVerification = Boolean(data.verification);
    const valid = hasVerification ? await consume(email, String(data.verification)) : verifyPassword(data.password, user.password_hash, user.password_salt);
    if (!valid) {
      const attempts = user.failed_login_attempts + 1;
      await db.prepare("UPDATE affiliates SET failed_login_attempts=?,locked_until=? WHERE id=?").run(attempts, attempts >= 5 ? Date.now() + 15 * 60 * 1000 : 0, user.id);
      return failure("Invalid email or password.", 401);
    }
    if (hasVerification && !user.password_hash) {
      const passwordIssue = passwordError(data.password);
      if (passwordIssue) return failure(passwordIssue);
      const password = createPassword(data.password);
      await db.prepare("UPDATE affiliates SET password_hash=?,password_salt=?,password_updated_at=? WHERE id=?").run(password.hash, password.salt, new Date().toISOString(), user.id);
    }
    await db.prepare("UPDATE affiliates SET verified=1,verification_code='',failed_login_attempts=0,locked_until=0 WHERE id=?").run(user.id);
    const response = NextResponse.json({ ok: true });
    await createSession(response, user.id);
    if (!user.verified) {
      try {
        await sendMail({
          to: email,
          subject: "Your TovaERP affiliate account",
          html: welcomeAffiliateEmail(user.name),
          text:
            "Hello, " +
            user.name +
            ". Your email is verified and your affiliate application is now under review. " +
            "Referral access will be issued after approval. Sign in at " +
            process.env.APP_URL +
            "/affiliate/login to check your application status.",
        });
      } catch {
        console.error(
          "Affiliate welcome email delivery failed; referral details remain available in the dashboard.",
        );
      }
    }
    return response;
  } catch (error) {
    return failure(
      "Unable to verify the request.",
      error.message === "ORIGIN" ? 403 : 400,
    );
  }
}
