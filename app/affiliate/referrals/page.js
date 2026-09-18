import { redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import db from "../../../lib/db";
import AffiliatePortalShell from "../../../components/affiliate-portal-shell";

function date(value) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(parsed);
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
    <AffiliatePortalShell user={user} active="referrals" title="Your referrals.">
          <section className="dash-panels single-panel">
            <div>
              <h2>Referral activity</h2>
              {referrals.length ? (
                referrals.map((r, i) => (
                  <div className="referral-row" key={i}>
                    <span>
                      <strong>{r.referred_name || "Referred customer"}</strong>
                      <small>
                        {r.referred_email || "Email unavailable"} · {r.product} · Joined {date(r.created_at)} · {r.subscription_expires_at ? `Expires ${date(r.subscription_expires_at)}` : "Expiry pending"}
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
    </AffiliatePortalShell>
  );
}
