"use client";

import { useEffect, useId, useRef, useState } from "react";

const options = [
  "Professional network",
  "Consulting or agency",
  "Social media",
  "Content or community",
  "Other",
];

export default function ChannelSelect({ value, onChange }) {
  const id = useId(),
    root = useRef(null),
    trigger = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(options.indexOf(value));
  const search = useRef({ text: "", time: 0 });
  useEffect(() => {
    function outside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  function select(index) {
    onChange(options[index]);
    setActive(index);
    setOpen(false);
    trigger.current?.focus();
  }
  function keyDown(event) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActive((current) =>
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? options.length - 1
            : !open
              ? options.indexOf(value)
              : (current +
                  (event.key === "ArrowDown" ? 1 : -1) +
                  options.length) %
                options.length,
      );
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) select(active);
      else {
        setActive(options.indexOf(value));
        setOpen(true);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") setOpen(false);
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const now = Date.now();
      search.current = {
        text:
          (now - search.current.time < 700 ? search.current.text : "") +
          event.key.toLowerCase(),
        time: now,
      };
      const index = options.findIndex((item) =>
        item.toLowerCase().startsWith(search.current.text),
      );
      if (index >= 0) {
        setOpen(true);
        setActive(index);
      }
    }
  }
  return (
    <div className="channel-field" ref={root}>
      <span id={id + "-label"} className="field-label">
        How will you refer businesses?
      </span>
      <button
        type="button"
        ref={trigger}
        role="combobox"
        aria-labelledby={id + "-label"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id + "-list"}
        aria-activedescendant={open ? id + "-" + active : undefined}
        className="channel-trigger"
        onKeyDown={keyDown}
        onBlur={(event) => {
          if (!root.current?.contains(event.relatedTarget)) setOpen(false);
        }}
        onClick={() => {
          setActive(options.indexOf(value));
          setOpen(!open);
        }}
      >
        <span>{value}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul
          id={id + "-list"}
          role="listbox"
          aria-labelledby={id + "-label"}
          className="channel-options"
        >
          {options.map((item, index) => (
            <li
              key={item}
              id={id + "-" + index}
              role="option"
              aria-selected={value === item}
              data-active={active === index}
              onPointerMove={() => setActive(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(index)}
            >
              <span>{item}</span>
              {value === item && <span aria-hidden="true">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
