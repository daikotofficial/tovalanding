import { NextResponse } from "next/server";
import { currentUser, failure, checkOrigin } from "../../../../lib/auth";
import db from "../../../../lib/db";
import { PAYOUT_MINIMUM_MINOR } from "../../../../lib/payout-policy";

export async function POST(req) {
  try { checkOrigin(req); } catch { return failure("Request origin not allowed.", 403); }
  const user = await currentUser();
  if (!user) return failure("Not signed in.", 401);
  const payout = await db.transaction(async () => {
    const existing = await db.prepare(
      "SELECT id FROM payouts WHERE affiliate_id=? AND status IN ('requested','approved') LIMIT 1",
    ).get(user.id);
    if (existing) return { error: "PAYOUT_PENDING" };
    const commissions = await db.prepare(
      "SELECT id,amount FROM commissions WHERE affiliate_id=? AND status='approved' AND id NOT IN (SELECT commission_id FROM payout_commissions) ORDER BY id",
    ).all(user.id);
    const available = commissions.reduce((total, commission) => total + commission.amount, 0);
    if (available < PAYOUT_MINIMUM_MINOR) return { error: "PAYOUT_MINIMUM" };
    const row = await db.prepare(
      "INSERT INTO payouts(affiliate_id,amount,status,created_at) VALUES(?,?,'requested',?) RETURNING id,amount,status,created_at",
    ).get(user.id, available, new Date().toISOString());
    const reserve = db.prepare(
      "INSERT INTO payout_commissions(payout_id,commission_id) VALUES(?,?)",
    );
    for (const commission of commissions) await reserve.run(row.id, commission.id);
    return row;
  });
  if (payout?.error === "PAYOUT_PENDING") return failure("Your current payout request is still being processed.");
  if (payout?.error === "PAYOUT_MINIMUM") return failure("Payouts are available once your approved balance reaches ₦50,000.");
  if (!payout) return failure("There is no approved balance available for payout.");
  return NextResponse.json({ payout });
}
