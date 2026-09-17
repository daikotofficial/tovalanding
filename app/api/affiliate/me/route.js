import { NextResponse } from "next/server";
import { currentUser, failure } from "../../../../lib/auth";
import db from "../../../../lib/db";
export async function GET() {
  const user = await currentUser();
  if (!user) return failure("Not signed in.", 401);
  const referrals = db
    .prepare(
      "SELECT product,status,created_at FROM referrals WHERE affiliate_id=? ORDER BY id DESC LIMIT 50",
    )
    .all(user.id);
  const earnings = db
    .prepare(
      "SELECT COALESCE(SUM(amount),0) AS amount FROM commissions WHERE affiliate_id=? AND status='approved'",
    )
    .get(user.id).amount;
  const pending = db
    .prepare(
      "SELECT COALESCE(SUM(amount),0) AS amount FROM commissions WHERE affiliate_id=? AND status='pending'",
    )
    .get(user.id).amount;
  const paidOut = db
    .prepare(
      "SELECT COALESCE(SUM(amount),0) AS amount FROM payouts WHERE affiliate_id=? AND status IN ('requested','approved','paid')",
    )
    .get(user.id).amount;
  return NextResponse.json(
    {
      user: {
        ...user,
        earnings,
        pending,
        paidOut,
        referrals,
        referralLink: user.status === "active" ? process.env.APP_URL + "/r/" + encodeURIComponent(user.code) : null,
        referralCode: user.status === "active" ? user.code : null,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
