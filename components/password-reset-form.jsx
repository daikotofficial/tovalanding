"use client";

import { useState } from "react";
import PasswordInput from "./password-input";

export default function PasswordResetForm() {
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({
    email: "",
    verification: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  function update(name, value) {
    setForm((old) => ({ ...old, [name]: value }));
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const endpoint =
      step === "email"
        ? "/api/affiliate/password/reset-request"
        : "/api/affiliate/password/reset";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(data.error || "Please try again.");
    if (step === "email") {
      setStep("code");
      setMessage(
        "If that email is registered, a verification code has been sent.",
      );
    } else location.assign("/affiliate/dashboard");
  }
  return (
    <form className="auth-card reset-card" onSubmit={submit}>
      <p className="form-kicker">ACCOUNT RECOVERY</p>
      <h2>
        {step === "email" ? "Reset your password" : "Create a new password"}
      </h2>
      <p className="form-help">
        {step === "email"
          ? "Enter your affiliate email and we’ll send a secure, single-use verification code."
          : `Enter the six-digit code sent to ${form.email}.`}
      </p>
      {step === "email" ? (
        <label>
          Email address
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>
      ) : (
        <>
          <label>
            Verification code
            <input
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={form.verification}
              onChange={(e) => update("verification", e.target.value)}
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
            Confirm password
            <PasswordInput
              required
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
            />
          </label>
        </>
      )}
      {message && (
        <p className="form-status" role="status">
          {message}
        </p>
      )}
      <button className="solid" disabled={busy}>
        {busy
          ? "Please wait…"
          : step === "email"
            ? "Send recovery code →"
            : "Reset password →"}
      </button>
    </form>
  );
}
