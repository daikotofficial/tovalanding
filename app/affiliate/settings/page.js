import { redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import AffiliatePortalShell from "../../../components/affiliate-portal-shell";
import PayoutSettings from "../../../components/payout-settings";
import PasswordSettings from "../../../components/password-settings";

export const metadata = { title: "Payout settings — Tova ERP" };

export default async function Settings() {
  const user = await currentUser();
  if (!user) redirect("/affiliate/login");
  return <AffiliatePortalShell user={user} active="settings" eyebrow="ACCOUNT SETTINGS" title="Account settings.">
    <div className="settings-page portal-settings-page">
      <p className="settings-lead">Keep your payment details ready so approved commissions can be processed without delays.</p>
      <section className="settings-card"><h2>How should we pay you?</h2><PayoutSettings /></section>
      <section className="settings-card"><h2>Security</h2><p className="settings-note">Change your password regularly. Updating it signs out every other active session.</p><PasswordSettings /></section>
      <section className="settings-card profile-card"><h2>Profile</h2><div className="profile-grid"><span><small>Name</small><strong>{user.name}</strong></span><span><small>Email</small><strong>{user.email}</strong></span><span><small>Referral code</small><strong>{user.code}</strong></span></div></section>
    </div>
  </AffiliatePortalShell>;
}
