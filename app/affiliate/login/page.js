import Link from "next/link";
import AffiliateForm from "../../../components/affiliate-form";
import SiteFooter from "../../../components/site-footer";
import BrandLogo from "../../../components/brand-logo";
export const metadata = { title: "Affiliate login — Tova ERP" };
export default function Login() {
  return (
    <>
      <header className="app-header">
        <Link className="logo" href="/">
          <BrandLogo />
        </Link>
        <Link href="/affiliate">Join the affiliate program →</Link>
      </header>
      <main className="login-page">
        <AffiliateForm />
      </main>
      <SiteFooter />
    </>
  );
}
