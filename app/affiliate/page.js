import Link from "next/link";
import AffiliateForm from "../../components/affiliate-form";
import SiteFooter from "../../components/site-footer";
export const metadata = { title: "Affiliate registration — Tova ERP" };
export default function Affiliate() {
  return (
    <>
      <header className="app-header">
        <Link className="logo" href="/">
          Tova ERP
        </Link>
        <nav>
          <Link href="/#products">Products</Link>
          <Link href="/affiliate/login">Affiliate login</Link>
        </nav>
      </header>
      <main className="auth-layout">
        <section className="auth-copy">
          <p className="eyebrow">TOVA AFFILIATE PROGRAM</p>
          <h1>Introduce businesses to Tova.</h1>
          <p>
            Share one simple link, bring the right businesses to Tova, and earn
            10% of every qualifying subscription from your referrals.
          </p>
          <div className="affiliate-rate"><strong>10%</strong><span>commission on every referred subscription</span></div>
          <div className="auth-points">
            <span>
              <b>01</b>Register and verify your email
            </span>
            <span>
              <b>02</b>Get your referral code and link
            </span>
            <span>
              <b>03</b>See signups, subscriptions, and earnings
            </span>
            <span>
              <b>04</b>Request a payout when your balance is ready
            </span>
          </div>
        </section>
        <AffiliateForm signup />
      </main>
      <SiteFooter />
    </>
  );
}
