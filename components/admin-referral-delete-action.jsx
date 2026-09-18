"use client";

import { useState } from "react";

export default function AdminReferralDeleteAction({ id, label }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function remove() {
    if (
      !window.confirm(
        `Permanently delete ${label || "this referral"}? This removes its referral record and any unpaid commissions.`,
      )
    )
      return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/affiliate/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_referral", referralId: id }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to delete referral.");
      window.location.reload();
    } catch (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }

  return (
    <span className="admin-payout-actions admin-delete-referral">
      <button type="button" disabled={busy} onClick={remove}>
        {busy ? "Deleting…" : "Delete"}
      </button>
      {message && <small role="alert">{message}</small>}
    </span>
  );
}
