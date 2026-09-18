"use client";

import { useState } from "react";
import Link from "next/link";
import ChannelSelect from "./channel-select";
import PasswordInput from "./password-input";
import { useToast } from "./toast";

export default function AffiliateForm({ signup = false }) {
  const [step, setStep] = useState("details");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    channel: "Professional network",
    consent: false,
    verification: "",
    password: "",
    passwordConfirmation: "",
  });
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const { push } = useToast();
  const passwordChecks = [
    [form.password.length >= 12, "12 or more characters"],
    [/[A-Z]/.test(form.password), "One uppercase letter"],
    [/[a-z]/.test(form.password), "One lowercase letter"],
    [/\d/.test(form.password), "One number"],
  ];
  function field(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }
  async function request(endpoint, payload) {
    setError("");
    setBusy(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Please try again.");
      return true;
    } catch (error) {
      setError(error.message);
      push(error.message, "error");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function submit(event) {
    event.preventDefault();
    if (step === "verify") {
      if (await request("/api/affiliate/login", form))
        window.location.assign("/affiliate/dashboard");
    } else if (signup) {
      if (await request("/api/affiliate/register", form)) {
        setStep("verify");
        push(
          "Verification code sent. Check your email to continue.",
          "success",
        );
      }
    } else {
      if (await request("/api/affiliate/login", form))
        window.location.assign("/affiliate/dashboard");
    }
  }
  return (
    <section className="auth-card">
      <p className="form-kicker">
        {step === "verify"
          ? "EMAIL VERIFICATION"
          : signup
            ? "AFFILIATE REGISTRATION"
            : "AFFILIATE LOGIN"}
      </p>
      <h2>
        {step === "verify"
          ? "Enter your email code"
          : signup
            ? "Create your account"
            : "Sign in to your account"}
      </h2>
      <p className="form-help">
        {step === "verify"
          ? "If your email is registered, a six-digit code has been sent to " +
            form.email +
            ". Codes expire after 10 minutes."
          : signup
            ? "Create a strong password. We’ll verify your email once, then you’ll use your password for secure access."
            : "Sign in with the password you created for your affiliate account."}
      </p>
      <form onSubmit={submit}>
        {step === "details" ? (
          <>
            {signup && (
              <label>
                Full name
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => field("name", e.target.value)}
                />
              </label>
            )}
            <label>
              Email address
              <input
                required
                type="email"
                autoComplete="email"
                maxLength={254}
                value={form.email}
                onChange={(e) => field("email", e.target.value)}
              />
            </label>
            <label>
              Password
              <PasswordInput
                required
                minLength={12}
                maxLength={128}
                autoComplete={signup ? "new-password" : "current-password"}
                value={form.password}
                onChange={(e) => field("password", e.target.value)}
              />
              {signup && (
                <ul
                  className="password-requirements"
                  aria-label="Password requirements"
                >
                  {passwordChecks.map(([valid, label]) => (
                    <li className={valid ? "valid" : ""} key={label}>
                      <span aria-hidden="true">{valid ? "✓" : "○"}</span>{" "}
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </label>
            {signup && (
              <label>
                Confirm password
                <PasswordInput
                  required
                  minLength={12}
                  maxLength={128}
                  autoComplete="new-password"
                  value={form.passwordConfirmation}
                  onChange={(e) =>
                    field("passwordConfirmation", e.target.value)
                  }
                />
              </label>
            )}
            {signup && (
              <>
                <label>
                  Phone number (optional)
                  <input
                    type="tel"
                    maxLength={40}
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => field("phone", e.target.value)}
                  />
                </label>
                <label>
                  Location (optional)
                  <input
                    maxLength={160}
                    autoComplete="address-level2"
                    value={form.location}
                    onChange={(e) => field("location", e.target.value)}
                    placeholder="City, State, Country"
                  />
                </label>
                <ChannelSelect
                  value={form.channel}
                  onChange={(value) => field("channel", value)}
                />
                <label className="check">
                  <input
                    required
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => field("consent", e.target.checked)}
                  />
                  I agree to receive account verification and referral updates
                  by email.
                </label>
                <p className="form-help">
                  Read our <Link href="/privacy">privacy policy</Link>.
                  Affiliates earn 20% of the VAT-exclusive value of qualifying
                  paid subscriptions. Payouts are reviewed by the Tova team.
                </p>
              </>
            )}
          </>
        ) : (
          <label>
            Six-digit code
            <input
              required
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={form.verification}
              onChange={(e) => field("verification", e.target.value)}
            />
          </label>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="solid" disabled={busy}>
          {busy
            ? "Please wait…"
            : step === "verify"
              ? "Verify email and continue →"
              : signup
                ? "Create secure account →"
                : "Sign in securely →"}
        </button>
        {step === "verify" && (
          <>
            <button
              type="button"
              className="button outline"
              disabled={busy}
              onClick={() =>
                request("/api/affiliate/request-code", { email: form.email })
              }
            >
              Send a new code
            </button>
            <button
              type="button"
              className="button outline"
              onClick={() => {
                setStep("details");
                setError("");
              }}
            >
              Change email
            </button>
          </>
        )}
      </form>
      <p className="switch">
        {signup ? "Already registered?" : "New to the program?"}{" "}
        <Link href={signup ? "/affiliate/login" : "/affiliate"}>
          {signup ? "Sign in" : "Create an account"}
        </Link>
      </p>
      {!signup && step === "details" && (
        <p className="switch">
          <Link href="/affiliate/reset-password">
            Forgot or reset your password?
          </Link>
        </p>
      )}
    </section>
  );
}
