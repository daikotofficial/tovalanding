"use client";

import { useState } from "react";
import PasswordInput from "./password-input";

export default function AdminLoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      location.assign("/admin");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }
  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label>
        Email address
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </label>
      <label>
        Password
        <PasswordInput
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="solid" disabled={busy}>
        {busy ? "Signing in…" : "Sign in securely"}
      </button>
    </form>
  );
}
