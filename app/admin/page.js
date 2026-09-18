import Link from "next/link";
import { redirect } from "next/navigation";
import { currentSuperadmin } from "../../lib/superadmin";
import db from "../../lib/db";
import { decryptPayoutValue } from "../../lib/secure-data";
import { affiliateProducts } from "../../lib/products";
import AdminReviewActions from "../../components/admin-review-actions";
import AdminPayoutAction from "../../components/admin-payout-action";
import AdminUserForm from "../../components/admin-user-form";
import AdminUserActions from "../../components/admin-user-actions";
import AdminCommissionAction from "../../components/admin-commission-action";
import AdminReferralDeleteAction from "../../components/admin-referral-delete-action";
import BrandLogo from "../../components/brand-logo";

const views = [
  ["overview", "Overview", "◈"],
  ["applications", "Applications", "◌"],
  ["affiliates", "Affiliates", "♙"],
  ["referrals", "Referrals", "↗"],
  ["commissions", "Commissions", "%"],
  ["payouts", "Payouts", "₦"],
  ["administrators", "Administrators", "♙"],
  ["audit", "Audit log", "≡"],
  ["settings", "System settings", "⚙"],
];

function formatDate(value, length = 10) {
  if (!value) return "—";
  const text = value instanceof Date ? value.toISOString() : String(value);
  return text.slice(0, length).replace("T", " ");
}

function productName(key) {
  return affiliateProducts.find((product) => product.key === key)?.name || key;
}

async function AffiliateTable({ rows }) {
  const details = await Promise.all(
    rows.map(async (row) => ({
      row,
      referrals: await db
        .prepare(
          "SELECT product,referred_name,referred_company,referred_email,source,status,subscription_expires_at,created_at FROM referrals WHERE affiliate_id=? ORDER BY id DESC LIMIT 10",
        )
        .all(row.id),
      payouts: await db
        .prepare(
          "SELECT id,amount,status,created_at FROM payouts WHERE affiliate_id=? ORDER BY id DESC LIMIT 10",
        )
        .all(row.id),
    })),
  );
  return (
    <section className="admin-table-card">
      <div className="admin-table-head">
        <span>Affiliate</span>
        <span>Status</span>
        <span>Location</span>
        <span>Referrals</span>
        <span>Access</span>
        <span />
      </div>
      {details.map(({ row, referrals, payouts }) => (
        <div className="admin-row" key={row.id}>
          <span>
            <strong>{row.name}</strong>
            <small>{row.email}</small>
            <small>
              {row.phone || "No phone provided"} ·{" "}
              {row.channel || "No channel selected"}
            </small>
          </span>
          <span>
            <b className={`admin-status-badge ${row.status}`}>{row.status}</b>
          </span>
          <span>{row.location || "Not provided"}</span>
          <span>
            {row.referrals}
            <small>₦{(row.earnings / 100).toLocaleString()} accrued</small>
            <small>₦{(row.paid_out / 100).toLocaleString()} paid out</small>
          </span>
          <span>{row.status === "active" ? row.code : "Not issued"}</span>
          <AdminReviewActions id={row.id} status={row.status} />
          <details className="admin-affiliate-details">
            <summary>View profile, referrals & payouts</summary>
            <div className="admin-detail-grid">
              <div>
                <strong>Profile</strong>
                <span>{row.email}</span>
                <span>{row.phone || "No phone provided"}</span>
                <span>{row.location || "No location"}</span>
                <span>Applied {formatDate(row.created_at)}</span>
              </div>
              <div>
                <strong>Bank details</strong>
                <span>
                  {row.payout_bank_name
                    ? decryptPayoutValue(row.payout_bank_name)
                    : "Not provided"}
                </span>
                <span>
                  {row.payout_account_name
                    ? decryptPayoutValue(row.payout_account_name)
                    : "—"}
                </span>
                <span>
                  {row.payout_account_number
                    ? "••••" +
                      decryptPayoutValue(row.payout_account_number).slice(-4)
                    : "—"}
                </span>
              </div>
              <div>
                <strong>Referral activity</strong>
                {referrals.map((item) => (
                  <span key={item.product + item.created_at}>
                    {productName(item.product)} ·{" "}
                    {item.referred_name ||
                      item.referred_company ||
                      "Customer identity pending"}{" "}
                    {item.referred_name && item.referred_company
                      ? `· ${item.referred_company} `
                      : ""}
                    · {item.referred_email || "Email pending"} · {item.status}
                    {item.subscription_expires_at
                      ? ` · Expires ${formatDate(item.subscription_expires_at)}`
                      : ""}
                  </span>
                ))}
              </div>
              <div>
                <strong>Payout history</strong>
                <span>
                  Total accrued: ₦{(row.earnings / 100).toLocaleString()}
                </span>
                <span>
                  Total paid: ₦{(row.paid_out / 100).toLocaleString()}
                </span>
                {payouts.map((item) => (
                  <span key={item.id}>
                    ₦{(item.amount / 100).toLocaleString()} ·{" "}
                    <AdminPayoutAction id={item.id} status={item.status} /> ·{" "}
                    {formatDate(item.created_at)}
                  </span>
                ))}
              </div>
            </div>
          </details>
        </div>
      ))}
    </section>
  );
}

