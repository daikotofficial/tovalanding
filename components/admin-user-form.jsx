"use client";

import { useState } from "react";
import PasswordInput from "./password-input";

export default function AdminUserForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/affiliate/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_admin", ...form }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? "Administrator added."
        : result.error || "Unable to add administrator.",
    );
    if (response.ok) setForm({ email: "", password: "" });
  }
  return (
    <form className="admin-user-form" onSubmit={submit}>
      <input
        required
        type="email"
        placeholder="admin@company.com"
        aria-label="New administrator email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <PasswordInput
        required
        minLength={12}
        placeholder="Temporary password (12+ characters)"
        aria-label="New administrator password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="solid" type="submit">
        Add administrator
      </button>
      {message && <small role="status">{message}</small>}
    </form>
  );
}
