import Link from "next/link";
import AccountActions from "./account-actions";

const navigation = [
  ["dashboard", "Overview", "◈", "/affiliate/dashboard"],
  ["referrals", "Referrals", "↗", "/affiliate/referrals"],
  ["payouts", "Earnings & payouts", "₦", "/affiliate/payouts"],
  ["settings", "Settings", "⚙", "/affiliate/settings"],
];

export default function AffiliatePortalShell({
  user,
  active,
  eyebrow = "PARTNER PORTAL",
  title,
  children,
}) {
  return (
    <main className="portal-shell">
      <aside className="portal-sidebar">
        <p className="sidebar-label">PARTNER PORTAL</p>
        <nav className="sidebar-nav" aria-label="Affiliate portal">
          {navigation.map(([key, label, icon, href]) => (
            <Link className={active === key ? "active" : ""} href={href} key={key}>
              <span aria-hidden="true">{icon}</span>{label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>Need help?</p>
          <a href="mailto:support@tova.com.ng">Contact partner support →</a>
        </div>
      </aside>
      <section className="portal-content">
        <header className="portal-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          <div className="portal-actions">
            <Link className="settings-link" href="/affiliate/settings">
              Settings
            </Link>
            <AccountActions />
          </div>
        </header>
        {children}
        <footer className="dashboard-footer">
          <span>Affiliate program · 20% commission after VAT exclusion</span>
          <Link href="/privacy">Privacy & terms</Link>
        </footer>
      </section>
    </main>
  );
}