export default async function Admin({ searchParams }) {
  const actor = await currentSuperadmin();
  if (!actor) redirect("/admin/login");
  const requested = (await searchParams)?.view;
  const view = views.some(([key]) => key === requested)
    ? requested
    : "overview";
  const rows = await db
    .prepare(
      "SELECT id,name,email,phone,location,channel,code,status,verified,created_at,payout_account_name,payout_account_number,payout_bank_name,(SELECT COUNT(*) FROM referrals r WHERE r.affiliate_id=a.id) AS referrals,(SELECT COALESCE(SUM(c.amount),0) FROM commissions c WHERE c.affiliate_id=a.id AND c.status IN ('pending','approved')) AS earnings,(SELECT COALESCE(SUM(c.amount),0) FROM commissions c WHERE c.affiliate_id=a.id AND c.status='approved') AS approved_earnings,(SELECT COALESCE(SUM(p.amount),0) FROM payouts p WHERE p.affiliate_id=a.id AND p.status='paid') AS paid_out FROM affiliates a ORDER BY CASE WHEN status='pending' THEN 0 WHEN status='active' THEN 1 ELSE 2 END,id DESC LIMIT 200",
    )
    .all();
  const pendingCount = rows.filter((row) => row.status === "pending").length;
  const activeCount = rows.filter((row) => row.status === "active").length;
  const referralRows = await db
    .prepare(
      "SELECT r.id,r.affiliate_id,r.product,r.referred_name,r.referred_company,r.referred_email,r.source,r.status,r.subscription_expires_at,r.created_at,a.name AS affiliate,a.email AS affiliate_email FROM referrals r JOIN affiliates a ON a.id=r.affiliate_id ORDER BY a.name COLLATE NOCASE,r.id DESC LIMIT 500",
    )
    .all();
  const referralGroups = referralRows.reduce((groups, row) => {
    const key = String(row.affiliate_id);
    const group = groups.get(key) || {
      affiliate: row.affiliate,
      email: row.affiliate_email,
      referrals: [],
    };
    group.referrals.push(row);
    groups.set(key, group);
    return groups;
  }, new Map());
  const payoutRows = await db
    .prepare(
      "SELECT p.id,p.amount,p.status,p.created_at,a.name AS affiliate,a.email,a.payout_bank_name,a.payout_account_number FROM payouts p JOIN affiliates a ON a.id=p.affiliate_id ORDER BY p.id DESC LIMIT 200",
    )
    .all();
  const commissionRows = await db
    .prepare(
      "SELECT c.id,c.amount,c.currency,c.status,c.created_at,r.product,a.name AS affiliate,a.email FROM commissions c JOIN referrals r ON r.id=c.referral_id JOIN affiliates a ON a.id=c.affiliate_id ORDER BY c.id DESC LIMIT 200",
    )
    .all();
  const auditLogs = await db
    .prepare(
      "SELECT actor_email,action,target_type,target_id,created_at FROM audit_logs ORDER BY id DESC LIMIT 100",
    )
    .all();
  const adminUsers =
    actor.role === "superadmin"
      ? await db
          .prepare(
            "SELECT id,email,status,created_at FROM admin_users ORDER BY id DESC",
          )
          .all()
      : [];
  const title = views.find(([key]) => key === view)?.[1];
  return (
    <>
      <header className="app-header admin-topbar">
        <Link className="logo" href="/">
          <BrandLogo />
        </Link>
        <div className="admin-header-actions">
          <span>
            {actor.role === "superadmin" ? "Superadmin" : "Administrator"}
          </span>
          <Link href="/affiliate/dashboard">Affiliate dashboard</Link>
          <form action="/api/admin/auth/logout" method="post">
            <button>Sign out</button>
          </form>
        </div>
      </header>
      <main className="admin-shell">
        <aside className="admin-sidebar">
          <p className="admin-brand-label">PARTNER OPERATIONS</p>
          <nav>
            {views.map(([key, label, icon]) => (
              <Link
                className={view === key ? "active" : ""}
                href={`/admin?view=${key}`}
                key={key}
              >
                <span>{icon}</span>
                {label}
                {key === "applications" && pendingCount > 0 && (
                  <b>{pendingCount}</b>
                )}
              </Link>
            ))}
          </nav>
          <div className="admin-sidebar-foot">
            Affiliate operations
            <br />
            Internal use only
          </div>
        </aside>
        <section className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="eyebrow">AFFILIATE ADMINISTRATION</p>
              <h1>{title}</h1>
              <p>
                {view === "overview"
                  ? "Monitor partner activity, approvals, referrals, and manual settlements."
                  : `Manage ${title.toLowerCase()} from the partner operations console.`}
              </p>
            </div>
          </div>
          {view === "overview" && (
            <>
              <div className="admin-summary-grid">
                <div>
                  <small>Pending applications</small>
                  <strong>{pendingCount}</strong>
                  <span>Require review</span>
                </div>
                <div>
                  <small>Active affiliates</small>
                  <strong>{activeCount}</strong>
                  <span>Referral access enabled</span>
                </div>
                <div>
                  <small>Tracked referrals</small>
                  <strong>{referralRows.length}</strong>
                  <span>Latest 200 records</span>
                </div>
                <div>
                  <small>Open payouts</small>
                  <strong>
                    {
                      payoutRows.filter((p) =>
                        ["requested", "approved"].includes(p.status),
                      ).length
                    }
                  </strong>
                  <span>Manual processing queue</span>
                </div>
              </div>
              <h2 className="admin-section-title">
                Applications requiring attention
              </h2>
              <AffiliateTable
                rows={rows
                  .filter((row) => row.status === "pending")
                  .slice(0, 10)}
              />
            </>
          )}
          {view === "applications" && (
            <AffiliateTable
              rows={rows.filter((row) => row.status === "pending")}
            />
          )}
          {view === "affiliates" && <AffiliateTable rows={rows} />}
          {view === "referrals" && (
            <div className="admin-referral-groups">
              {[...referralGroups.entries()].map(([affiliateId, group]) => (
                <section
                  className="admin-list-card admin-referral-group"
                  key={affiliateId}
                >
                  <div className="admin-referral-group-heading">
                    <div>
                      <strong>{group.affiliate}</strong>
                      <small>{group.email}</small>
                    </div>
                    <span>
                      {group.referrals.length} referral
                      {group.referrals.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="admin-list-heading">
                    <span>Product</span>
                    <span>Referred person</span>
                    <span>Source</span>
                    <span>Status</span>
                    <span>Date</span>
                    <span>Action</span>
                  </div>
                  {group.referrals.map((row) => (
                    <div className="admin-list-row" key={row.id}>
                      <span>{productName(row.product)}</span>
                      <span>
                        {row.referred_name ||
                          row.referred_company ||
                          "Customer identity pending"}
                        <small>
                          {row.referred_email || "Email unavailable"}
                          {row.referred_name && row.referred_company
                            ? ` · ${row.referred_company}`
                            : ""}
                        </small>
                      </span>
                      <span>{row.source}</span>
                      <span>
                        {row.status}
                        {row.subscription_expires_at
                          ? ` · Expires ${formatDate(row.subscription_expires_at)}`
                          : ""}
                      </span>
                      <span>{formatDate(row.created_at)}</span>
                      <AdminReferralDeleteAction
                        id={row.id}
                        label={`${row.referred_name || row.referred_company || "this referral"} (${productName(row.product)})`}
                      />
                    </div>
                  ))}
                </section>
              ))}
              {!referralGroups.size && (
                <p className="admin-empty">
                  No referrals have been captured yet.
                </p>
              )}
            </div>
          )}
          {view === "commissions" && (
            <>
              <p className="admin-workflow-note">
                <strong>Commission approval</strong> confirms that an earned
                commission is eligible for payout. It does not send money.
                Process approved payout requests separately from the{" "}
                <strong>Payouts</strong> section.
              </p>
              <section className="admin-list-card">
                <div className="admin-list-heading">
                  <span>Affiliate</span>
                  <span>Product</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span>Date</span>
                  <span>Action</span>
                </div>
                {commissionRows.map((row) => (
                  <div className="admin-list-row" key={row.id}>
                    <span>
                      <strong>{row.affiliate}</strong>
                      <small>{row.email}</small>
                    </span>
                    <span>{productName(row.product)}</span>
                    <span>₦{(row.amount / 100).toLocaleString()}</span>
                    <span>{row.status}</span>
                    <span>{formatDate(row.created_at)}</span>
                    <span>
                      <AdminCommissionAction id={row.id} status={row.status} />
                    </span>
                  </div>
                ))}
              </section>
            </>
          )}
          {view === "payouts" && (
            <>
              <p className="admin-workflow-note">
                <strong>Payout processing</strong> is where money sent to an
                affiliate is recorded. Confirm the transfer, then choose{" "}
                <strong>Mark paid</strong>. This updates the affiliate’s paid
                total and payout history.
              </p>
              <section className="admin-list-card">
                <div className="admin-list-heading">
                  <span>Affiliate</span>
                  <span>Amount</span>
                  <span>Bank</span>
                  <span>Account</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                {payoutRows.map((row) => (
                  <div className="admin-list-row" key={row.id}>
                    <span>
                      <strong>{row.affiliate}</strong>
                      <small>{row.email}</small>
                    </span>
                    <span>₦{(row.amount / 100).toLocaleString()}</span>
                    <span>
                      {row.payout_bank_name
                        ? decryptPayoutValue(row.payout_bank_name)
                        : "Not provided"}
                    </span>
                    <span>
                      {row.payout_account_number
                        ? "••••" +
                          decryptPayoutValue(row.payout_account_number).slice(
                            -4,
                          )
                        : "Not provided"}
                    </span>
                    <span>{row.status}</span>
                    <span>
                      <AdminPayoutAction id={row.id} status={row.status} />
                    </span>
                  </div>
                ))}
              </section>
            </>
          )}
          {view === "administrators" &&
            (actor.role === "superadmin" ? (
              <section className="admin-tools">
                <h2>
                  Administrator access <small>Superadmin only</small>
                </h2>
                <p>
                  Add trusted staff administrators. They can review affiliates
                  and process payouts, but cannot add other administrators.
                </p>
                <AdminUserForm />
                <div className="admin-user-list">
                  {adminUsers.map((admin) => (
                    <div key={admin.email}>
                      <span>
                        <strong>{admin.email}</strong>
                        <em>
                          {admin.status} · {formatDate(admin.created_at)}
                        </em>
                      </span>
                      <AdminUserActions id={admin.id} status={admin.status} />
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <p className="admin-empty">
                Only the superadmin can manage administrator accounts.
              </p>
            ))}
          {view === "audit" && (
            <section className="admin-list-card">
              <div className="admin-list-heading">
                <span>Actor</span>
                <span>Action</span>
                <span>Target</span>
                <span>Date</span>
              </div>
              {auditLogs.map((row, i) => (
                <div
                  className="admin-list-row audit-row"
                  key={row.actor_email + row.created_at + i}
                >
                  <span>{row.actor_email}</span>
                  <span>{row.action}</span>
                  <span>
                    {row.target_type} · {row.target_id}
                  </span>
                  <span>{formatDate(row.created_at, 16)}</span>
                </div>
              ))}
            </section>
          )}
          {view === "settings" && (
            <section className="admin-tools system-settings">
              <h2>Deployment configuration</h2>
              <p>
                These values are managed in the server environment, not edited
                in the browser.
              </p>
              <div className="system-setting-row">
                <span>
                  <strong>Superadmin credentials</strong>
                  <small>Environment-controlled administrator login</small>
                </span>
                <b
                  className={`system-status ${process.env.SUPERADMIN_EMAIL && process.env.SUPERADMIN_PASSWORD ? "configured" : "missing"}`}
                >
                  {process.env.SUPERADMIN_EMAIL &&
                  process.env.SUPERADMIN_PASSWORD
                    ? "Configured"
                    : "Missing credentials"}
                </b>
              </div>
              <div className="system-setting-row">
                <span>
                  <strong>Payout data protection</strong>
                  <small>Encryption for affiliate bank details</small>
                </span>
                <b
                  className={`system-status ${process.env.PAYOUT_ENCRYPTION_KEY ? "configured" : "missing"}`}
                >
                  {process.env.PAYOUT_ENCRYPTION_KEY
                    ? "Configured"
                    : "Missing key"}
                </b>
              </div>
              <div className="system-setting-row">
                <span>
                  <strong>Product event authentication</strong>
                  <small>Server-to-server referral and payment events</small>
                </span>
                <b
                  className={`system-status ${process.env.INTEGRATION_API_KEY || process.env.INTEGRATION_KEYS_JSON ? "configured" : "missing"}`}
                >
                  {process.env.INTEGRATION_API_KEY ||
                  process.env.INTEGRATION_KEYS_JSON
                    ? "Configured"
                    : "Missing key"}
                </b>
              </div>
              <div className="system-setting-row">
                <span>
                  <strong>Application origin</strong>
                  <small>Canonical public URL</small>
                </span>
                <strong className="system-value">{process.env.APP_URL}</strong>
              </div>
              <p className="settings-note">
                Secret values are intentionally never displayed in this panel.
                Replace local values before deployment.
              </p>
            </section>
          )}
        </section>
      </main>
    </>
  );
}
