import Link from "next/link";
import SiteFooter from "../../components/site-footer";
export const metadata = { title: "Privacy Policy — Tova ERP" };
export default function Page() {
  return (
    <>
    <main className="legal-page">
      <Link href="/">← Tova ERP home</Link>
      <p className="eyebrow">TRUST CENTER</p>
      <h1>Privacy Policy</h1>
      <p>Last updated: March 11, 2026</p>
      <article>
        <p>
          This Privacy Policy explains how Tova collects, uses, and protects
          personal and organizational data processed through the fixed asset
          management platform.
        </p>
        <h2>1. Data We Collect</h2>
        <p>
          We collect account details, organization profile information, asset
          records, workflow events, and usage logs required to provide and
          secure the service.
        </p>
        <h2>2. How We Use Data</h2>
        <p>
          Data is used to deliver core platform functionality, maintain
          security, process subscriptions, improve product quality, and provide
          operational reporting.
        </p>
        <h2>3. Security Measures</h2>
        <p>
          We apply access controls, authentication safeguards, logging, and
          transport-layer protections to reduce unauthorized access risk.
        </p>
        <h2>4. Data Retention</h2>
        <p>
          We retain data as long as needed for active service delivery,
          compliance obligations, and dispute handling, then delete or anonymize
          where applicable.
        </p>
        <h2>5. Data Sharing</h2>
        <p>
          We do not sell personal data. Limited sharing may occur with payment
          providers and infrastructure vendors strictly for service operation.
        </p>
        <h2>6. Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your personal data,
          subject to legal and contractual obligations.
        </p>
        <h2>7. Contact</h2>
        <p>For privacy requests, contact support@tova.com.ng.</p>
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
