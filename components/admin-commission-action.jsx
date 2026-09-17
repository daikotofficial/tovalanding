"use client";

import { useState } from "react";

export default function AdminCommissionAction({ id, status }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function update(action) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/affiliate/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, commissionId: id }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to update commission.");
      window.location.reload();
    } catch (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }
  if (status !== "pending") return <span>{status}</span>;
  return (
    <span className="admin-payout-actions">
      <button
        type="button"
        disabled={busy}
        onClick={() => update("approve_commission")}
      >
        Approve
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => update("reject_commission")}
      >
        Reject
      </button>
      {message && <small role="alert">{message}</small>}
    </span>
  );
}
