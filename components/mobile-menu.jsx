"use client";

import { useState } from "react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-menu-panel"
          aria-label="Mobile navigation"
        >
          <a href="#products" onClick={() => setOpen(false)}>
            Products
          </a>
          <a href="#pricing" onClick={() => setOpen(false)}>
            Pricing
          </a>
          <a href="#why" onClick={() => setOpen(false)}>
            Why Tova
          </a>
          <a
            href="https://daikot.com.ng"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Us
          </a>
          <a href="/affiliate">Affiliate program</a>
          <a href="mailto:support@tova.com.ng">Support</a>
        </nav>
      )}
    </div>
  );
}
