import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import db from "../../../lib/db";
import AccountActions from "../../../components/account-actions";
import PayoutAction from "../../../components/payout-action";
import ReferralCredentials from "../../../components/referral-credentials";
import { PAYOUT_MINIMUM_MINOR, PAYOUT_PROCESSING_DAYS } from "../../../lib/payout-policy";
export default async function Dashboard() {
  const user = await currentUser();
  if (!user) redirect("/affiliate/login");
  const referrals = db
    .prepare(
      "SELECT r.product,r.status,r.created_at,COALESCE(c.amount,0) AS commission FROM referrals r LEFT JOIN commissions c ON c.referral_id=r.id WHERE r.affiliate_id=? ORDER BY r.id DESC LIMIT 50",
    )
    .all(user.id);
  const totals = db
    .prepare(
      "SELECT COUNT(*) AS registrations, SUM(CASE WHEN status='converted' THEN 1 ELSE 0 END) AS conversions FROM referrals WHERE affiliate_id=?",
    )
    .get(user.id);
  const earnings = db
    .prepare(
      "SELECT COALESCE(SUM(amount),0) AS amount FROM commissions WHERE affiliate_id=? AND status='approved'",
    )
    .get(user.id).amount;
  const pending = db
    .prepare(
      "SELECT COALESCE(SUM(amount),0) AS amount FROM payouts WHERE affiliate_id=? AND status IN ('requested','approved')",
    )
    .get(user.id).amount;
  const available = db
    .prepare(
      "SELECT COALESCE(SUM(c.amount),0) AS amount FROM commissions c WHERE c.affiliate_id=? AND c.status='approved' AND c.id NOT IN (SELECT commission_id FROM payout_commissions)",
    )
    .get(user.id).amount;
  const payouts = db
    .prepare("SELECT amount,status,created_at FROM payouts WHERE affiliate_id=? ORDER BY id DESC LIMIT 5")
    .all(user.id);
  const link = process.env.APP_URL + "/r/" + user.code;
  if (user.status === "pending") {
    return (
      <>
        <header className="app-header">
          <Link className="logo" href="/">Tova Solutions</Link>
          <AccountActions />
        </header>
        <main className="review-page">
          <p className="eyebrow">AFFILIATE APPLICATION</p>
          <h1>Your application is under review.</h1>
          <p>Thank you for applying, {user.name}. Our team will review your profile before referral access is issued.</p>
          <div className="review-status"><strong>Referral access is not active yet.</strong><span>Links, codes, and commission tracking become available after approval.</span></div>
          <Link className="button dark" href="/">Return to Tova Solutions</Link>
        </main>
      </>
    );
  }
  return (
    <>
      <header className="app-header">
        <Link className="logo" href="/">
          Tova Solutions
        </Link>
        <nav>
          <Link href="/#products">Products</Link>
        </nav>
      </header>
      <main className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <Link className="logo" href="/">Tova Solutions</Link>
          <p className="sidebar-label">PARTNER PORTAL</p>
          <nav className="sidebar-nav">
            <Link className="active" href="/affiliate/dashboard"><span>◈</span>Overview</Link>
            <a href="#referrals"><span>↗</span>Referrals</a>
            <a href="#payouts"><span>₦</span>Earnings & payouts</a>
            <Link href="/affiliate/settings"><span>⚙</span>Settings</Link>
          </nav>
          <div className="sidebar-bottom"><p>Need help?</p><a href="mailto:support@tova.com.ng">Contact partner support →</a></div>
        </aside>
        <div className="dashboard-main">
        <div className="dash-head">
          <div>
            <p className="eyebrow">AFFILIATE ACCOUNT</p>
            <h1>Hello, {user.name}.</h1>
          </div>
          <div className="dash-actions"><Link className="settings-link" href="/affiliate/settings">Settings</Link><AccountActions /></div>
        </div>
        <div className="dashboard-tabs"><Link className="active" href="/affiliate/dashboard">Overview</Link><Link href="/affiliate/settings">Payout settings</Link><span>Commission rate <strong>10%</strong></span></div>
        <ReferralCredentials link={link} code={user.code} />
        <section className="dash-metrics">
          <div>
            <small>Referred signups</small>
            <strong>{totals.registrations}</strong>
            <span>Attributed to your account</span>
          </div>
          <div>
            <small>Converted customers</small>
            <strong>{totals.conversions || 0}</strong>
            <span>Paid subscriptions</span>
          </div>
          <div>
            <small>Total earned</small>
            <strong>₦{(earnings / 100).toLocaleString()}</strong>
            <span>Confirmed commission</span>
          </div>
          <div>
            <small>Ready to withdraw</small>
            <strong>₦{(available / 100).toLocaleString()}</strong>
            <span>{pending ? `₦${(pending / 100).toLocaleString()} pending` : "No payout requested"}</span>
          </div>
        </section>
        <section className="dash-panels">
          <div id="referrals">
            <h2>Referral activity</h2>
            {referrals.length ? (
              referrals.map((r, i) => (
                <div className="referral-row" key={i}>
                  <span><strong>{r.product}</strong><small>{r.created_at.slice(0, 10)}</small></span>
                  <span className={`status-pill ${r.status}`}>{r.status === "converted" ? "Subscribed" : "Signed up"}</span>
                  <span>{r.commission ? `₦${(r.commission / 100).toLocaleString()}` : "—"}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>No attributed registrations yet</h3>
                <p>
                  Confirmed registrations will appear here when product tracking
                  is connected.
                </p>
              </div>
            )}
          </div>
          <div id="payouts">
            <h2>Payouts</h2>
            <p className="fine">You earn 10% of every qualifying paid subscription. Request a payout anytime after your approved balance reaches ₦50,000. Requests are reviewed and paid manually within {PAYOUT_PROCESSING_DAYS} business days.</p>
            <div className="payout-line"><span>Available balance</span><strong>₦{(available / 100).toLocaleString()}</strong></div>
            <PayoutAction disabled={available < PAYOUT_MINIMUM_MINOR} />
            {payouts.map((p, i) => <p className="fine payout-history" key={i}>₦{(p.amount / 100).toLocaleString()} · {p.status} · {p.created_at.slice(0, 10)}</p>)}
          </div>
        </section>
        <footer className="dashboard-footer"><span>Affiliate program · 10% commission on qualifying subscriptions</span><Link href="/privacy">Privacy & terms</Link></footer>
        </div>
      </main>
    </>
  );
}
