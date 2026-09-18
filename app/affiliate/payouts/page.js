import { redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import db from "../../../lib/db";
import AffiliatePortalShell from "../../../components/affiliate-portal-shell";
import PayoutAction from "../../../components/payout-action";
import {
  PAYOUT_MINIMUM_MINOR,
  PAYOUT_PROCESSING_DAYS,
} from "../../../lib/payout-policy";

function money(value) {
  return `₦${(Number(value || 0) / 100).toLocaleString()}`;
}
function date(value) {
  return value ? String(value).slice(0, 10) : "—";
}
function statusLabel(value) {
  return String(value || "").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function PayoutsPage() {
  const user = await currentUser();
  if (!user) redirect("/affiliate/login");
  const accrued = (
    await db
      .prepare(
        "SELECT COALESCE(SUM(amount),0) AS amount FROM commissions WHERE affiliate_id=? AND status IN ('pending','approved')",
      )
      .get(user.id)
  ).amount;
  const available = (
    await db
      .prepare(
        "SELECT COALESCE(SUM(c.amount),0) AS amount FROM commissions c WHERE c.affiliate_id=? AND c.status='approved' AND c.id NOT IN (SELECT commission_id FROM payout_commissions)",
      )
      .get(user.id)
  ).amount;
  const paidOut = (
    await db
      .prepare(
        "SELECT COALESCE(SUM(amount),0) AS amount FROM payouts WHERE affiliate_id=? AND status='paid'",
      )
      .get(user.id)
  ).amount;
  const payouts = await db
    .prepare(
      "SELECT amount,status,created_at FROM payouts WHERE affiliate_id=? ORDER BY id DESC LIMIT 20",
    )
    .all(user.id);
  return (
    <AffiliatePortalShell user={user} active="payouts" title="Earnings & payouts.">
          <section className="dash-metrics">
            <div>
              <small>Total accrued</small>
              <strong>{money(accrued)}</strong>
              <span>Pending and approved commission</span>
            </div>
            <div>
              <small>Available</small>
              <strong>{money(available)}</strong>
              <span>Eligible for payout</span>
            </div>
            <div>
              <small>Total paid out</small>
              <strong>{money(paidOut)}</strong>
              <span>Successfully settled</span>
            </div>
          </section>
          <section className="dash-panels single-panel">
            <div>
              <h2>Request a payout</h2>
              <p className="fine">
                You earn 20% on qualifying paid subscriptions. Requests are
                reviewed and paid manually within{" "}
                {PAYOUT_PROCESSING_DAYS} business days.
              </p>
              <div className="payout-line">
                <span>Available balance</span>
                <strong>{money(available)}</strong>
              </div>
              <PayoutAction disabled={available < PAYOUT_MINIMUM_MINOR} />
              <h2 className="payout-history-heading">Payout history</h2>
              {payouts.length ? (
                payouts.map((p, i) => (
                  <p className="fine payout-history" key={i}>
                    {money(p.amount)} · {statusLabel(p.status)} · {date(p.created_at)}
                  </p>
                ))
              ) : (
                <p className="fine">No payout requests yet.</p>
              )}
            </div>
          </section>
    </AffiliatePortalShell>
  );
}
