import Link from "next/link";
import SiteFooter from "../../components/site-footer";
export const metadata = { title: "Terms of Service — Tova ERP" };
export default function Page() {
  return (
    <>
    <main className="legal-page">
      <Link href="/">← Tova ERP home</Link>
      <p className="eyebrow">TRUST CENTER</p>
      <h1>Terms of Service</h1>
      <p>Last updated: March 11, 2026</p>
      <article>
        <p>
          These Terms of Service govern your access to and use of the Tova fixed
          asset management platform. By using the platform, you agree to these
          terms.
        </p>
        <h2>1. Account and Access</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          credentials and for all activity under your account. You must provide
          accurate information during onboarding and keep it updated.
        </p>
        <h2>2. Acceptable Use</h2>
        <p>
          You may not use the service for unlawful activities, unauthorized
          access attempts, or actions that disrupt service availability or
          security.
        </p>
        <h2>3. Data Ownership</h2>
        <p>
          Your organization retains ownership of asset and operational data
          entered into the platform. You grant Tova permission to process this
          data solely to provide the service.
        </p>
        <h2>4. Subscription and Billing</h2>
        <p>
          Paid features are governed by active subscription status. Failure to
          renew may restrict access to protected features until billing is
          restored.
        </p>
        <h2>5. Availability and Changes</h2>
        <p>
          We may improve, modify, or discontinue features to maintain
          reliability and security. Planned material changes will be
          communicated through in-app notices or email.
        </p>
        <h2>6. Limitation of Liability</h2>
        <p>
          The service is provided on an as-available basis. To the maximum
          extent permitted by law, Tova is not liable for indirect, incidental,
          or consequential damages.
        </p>
        <h2>7. Contact</h2>
        <p>For legal or contractual inquiries, contact support@tova.com.ng.</p>
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
