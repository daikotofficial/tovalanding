import Link from "next/link";
import SiteFooter from "../../components/site-footer";
export const metadata = { title: "Cookie Policy — Tova ERP" };
export default function Page() {
  return (
    <>
    <main className="legal-page">
      <Link href="/">← Tova ERP home</Link>
      <p className="eyebrow">TRUST CENTER</p>
      <h1>Cookie Policy</h1>
      <p>Last updated: March 11, 2026</p>
      <article>
        <p>
          This Cookie Policy explains how Tova uses cookies and related storage
          technologies on the platform.
        </p>
        <h2>1. Essential Cookies</h2>
        <p>
          We use essential cookies for secure sign-in, session continuity, CSRF
          protections, and account-level access controls.
        </p>
        <h2>2. Preference Storage</h2>
        <p>
          We store non-sensitive preferences such as UI state and printing
          configuration to improve workflow continuity.
        </p>
        <h2>3. Security and Performance</h2>
        <p>
          Cookies and browser storage may be used to protect against abuse,
          maintain reliability, and improve application performance.
        </p>
        <h2>4. Managing Cookies</h2>
        <p>
          You can control cookie behavior from browser settings. Disabling
          essential cookies may impact authentication and protected
          functionality.
        </p>
        <h2>5. Contact</h2>
        <p>For policy questions, contact support@tova.com.ng.</p>
      </article>
      <nav>
        <Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link>{" "}
        · <Link href="/cookies">Cookies</Link>
      </nav>
    </main>
    <SiteFooter />
    </>
  );
}
