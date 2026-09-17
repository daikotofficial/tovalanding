import Link from "next/link";

const columns = [
  {
    title: "Products",
    links: [
      ["Fixed Asset Management", "https://tovafixedasset.com.ng"],
      ["Accounting and Finance", "https://tovabooks.com.ng"],
      ["POS and Inventory", "https://tovapos.com.ng"],
      ["HR and Workforce", "/#products"],
      ["Office Management", "/#products"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Why Tova", "/#why"],
      ["Contact support", "mailto:support@tova.com.ng"],
      ["Affiliate program", "/affiliate"],
    ],
  },
  {
    title: "Explore",
    links: [
      ["Product suite", "/#products"],
      ["Pricing", "/#pricing"],
      ["ERP consultation", "mailto:support@tova.com.ng?subject=ERP%20consultation"],
      ["Implementation support", "mailto:support@tova.com.ng?subject=Implementation%20support"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms of Service", "/terms"],
      ["Privacy Policy", "/privacy"],
      ["Cookie Policy", "/cookies"],
    ],
  },
];

function FooterLink({ href, children }) {
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return <a href={href}>{children}</a>;
  }
  return <Link href={href}>{children}</Link>;
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link className="footer-wordmark" href="/">Tova ERP</Link>
          <p>Connected software for real business functions.</p>
          <a className="site-footer-email" href="mailto:support@tova.com.ng">
            support@tova.com.ng
          </a>
        </div>
        <div className="site-footer-columns">
          {columns.map((column) => (
            <div className="site-footer-column" key={column.title}>
              <h2>{column.title}</h2>
              <nav aria-label={`${column.title} links`}>
                {column.links.map(([label, href]) => (
                  <FooterLink href={href} key={label}>{label}</FooterLink>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
      <div className="site-footer-bottom">
        <small>© 2026 Tova ERP. All rights reserved.</small>
        <span>Powered by DAIKOT</span>
      </div>
    </footer>
  );
}
