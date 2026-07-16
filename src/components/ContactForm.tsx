"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, ValidationError } from "@formspree/react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

const FORMSPREE_ID = "mjgnbdbg";

const FIELD_CLASSES =
  "w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent/60";

// Rotating placeholder hints for the message field (Task 5). This is a
// hint only — the persistent, visible <label htmlFor="message"> below
// stays the sole accessible name for the field, so screen reader users
// always get a stable name regardless of which hint is currently showing.
const MESSAGE_HINTS = [
  "What are you looking to build or improve?",
  "Let's talk about your business.",
  "What's costing you leads?",
  "Tell me what's not working.",
];

function useRotatingPlaceholder(hints: string[], intervalMs = 3500) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % hints.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion, hints.length, intervalMs]);

  return hints[index];
}

export function ContactForm() {
  const [state, handleSubmit] = useForm(FORMSPREE_ID);
  const shouldReduceMotion = useReducedMotion();
  const messagePlaceholder = useRotatingPlaceholder(MESSAGE_HINTS);
  // The rotating hint is a decorative overlay only; the visible <label> below
  // stays the field's accessible name. Hide the overlay once the field has
  // content or focus so it never sits over what the visitor is typing.
  const [messageEmpty, setMessageEmpty] = useState(true);
  const [messageFocused, setMessageFocused] = useState(false);
  const showHint = messageEmpty && !messageFocused;

  if (state.succeeded) {
    return (
      <div className="rounded-xl border border-accent/40 bg-surface p-8 text-center">
        <p className="font-display text-xl font-semibold text-accent">
          Message sent
        </p>
        <p className="mt-3 text-sm text-foreground/70">
          Thanks for reaching out. You will hear back within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Formspree honeypot: hidden from people, irresistible to bots. Any
          submission that fills it is silently discarded, which keeps bot
          traffic out of the inbox (and out of the spam classifier's way). */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {/* Clear, consistent subject line on the notification email. */}
      <input
        type="hidden"
        name="_subject"
        value="New enquiry via setframe.net"
      />

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block font-mono text-xs tracking-wide text-foreground/60"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          className={FIELD_CLASSES}
        />
        <ValidationError
          prefix="Name"
          field="name"
          errors={state.errors}
          className="mt-1 block text-xs text-accent"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block font-mono text-xs tracking-wide text-foreground/60"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={FIELD_CLASSES}
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
          className="mt-1 block text-xs text-accent"
        />
      </div>

      <div>
        <label
          htmlFor="contactMethod"
          className="mb-1.5 block font-mono text-xs tracking-wide text-foreground/60"
        >
          Preferred contact method
        </label>
        <select
          id="contactMethod"
          name="contactMethod"
          defaultValue="Email"
          className={FIELD_CLASSES}
        >
          <option>Email</option>
          <option>Phone call</option>
          <option>Video call</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block font-mono text-xs tracking-wide text-foreground/60"
        >
          Message
        </label>
        <div className="relative">
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            onFocus={() => setMessageFocused(true)}
            onBlur={() => setMessageFocused(false)}
            onChange={(e) => setMessageEmpty(e.target.value.length === 0)}
            className={FIELD_CLASSES}
          />
          {/* Decorative crossfading hint. aria-hidden + pointer-events-none so
              it never becomes the accessible name and never blocks typing. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-3 text-sm text-muted"
          >
            <AnimatePresence mode="wait">
              {showHint && (
                <m.span
                  key={messagePlaceholder}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                  className="block"
                >
                  {messagePlaceholder}
                </m.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="mt-1 block text-xs text-accent"
        />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full rounded-full border border-accent/50 px-6 py-3 font-display text-sm font-semibold tracking-wide text-accent transition-colors hover:border-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state.submitting ? "[ Sending... ]" : "[ Send message ]"}
      </button>

      <ValidationError
        errors={state.errors}
        className="block text-center text-xs text-accent"
      />

      <p className="text-center text-xs leading-relaxed text-foreground/50">
        Your details are used only to reply to your message. No newsletters,
        no sharing with third parties. Read the{" "}
        <Link href="/privacy" className="text-accent hover:opacity-80">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
