import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import db from "../../../lib/db";
import AccountActions from "../../../components/account-actions";
import BrandLogo from "../../../components/brand-logo";

function date(value) {
  return value ? String(value).slice(0, 10) : "—";
}

export default async function ReferralsPage() {
  const user = await currentUser();
  if (!user) redirect("/affiliate/login");
  const referrals = await db
    .prepare(
      "SELECT r.product,r.referred_name,r.referred_email,r.status,r.created_at,r.subscription_expires_at,c.amount,c.status AS commission_status FROM referrals r LEFT JOIN commissions c ON c.referral_id=r.id WHERE r.affiliate_id=? ORDER BY r.id DESC",
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
            <Link className="active" href="/affiliate/referrals">
              <span>↗</span>Referrals
            </Link>
            <Link href="/affiliate/payouts">
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
              <h1>Your referrals.</h1>
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
            <Link className="active" href="/affiliate/referrals">
              Referrals
            </Link>
            <Link href="/affiliate/payouts">Earnings & payouts</Link>
          </div>
          <section className="dash-panels single-panel">
            <div>
              <h2>Referral activity</h2>
              {referrals.length ? (
                referrals.map((r, i) => (
                  <div className="referral-row" key={i}>
                    <span>
                      <strong>{r.referred_name || "Referred customer"}</strong>
                      <small>
                        {r.referred_email || "Email unavailable"} · {r.product}{" "}
                        · Joined {date(r.created_at)}
                        {r.subscription_expires_at
                          ? ` · Expires ${date(r.subscription_expires_at)}`
                          : ""}
                      </small>
                    </span>
                    <span className={`status-pill ${r.status}`}>
                      {r.status === "converted" ? "Subscribed" : "Signed up"}
                    </span>
                    <span>
                      {r.amount
                        ? `₦${(r.amount / 100).toLocaleString()} ${r.commission_status === "approved" ? "approved" : "pending"}`
                        : "—"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <h3>No referrals yet</h3>
                  <p>People who sign up through your links will appear here.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
