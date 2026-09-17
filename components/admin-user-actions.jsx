"use client";

import { useState } from "react";

export default function AdminUserActions({ id, status }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function update(action) {
    setBusy(true); setMessage("");
    const response = await fetch("/api/affiliate/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, adminId: id }) });
    const result = await response.json();
    if (!response.ok) setMessage(result.error || "Unable to update administrator.");
    else window.location.reload();
    setBusy(false);
  }
  return <span className="admin-user-actions">
    {status === "active" && <><button type="button" disabled={busy} onClick={() => update("deactivate_admin")}>Deactivate</button><button type="button" disabled={busy} onClick={() => update("revoke_admin_sessions")}>Revoke sessions</button></>}
    {status === "disabled" && <button type="button" disabled={busy} onClick={() => update("reactivate_admin")}>Reactivate</button>}
    {message && <small role="alert">{message}</small>}
  </span>;
}
