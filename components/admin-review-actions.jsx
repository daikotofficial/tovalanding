"use client";

import { useState } from "react";

export default function AdminReviewActions({ id, status }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  if (status === "rejected") return null;
  async function review(action) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/affiliate/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, note }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update application.");
      setMessage(action === "approve" ? "Approved" : "Rejected");
      window.setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }
  const pending = status === "pending";
  return (
    <div className="admin-review-actions">
      {pending && <input aria-label="Review note" placeholder="Optional review note" maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} />}
      {pending && <button type="button" className="admin-approve" disabled={busy} onClick={() => review("approve")}>Approve</button>}
      {pending && <button type="button" className="admin-reject" disabled={busy} onClick={() => review("reject")}>Reject</button>}
      {status === "active" && <button type="button" className="admin-reject" disabled={busy} onClick={() => review("deactivate")}>Deactivate</button>}
      {status === "suspended" && <button type="button" className="admin-approve" disabled={busy} onClick={() => review("reactivate")}>Reactivate</button>}
      {message && <small role="status">{message}</small>}
    </div>
  );
}
