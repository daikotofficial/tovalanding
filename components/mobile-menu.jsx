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
        <span aria-hidden="true">{open ? "×" : "☰"}</span>
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
