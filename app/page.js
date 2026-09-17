import Link from "next/link";
import { cookies } from "next/headers";
import Pricing from "../components/pricing";
import MobileMenu from "../components/mobile-menu";
import SiteFooter from "../components/site-footer";
import BrandLogo from "../components/brand-logo";
const areas = [
  ["Financial Management", "Accounting, valuation, and statutory reports"],
  ["Operational Workflows", "Requests, approvals, and execution tracking"],
  [
    "Risk and Compliance",
    "Access policies, audit logs, and retention controls",
  ],
];
const products = [
  [
    "Fixed Asset Management",
    "Track acquisition, custody, movement, depreciation, and disposal with clean audit visibility.",
    "Live",
    "https://tovafixedasset.com.ng",
  ],
  [
    "Accounting and Finance",
    "Consolidate spend, valuation, and reporting views for finance and compliance teams.",
    "Live",
    "https://tovabooks.com.ng",
  ],
  [
    "POS and Inventory",
    "Run sales operations with stock intelligence, SKU controls, and reorder workflows.",
    "Live",
    "https://tovapos.com.ng",
  ],
  [
    "HR and Workforce",
    "Manage teams, structures, approvals, and employee operations from one connected workspace.",
    "Available Soon",
    "#",
  ],
  [
    "Procurement and Vendor Ops",
    "Centralize sourcing, vendor records, and purchase-linked governance at enterprise scale.",
    "Available Soon",
    "#",
  ],
  [
    "Barcode and QR Operations",
    "Scanning, labelling, and field workflows for operational teams.",
    "Available Soon",
    "#",
  ],
  [
    "Office Management",
    "Coordinate office administration, internal service requests, and workplace operations from one control layer.",
    "Available Soon",
    "#",
  ],
];
export default async function Home() {
  const referralCode = (await cookies()).get("tova_referral")?.value;
  const addReferralCode = (href) => {
    if (
      !referralCode ||
      !/^TOVA[A-HJ-NP-Z2-9]{6}$|^TV-[A-HJ-NP-Z2-9]{6}$|^TV-[A-HJ-NP-Z2-9]{8}$|^TV-[A-F0-9]{32}$/.test(
        referralCode,
      )
    )
      return href;
    const url = new URL(href);
    url.searchParams.set("ref", referralCode);
    return url.toString();
  };
  return (
    <>
      <header className="header">
        <Link className="logo" href="/">
          <BrandLogo />
        </Link>
        <nav>
          <Link href="#products">Products</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#why">Why Tova</Link>
          <a
            href="https://daikot.com.ng"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Us
          </a>
          <Link href="/affiliate">Affiliate program</Link>
          <a href="mailto:support@tova.com.ng">Support</a>
        </nav>
        <Link className="top-button" href="#products">
          View Product Suite <b>→</b>
        </Link>
        <MobileMenu />
      </header>
      <main id="main-content">
        <section className="hero">
          <div>
            <p className="eyebrow">● &nbsp; ERP SOFTWARE SUITE</p>
            <h1>ERP software built around real business functions.</h1>
            <p className="lead">
              Explore ERP applications for finance, fixed assets, inventory,
              workplace operations, and governed execution workflows across your
              organization.
            </p>
            <div className="hero-actions">
              <Link className="button dark" href="#products">
                Explore products <b>→</b>
              </Link>
              <a className="button outline" href="mailto:support@tova.com.ng">
                Email ERP team <b>→</b>
              </a>
            </div>
            <ul className="hero-list">
              <li>Connected ERP applications by business function</li>
              <li>Role-based access, approvals, and operational controls</li>
              <li>Implementation paths tailored to each product</li>
              <li>Audit-ready records and workflow traceability</li>
              <li>Scalable rollout across finance, ops, and admin teams</li>
            </ul>
          </div>
          <div className="snapshot">
            <p className="eyebrow mint">PLATFORM SNAPSHOT</p>
            <h2>
              Shared identity, security, and data standards across Tova
              applications.
            </h2>
            <div className="snapshot-grid">
              {areas.map(([title, text]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <div className="snapshot-note">
              Product pages contain implementation scope, pricing, and
              activation steps.
            </div>
          </div>
        </section>
        <section className="standards" id="why">
          <div className="cards">
            {[
              [
                "◫",
                "Shared Standards",
                "Common identity, security, and tenancy controls across all applications.",
              ],
              [
                "♢",
                "Implementation Governance",
                "Structured onboarding with role mapping, approval workflows, and deployment checkpoints.",
              ],
              [
                "✣",
                "Scalable Rollout",
                "Adopt one application at a time while maintaining a consistent control model.",
              ],
            ].map(([icon, title, text]) => (
              <article key={title}>
                <span className="card-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="solution">
          <div className="section-title">
            <p className="eyebrow">● &nbsp; ERP SOLUTION AREAS</p>
            <h2>Software grouped by the work your teams actually do.</h2>
          </div>
          <div className="solution-grid">
            {[
              [
                "Finance and Control",
                "Software for value visibility, reporting, and operational governance.",
                "Accounting and finance",
                "Fixed asset valuation",
                "Approval-backed controls",
              ],
              [
                "Commerce and Inventory",
                "Connected workflows for selling, stocking, and physical operations.",
                "POS and inventory",
                "Barcode and QR operations",
                "Movement and traceability",
              ],
              [
                "People and Workplace",
                "Internal operations software for teams, structures, and office coordination.",
                "HR and workforce",
                "Office management",
                "Support and service workflows",
              ],
            ].map(([title, text, ...items]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
                {items.map((item) => (
                  <span key={item}>✓ {item}</span>
                ))}
              </article>
            ))}
          </div>
        </section>
        <section className="engagement">
          <p className="eyebrow">● &nbsp; ENGAGEMENT MODEL</p>
          <h2>Evaluate centrally, onboard by application.</h2>
          <div className="steps">
            {[
              [
                "Step 1",
                "Assess requirements",
                "Review available applications and map them to current operational priorities.",
              ],
              [
                "Step 2",
                "Review application details",
                "Open the selected application page for implementation details and commercial terms.",
              ],
              [
                "Step 3",
                "Proceed with activation",
                "Work with the product team to finalize setup, access, and go-live planning.",
              ],
            ].map(([step, title, text]) => (
              <article key={step}>
                <p className="eyebrow">{step}</p>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="products" id="products">
          <p className="eyebrow center">● &nbsp; PRODUCT SUITE</p>
          <h2>Choose the ERP application your team needs now.</h2>
          <p className="center copy">
            Review the applications in the suite, then open the product page
            that matches your current operating priority.
          </p>
          <div className="product-grid">
            {products.map(([title, text, status, href]) =>
              status === "Live" ? (
                <a
                  className="product"
                  href={addReferralCode(href)}
                  key={title}
                  rel="noopener noreferrer"
                  target={href.startsWith("http") ? "_blank" : undefined}
                >
                  <span className="product-badge">{status}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <b>View details →</b>
                </a>
              ) : (
                <div className="product upcoming-product" key={title}>
                  <span className="product-badge muted">{status}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="coming">In staged release</span>
                </div>
              ),
            )}
          </div>
        </section>
        <Pricing referralCode={referralCode} />
        <section className="referral-banner" aria-labelledby="referral-title">
          <div className="referral-copy">
            <p className="eyebrow">TOVA AFFILIATE PROGRAM</p>
            <h2 id="referral-title">
              Introduce Tova.
              <br />
              <span>Earn from referrals.</span>
            </h2>
            <p>
              Turn your business connections into earning opportunities.
              Introduce people to Tova products and earn commission on
              qualifying referrals.
            </p>
            <div className="referral-actions">
              <Link className="button" href="/affiliate">
                Become an affiliate <span aria-hidden="true">↗</span>
              </Link>
              <Link className="referral-login" href="/affiliate/login">
                Already a partner? Sign in →
              </Link>
            </div>
          </div>
          <ol className="referral-steps">
            <li>
              <span className="referral-step-number">01</span>
              <div>
                <h3>Share your link</h3>
                <p>Get a referral code and link when you join.</p>
              </div>
            </li>
            <li>
              <span className="referral-step-number">02</span>
              <div>
                <h3>Introduce a business</h3>
                <p>Connect people with the product they need.</p>
              </div>
            </li>
            <li>
              <span className="referral-step-number">03</span>
              <div>
                <h3>Earn commission</h3>
                <p>Follow approved referrals and earnings in your dashboard.</p>
              </div>
            </li>
          </ol>
        </section>
        <section className="faq">
          <p className="eyebrow">ERP FAQ</p>
          <h2>Questions about the Tova suite</h2>
          <details>
            <summary>Is Tova ERP a single application?</summary>
            <p>
              Tova ERP is a suite. Each product has its own scope,
              onboarding, and commercial terms.
            </p>
          </details>
          <details>
            <summary>Can we start with one product?</summary>
            <p>
              Yes. Choose the application you need now and add others as your
              requirements grow.
            </p>
          </details>
          <details>
            <summary>Which products are live?</summary>
            <p>
              Fixed Asset Management, Accounting and Finance, and POS and
              Inventory are live.
            </p>
          </details>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
