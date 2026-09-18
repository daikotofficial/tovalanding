"use client";

import { useEffect, useState } from "react";

export default function PayoutSettings() {
  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });
  const [state, setState] = useState("loading");
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  useEffect(() => {
    fetch("/api/affiliate/settings")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok)
          throw new Error(data.error || "Unable to load payout settings");
        return data;
      })
      .then((data) => {
        const s = data.settings || {};
        setForm({
          accountName: s.payout_account_name || "",
          accountNumber: s.payout_account_number || "",
          bankName: s.payout_bank_name || "",
        });
        setLocked(Boolean(s.hasPayoutDetails));
        setState("ready");
      })
      .catch((error) => {
        setMessage(error.message);
        setState("ready");
      });
  }, []);
  function update(name, value) {
    setForm((old) => ({ ...old, [name]: value }));
  }
  async function save(event) {
    event.preventDefault();
    setMessage("Saving…");
    try {
      const response = await fetch("/api/affiliate/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, currentPassword }),
      });
      const data = await response.json();
      setMessage(
        response.ok
          ? "Payout details saved"
          : data.error || "Unable to save details",
      );
      if (response.ok) {
        setLocked(true);
        setEditing(false);
        setCurrentPassword("");
        setForm((old) => ({
          ...old,
          accountNumber: `••••••${old.accountNumber.slice(-4)}`,
        }));
      }
    } catch {
      setMessage("Network error. Check your connection and try again.");
    }
  }
  async function unlock(event) {
    event.preventDefault();
    setMessage("Confirming password…");
    try {
      const response = await fetch("/api/affiliate/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_edit", currentPassword }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Password confirmation failed.");
      setLocked(false);
      setForm((old) => ({ ...old, accountNumber: "" }));
      setMessage(
        "Payout details unlocked. Enter the updated details and save.",
      );
    } catch (error) {
      setMessage(error.message);
    }
  }
  if (state === "loading")
    return (
      <p className="fine" role="status">
        Loading your payout settings…
      </p>
    );
  return (
    <form className="settings-form" onSubmit={save}>
      <div className="settings-intro">
        <span className="settings-icon">₦</span>
        <div>
          <strong>Bank transfer</strong>
          <p>
            Commission payouts are sent to this Nigerian bank account after
            review.
          </p>
        </div>
      </div>
      <label>
        Account name
        <input
          required
          disabled={locked}
          value={form.accountName}
          onChange={(e) => update("accountName", e.target.value)}
        />
      </label>
      <label>
        Account number
        <input
          required
          disabled={locked}
          placeholder={editing ? "Enter new 10-digit account number" : ""}
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          value={form.accountNumber}
          onChange={(e) => update("accountNumber", e.target.value)}
        />
      </label>
      <label>
        Bank name
        <input
          required
          disabled={locked}
          value={form.bankName}
          onChange={(e) => update("bankName", e.target.value)}
        />
      </label>
      {message && (
        <p
          className={`form-status ${message.includes("Unable") || message.includes("error") ? "error" : ""}`}
          role="status"
        >
          {message}
        </p>
      )}
      {locked && !editing ? (
        <button
          className="solid"
          type="button"
          onClick={() => {
            setEditing(true);
            setMessage("Enter your password to unlock editing.");
          }}
        >
          Edit payout details
        </button>
      ) : (
        <>
          {locked ? (
            <label>
              Current password
              <input
                required
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>
          ) : null}
          {locked ? (
            <button className="solid" type="button" onClick={unlock}>
              Unlock editing
            </button>
          ) : (
            <button className="solid" type="submit">
              Save payout details
            </button>
          )}
          {locked ? null : (
            <button
              type="button"
              className="settings-cancel"
              onClick={() => {
                setEditing(false);
                setLocked(true);
                setCurrentPassword("");
                setMessage("");
              }}
            >
              Cancel
            </button>
          )}
        </>
      )}
    </form>
  );
}
