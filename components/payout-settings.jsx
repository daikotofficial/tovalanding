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
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setMessage(
        response.ok
          ? "Payout details saved"
          : data.error || "Unable to save details",
      );
    } catch {
      setMessage("Network error. Check your connection and try again.");
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
          value={form.accountName}
          onChange={(e) => update("accountName", e.target.value)}
        />
      </label>
      <label>
        Account number
        <input
          required
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
      <button className="solid" type="submit">
        Save payout details
      </button>
    </form>
  );
}
