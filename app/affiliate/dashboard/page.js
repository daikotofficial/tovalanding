import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import db from "../../../lib/db";
import AccountActions from "../../../components/account-actions";
import AffiliatePortalShell from "../../../components/affiliate-portal-shell";
import PayoutAction from "../../../components/payout-action";
import ReferralCredentials from "../../../components/referral-credentials";
import {
  PAYOUT_MINIMUM_MINOR,
  PAYOUT_PROCESSING_DAYS,
} from "../../../lib/payout-policy";
import { affiliateProducts } from "../../../lib/products";

function formatDate(value) {
  if (!value) return "—";
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function productName(key) {
  return affiliateProducts.find((product) => product.key === key)?.name || key;
}

export default async function Dashboard() {
  const user = await currentUser();
  if (!user) redirect("/affiliate/login");
  const referrals = await db
    .prepare(
      "SELECT r.product,r.referred_name,r.referred_company,r.referred_email,r.subscription_expires_at,r.status,r.created_at,COALESCE(SUM(CASE WHEN c.status IN ('pending','approved') THEN c.amount ELSE 0 END),0) AS commission,CASE WHEN SUM(CASE WHEN c.status='approved' THEN 1 ELSE 0 END)>0 THEN 'approved' WHEN SUM(CASE WHEN c.status='pending' THEN 1 ELSE 0 END)>0 THEN 'pending' WHEN COUNT(c.id)>0 THEN 'rejected' ELSE NULL END AS commission_status FROM referrals r LEFT JOIN commissions c ON c.referral_id=r.id WHERE r.affiliate_id=? GROUP BY r.id ORDER BY r.id DESC LIMIT 50",
    )
    .all(user.id);
  const totals = await db
    .prepare(
      "SELECT COUNT(*) AS registrations, SUM(CASE WHEN status='converted' THEN 1 ELSE 0 END) AS conversions FROM referrals WHERE affiliate_id=?",
    )
    .get(user.id);
  const earnings = (
    await db
      .prepare(
        "SELECT COALESCE(SUM(amount),0) AS amount FROM commissions WHERE affiliate_id=? AND status IN ('pending','approved')",
      )
      .get(user.id)
  ).amount;
  const pending = (
    await db
      .prepare(
        "SELECT COALESCE(SUM(amount),0) AS amount FROM payouts WHERE affiliate_id=? AND status IN ('requested','approved')",
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
  const available = (
    await db
      .prepare(
        "SELECT COALESCE(SUM(c.amount),0) AS amount FROM commissions c WHERE c.affiliate_id=? AND c.status='approved' AND c.id NOT IN (SELECT commission_id FROM payout_commissions)",
      )
      .get(user.id)
  ).amount;
  const payouts = await db
    .prepare(
      "SELECT amount,status,created_at FROM payouts WHERE affiliate_id=? ORDER BY id DESC LIMIT 5",
    )
    .all(user.id);
  const link = process.env.APP_URL + "/r/" + user.code;
  const productLinks = affiliateProducts.map((product) => ({
    name: product.name,
    link: `${process.env.APP_URL}/r/${encodeURIComponent(user.code)}?product=${product.key}`,
  }));
  if (user.status === "pending") {
    return (
      <>
        <header className="app-header">
          <span className="logo">
            <span className="brand-wordmark">tova</span>
          </span>
          <AccountActions />
        </header>
        <main className="review-page">
          <p className="eyebrow">AFFILIATE APPLICATION</p>
          <h1>Your application is under review.</h1>
          <p>
            Thank you for applying, {user.name}. Our team will review your
            profile before referral access is issued.
          </p>
          <div className="review-status">
            <strong>Referral access is not active yet.</strong>
            <span>
              Links, codes, and commission tracking become available after
              approval.
            </span>
          </div>
          <Link className="button dark" href="/">
            Return to Tova ERP
          </Link>
        </main>
      </>
    );
  }
  return (
    <AffiliatePortalShell
      user={user}
      active="dashboard"
      eyebrow="AFFILIATE ACCOUNT"
      title={`Hello, ${user.name}.`}
    >
      <ReferralCredentials
        link={link}
        code={user.code}
        productLinks={productLinks}
      />
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
          <small>Total accrued</small>
          <strong>₦{(earnings / 100).toLocaleString()}</strong>
          <span>Pending and approved commission</span>
        </div>
        <div>
          <small>Ready to withdraw</small>
          <strong>₦{(available / 100).toLocaleString()}</strong>
          <span>
            {pending
              ? `₦${(pending / 100).toLocaleString()} pending`
              : "No payout requested"}
          </span>
        </div>
        <div>
          <small>Total paid out</small>
          <strong>₦{(paidOut / 100).toLocaleString()}</strong>
          <span>Successfully settled</span>
        </div>
      </section>
      <section className="dash-panels">
        <div>
          <h2>Referral activity</h2>
          {referrals.length ? (
            referrals.map((r, i) => (
              <div className="referral-row" key={i}>
                <span>
                  <strong>{productName(r.product)}</strong>
                  <small>
                    {r.referred_name ||
                      r.referred_company ||
                      "Customer identity pending"}{" "}
                    {r.referred_name && r.referred_company
                      ? `· ${r.referred_company}`
                      : ""}{" "}
                    · {r.referred_email || "Email pending"} · Product:{" "}
                    {productName(r.product)} · Joined {formatDate(r.created_at)}{" "}
                    ·{" "}
                    {r.subscription_expires_at
                      ? `Expires ${formatDate(r.subscription_expires_at)}`
                      : "Expiry pending"}
                  </small>
                </span>
                <span className={`status-pill ${r.status}`}>
                  {r.status === "converted" ? "Subscribed" : "Signed up"}
                </span>
                <span>
                  {r.commission
                    ? `₦${(r.commission / 100).toLocaleString()} ${r.commission_status === "approved" ? "approved" : "pending"}`
                    : "—"}
                </span>
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
        <div>
          <h2>Payouts</h2>
          <p className="fine">
            You earn 20% on every qualifying paid subscription. Request a payout
            anytime after your approved balance reaches ₦50,000. Requests are
            reviewed and paid manually within {PAYOUT_PROCESSING_DAYS} business
            days.
          </p>
          <div className="payout-line">
            <span>Available balance</span>
            <strong>₦{(available / 100).toLocaleString()}</strong>
          </div>
          <PayoutAction disabled={available < PAYOUT_MINIMUM_MINOR} />
          {payouts.map((p, i) => (
            <p className="fine payout-history" key={i}>
              ₦{(p.amount / 100).toLocaleString()} · {p.status} ·{" "}
              {formatDate(p.created_at)}
            </p>
          ))}
        </div>
      </section>
    </AffiliatePortalShell>
  );
}
