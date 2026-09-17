"use client";

import { useState } from "react";
import PasswordInput from "./password-input";

export default function PasswordSettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  function update(name, value) {
    setForm((old) => ({ ...old, [name]: value }));
  }
  async function save(event) {
    event.preventDefault();
    setMessage("Saving…");
    try {
      const response = await fetch("/api/affiliate/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setMessage(
        response.ok
          ? "Password updated and other sessions signed out"
          : data.error || "Unable to update password",
      );
      if (response.ok)
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setMessage("Network error. Check your connection and try again.");
    }
  }
  return (
    <form className="settings-form" onSubmit={save}>
      <label>
        Current password
        <PasswordInput
          required
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={(e) => update("currentPassword", e.target.value)}
        />
      </label>
      <label>
        New password
        <PasswordInput
          required
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          value={form.newPassword}
          onChange={(e) => update("newPassword", e.target.value)}
        />
        <small className="password-hint">
          12+ characters · uppercase · lowercase · number
        </small>
      </label>
      <label>
        Confirm new password
        <PasswordInput
          required
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
        />
      </label>
      {message && (
        <p className="form-status" role="status">
          {message}
        </p>
      )}
      <button className="solid" type="submit">
        Update password
      </button>
    </form>
  );
}
