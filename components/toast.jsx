"use client";

import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = (message, type = "info") => {
    const id = crypto.randomUUID();
    setItems((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 4500);
  };
  const value = useMemo(() => ({ push }), []);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {items.map((item) => (
          <div className={`toast toast-${item.type}`} role="status" key={item.id}>
            <span className="toast-mark" aria-hidden="true">
              {item.type === "success" ? "✓" : item.type === "error" ? "!" : "i"}
            </span>
            <span>{item.message}</span>
            <button type="button" aria-label="Dismiss notification" onClick={() => setItems((current) => current.filter((x) => x.id !== item.id))}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
