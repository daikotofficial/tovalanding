"use client";

import { useState } from "react";

export default function PayoutAction({ disabled }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function requestPayout() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/affiliate/payouts", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Please try again.");
      setMessage("Request received");
      setTimeout(() => location.reload(), 700);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  return <button className="solid payout-button" disabled={disabled || busy} onClick={requestPayout}>{message || (busy ? "Submitting…" : "Request payout")}</button>;
}
