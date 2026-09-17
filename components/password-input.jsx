"use client";

import { useState } from "react";

export default function PasswordInput({ ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="password-input-wrap">
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="password-toggle"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {visible ? (
            <>
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </>
          ) : (
            <>
              <path d="M3 3l18 18" />
              <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.1 4.1" />
              <path d="M6.7 6.7C3.7 8.7 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 3.4-.6" />
            </>
          )}
        </svg>
      </button>
    </span>
  );
}
