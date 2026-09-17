import Link from "next/link";
import AffiliateForm from "../../../components/affiliate-form";
export const metadata = { title: "Affiliate login — Tova Solutions" };
export default function Login() {
  return (
    <>
      <header className="app-header">
        <Link className="logo" href="/">
          Tova Solutions
        </Link>
        <Link href="/affiliate">Join the affiliate program →</Link>
      </header>
      <main className="login-page">
        <AffiliateForm />
      </main>
    </>
  );
}
