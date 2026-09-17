"use client";

import { useState } from "react";

// Public product pricing verified against the linked product pages.
const products = [
  {
    name: "Fixed Asset Management",
    category: "Asset tracking and lifecycle control",
    href: "https://tovafixedasset.com.ng",
    plans: [
      ["Starter", 2500, "Up to 100 assets"],
      ["Growth", 12500, "Up to 500 assets"],
      ["Enterprise", null, "Custom capacity and deployment support"],
    ],
  },
  {
    name: "TovaBooks",
    category: "Accounting and finance",
    href: "https://tovabooks.com.ng/pricing",
    plans: [
      ["Basic", 5000, "Core accounting for one user"],
      ["Business", 9500, "Multi-user collaboration and approvals"],
      ["Pro", 15000, "Payroll and advanced controls"],
    ],
  },
  {
    name: "TovaPOS",
    category: "Retail sales and inventory",
    href: "https://tovapos.com.ng/#pricing",
    plans: [
      ["Starter", 5000, "Up to 100,000 product/batch records"],
      ["Pro", 15000, "Up to 500,000 product/batch records"],
      ["Delux", null, "Custom scale, onboarding and support"],
    ],
  },
];
const money = (value) =>
  "₦" +
  new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(value);
export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const price = (amount) => money(annual ? amount * 12 * 0.95 : amount);
  return (
    <section
      className="pricing-section"
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="pricing-heading">
        <div>
          <p className="eyebrow">PRODUCT PRICING</p>
          <h2 id="pricing-title">Choose the right plan for your business.</h2>
        </div>
        <p>
          Start with the product you need. Each application has its own plans
          and subscription.
        </p>
      </div>
      <div className="billing-control" role="group" aria-label="Billing period">
        <button
          type="button"
          aria-pressed={!annual}
          onClick={() => setAnnual(false)}
        >
          Monthly
        </button>
        <button
          type="button"
          aria-pressed={annual}
          onClick={() => setAnnual(true)}
        >
          Yearly <span>Save 5%</span>
        </button>
      </div>
      <div className="pricing-grid" aria-live="polite">
        {products.map((product) => (
          <article className="pricing-card" key={product.name}>
            <h3>{product.name}</h3>
            <p className="pricing-category">{product.category}</p>
            <p className="pricing-start">Plans from</p>
            <p className="pricing-amount">
              <strong>{price(product.plans[0][1])}</strong>
              <span>/{annual ? "year" : "month"}</span>
            </p>
            <ul className="pricing-details">
              {product.plans.map(([name, amount, description]) => (
                <li key={name}>
                  <div>
                    <strong>{name}</strong>
                    <span>
                      {amount === null
                        ? "Custom"
                        : price(amount) + (annual ? "/yr" : "/mo")}
                    </span>
                  </div>
                  <p>{description}</p>
                </li>
              ))}
            </ul>
            <a href={product.href} target="_blank" rel="noopener noreferrer">
              Compare full plans <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
      <p className="pricing-note">
        {annual
          ? "Yearly prices show the full annual total, including the 5% discount."
          : "Prices shown are for monthly billing in Nigerian naira."}{" "}
        Review features and subscription terms on each product’s pricing page.
      </p>
    </section>
  );
}
