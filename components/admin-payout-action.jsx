"use client";

import { useState } from "react";

export default function AdminPayoutAction({ id, status }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function update(action) {
    const prompt = action === "payout_paid"
      ? "Confirm that this payout has been sent to the affiliate?"
      : "Reject this payout request and release the reserved balance?";
    if (!window.confirm(prompt)) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/affiliate/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payoutId: id }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to update payout.");
      window.location.reload();
    } catch (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }
  if (!["requested", "approved"].includes(status)) return <>{status}</>;
  return (
    <span className="admin-payout-actions">
      <button
        type="button"
        disabled={busy}
        onClick={() => update("payout_paid")}
      >
        Mark paid
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => update("payout_rejected")}
      >
        Reject
      </button>
      {message && <small role="alert">{message}</small>}
    </span>
  );
}
