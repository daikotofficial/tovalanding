import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import db from "../../../lib/db";
import AccountActions from "../../../components/account-actions";
import BrandLogo from "../../../components/brand-logo";
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
    <>
      <header className="app-header">
        <Link className="logo" href="/">
          <BrandLogo />
        </Link>
        <nav>
          <Link href="/affiliate/dashboard">Overview</Link>
          <AccountActions />
        </nav>
      </header>
      <main className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <Link className="logo" href="/">
            <BrandLogo />
          </Link>
          <p className="sidebar-label">PARTNER PORTAL</p>
          <nav className="sidebar-nav">
            <Link href="/affiliate/dashboard">
              <span>◈</span>Overview
            </Link>
            <Link href="/affiliate/referrals">
              <span>↗</span>Referrals
            </Link>
            <Link className="active" href="/affiliate/payouts">
              <span>₦</span>Earnings & payouts
            </Link>
            <Link href="/affiliate/settings">
              <span>⚙</span>Settings
            </Link>
          </nav>
          <div className="sidebar-bottom">
            <p>Need help?</p>
            <a href="mailto:support@tova.com.ng">Contact partner support →</a>
          </div>
        </aside>
        <div className="dashboard-main">
          <div className="dash-head">
            <div>
              <p className="eyebrow">PARTNER PORTAL</p>
              <h1>Earnings & payouts.</h1>
            </div>
            <div className="dash-actions">
              <Link className="settings-link" href="/affiliate/settings">
                Settings
              </Link>
              <AccountActions />
            </div>
          </div>
          <div className="dashboard-tabs">
            <Link href="/affiliate/dashboard">Overview</Link>
            <Link href="/affiliate/referrals">Referrals</Link>
            <Link className="active" href="/affiliate/payouts">
              Earnings & payouts
            </Link>
          </div>
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
                You earn 20% of the VAT-exclusive value of qualifying
                subscriptions. Requests are reviewed and paid manually within{" "}
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
                    {money(p.amount)} · {p.status} · {date(p.created_at)}
                  </p>
                ))
              ) : (
                <p className="fine">No payout requests yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
