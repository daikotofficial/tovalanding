"use client";
import { useState } from "react";
export default function AccountActions({ link, code }) {
  const [message, setMessage] = useState("");
  async function action() {
    try {
      if (link || code) {
        await navigator.clipboard.writeText(link || code);
        setMessage("Copied");
      } else {
        const r = await fetch("/api/affiliate/logout", { method: "POST" });
        if (!r.ok) throw new Error();
        location.assign("/affiliate/login");
      }
    } catch {
      setMessage("Please try again");
    }
  }
  return (
    <button className="solid" onClick={action}>
      {message || (link ? "Copy referral link" : code ? "Copy referral code" : "Sign out")}
    </button>
  );
}
