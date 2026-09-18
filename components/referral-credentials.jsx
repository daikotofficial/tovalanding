"use client";

import { useState } from "react";

function EyeButton({ visible, onClick, label }) {
  return (
    <button
      className="credential-eye"
      type="button"
      aria-label={`${visible ? "Hide" : "Show"} ${label}`}
      aria-pressed={visible}
      onClick={onClick}
    >
      {visible ? "◉" : "◌"}
    </button>
  );
}

export default function ReferralCredentials({ link, code, productLinks = [] }) {
  const [visible, setVisible] = useState({ link: false, code: false, products: false });
  const [copied, setCopied] = useState("");

  async function copy(value, name) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(name);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  }

  return (
    <section className="referral-credentials" aria-label="Referral credentials">
      <div className="credential-row">
        <div className="credential-copy">
          <small>REFERRAL LINK</small>
          <strong>{visible.link ? link : "••••••••••••••••••••••••"}</strong>
        </div>
        <div className="credential-actions">
          <EyeButton
            visible={visible.link}
            onClick={() => setVisible((old) => ({ ...old, link: !old.link }))}
            label="referral link"
          />
          <button className="credential-copy-button" type="button" onClick={() => copy(link, "link")}>
            {copied === "link" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div className="credential-row">
        <div className="credential-copy">
          <small>REFERRAL CODE</small>
          <strong>{visible.code ? code : "••••••••••••••••"}</strong>
        </div>
        <div className="credential-actions">
          <EyeButton
            visible={visible.code}
            onClick={() => setVisible((old) => ({ ...old, code: !old.code }))}
            label="referral code"
          />
          <button className="credential-copy-button" type="button" onClick={() => copy(code, "code")}>
            {copied === "code" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      {productLinks.map((product) => (
        <div className="credential-row" key={product.name}>
          <div className="credential-copy">
            <small>{product.name.toUpperCase()} SIGNUP LINK</small>
            <strong>{visible.products ? product.link : "••••••••••••••••••••••••"}</strong>
          </div>
          <div className="credential-actions">
            <EyeButton
              visible={visible.products}
              onClick={() => setVisible((old) => ({ ...old, products: !old.products }))}
              label={`${product.name} signup link`}
            />
            <button className="credential-copy-button" type="button" onClick={() => copy(product.link, product.name)}>
              {copied === product.name ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ))}
      <p className="credential-note">Use the link for tracked visits, or enter the code during product signup.</p>
    </section>
  );
}
