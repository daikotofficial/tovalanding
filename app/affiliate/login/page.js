import Link from "next/link";
import AffiliateForm from "../../../components/affiliate-form";
import SiteFooter from "../../../components/site-footer";
export const metadata = { title: "Affiliate login — Tova ERP" };
export default function Login() {
  return (
    <>
      <header className="app-header">
        <Link className="logo" href="/">
          Tova ERP
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
