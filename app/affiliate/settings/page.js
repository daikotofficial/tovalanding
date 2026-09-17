import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import AccountActions from "../../../components/account-actions";
import BrandLogo from "../../../components/brand-logo";
import PayoutSettings from "../../../components/payout-settings";
import PasswordSettings from "../../../components/password-settings";

export const metadata = { title: "Payout settings — Tova ERP" };

export default async function Settings() {
  const user = await currentUser();
  if (!user) redirect("/affiliate/login");
  return <>
    <header className="app-header"><Link className="logo" href="/"><BrandLogo /></Link><nav><Link href="/affiliate/dashboard">Dashboard</Link><AccountActions /></nav></header>
    <main className="settings-page">
      <Link className="back-link" href="/affiliate/dashboard">← Back to dashboard</Link>
      <p className="eyebrow">ACCOUNT SETTINGS</p><h1>Payout settings</h1>
      <p className="settings-lead">Keep your payment details ready so approved commissions can be processed without delays.</p>
      <section className="settings-card"><h2>How should we pay you?</h2><PayoutSettings /></section>
      <section className="settings-card"><h2>Security</h2><p className="settings-note">Change your password regularly. Updating it signs out every other active session.</p><PasswordSettings /></section>
      <section className="settings-card profile-card"><h2>Profile</h2><div className="profile-grid"><span><small>Name</small><strong>{user.name}</strong></span><span><small>Email</small><strong>{user.email}</strong></span><span><small>Referral code</small><strong>{user.code}</strong></span></div></section>
    </main>
  </>;
}
