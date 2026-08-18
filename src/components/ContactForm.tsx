"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm, ValidationError } from "@formspree/react";
import { useReducedMotion } from "framer-motion";
// FIELD_CLASSES lives in lib/formStyles so /webcriticapp's form uses the
// identical treatment instead of a second copy of the same class string.
import { FIELD_CLASSES, FIELD_LABEL_CLASSES } from "@/lib/formStyles";
import { CtaButton } from "./CtaButton";

const FORMSPREE_ID = "mjgnbdbg";

// Iteration 10, Task 3. The three contact methods, and the short labels the
// segmented control shows on phones.
//
// These are JS literals and the click handler sets state FROM the literal,
// never from the button's rendered text. That is load-bearing for the same
// reason the old <select> needed an explicit `value` on every <option>: an
// option with no value takes its value from its own text, and Google Translate
// rewrites visible text but not attributes, so under translation `method`
// stopped equalling "Phone call" and the phone field silently refused to
// appear. A button-based control is only safe from that failure if it keeps
// the same discipline, so nothing below ever reads a label back out of the DOM.
const CONTACT_METHODS = ["Email", "Phone call", "Video call"] as const;
type ContactMethod = (typeof CONTACT_METHODS)[number];

// Short forms for the sub-`sm` breakpoint only. Same technique the floating
// nav already uses for "Start" vs "Start a conversation" — but no aria-label
// is needed here, because the short label is still real readable text rather
// than a truncation.
const METHOD_SHORT: Record<ContactMethod, string> = {
  Email: "Email",
  "Phone call": "Call",
  "Video call": "Video",
};

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

// Returns the index of the hint currently showing. Deliberately an index and
// not the string itself: every hint stays mounted and is crossfaded with
// opacity, so no text node is ever removed (see the swap comment below).
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

  return index;
}

export function ContactForm() {
  const [state, handleSubmit] = useForm(FORMSPREE_ID);
  const hintIndex = useRotatingPlaceholder(MESSAGE_HINTS);
  // When the visitor prefers a call, the contact field asks for a phone number
  // instead of an email — you can't email-reply to someone who wants a call.
  const [method, setMethod] = useState<ContactMethod>("Email");
  const wantsPhone = method === "Phone call" || method === "Video call";
  // Roving focus for the segmented control: an arrow key both moves the
  // selection and moves DOM focus with it, which is what the radiogroup
  // pattern requires. Without the focus move, focus would be stranded on a
  // segment that just became tabIndex={-1}.
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectMethodAt = (i: number) => {
    const next = CONTACT_METHODS[(i + CONTACT_METHODS.length) % CONTACT_METHODS.length];
    setMethod(next);
    segmentRefs.current[CONTACT_METHODS.indexOf(next)]?.focus();
  };
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

      {/* Iteration 10, Task 3 — segmented control, not a dropdown. Three
          options is squarely in the range where showing all of them beats
          hiding two behind a click, and most visitors already know which one
          they want. Keyboard support is hand-built because the native <select>
          gave it away for free and dropping it would have traded a UX point
          for an accessibility point: radiogroup semantics, aria-checked,
          roving tabIndex so the group is ONE tab stop, and arrow keys that
          move selection and focus together. */}
      <div>
        <span id="contactMethod-label" className={FIELD_LABEL_CLASSES}>
          Preferred contact method
        </span>
        <div
          role="radiogroup"
          aria-labelledby="contactMethod-label"
          className="grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-surface p-1"
          onKeyDown={(e) => {
            const i = CONTACT_METHODS.indexOf(method);
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              selectMethodAt(i + 1);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              selectMethodAt(i - 1);
            }
          }}
        >
          {CONTACT_METHODS.map((m, i) => (
            <button
              key={m}
              ref={(el) => {
                segmentRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={method === m}
              tabIndex={method === m ? 0 : -1}
              onClick={() => setMethod(m)}
              // min-h-11 is 44px, the touch-target floor. Measured without it:
              // py-2.5 on 12px mono computes to a 38px row on phones, so the
              // padding alone did NOT clear the floor the way it looks like it
              // should. An explicit min-height also survives a future type-size
              // change, which padding arithmetic would not.
              className={`flex min-h-11 items-center justify-center rounded-md px-2 py-2.5 font-mono text-xs tracking-wide transition-colors sm:text-sm ${
                method === m
                  ? "border border-accent/50 bg-accent/15 text-accent"
                  : "border border-transparent text-foreground/60 hover:text-foreground/90"
              }`}
            >
              <span className="sm:hidden">{METHOD_SHORT[m]}</span>
              <span className="hidden sm:inline">{m}</span>
            </button>
          ))}
        </div>
        {/* The control above is presentational (the buttons carry no `name`).
            This is what Formspree actually receives, under the same field name
            the select submitted, so the notification email and any Formspree
            rule keep working untouched. */}
        <input type="hidden" name="contactMethod" value={method} />
      </div>

      {/* Email or phone, depending on the preferred contact method above. The
          visible <label> stays the field's accessible name and switches with
          the field so it is never mislabelled.

          Both rows are ALWAYS mounted and swapped via the [hidden] attribute.
          They are deliberately NOT conditionally rendered. Google Translate
          rewrites React-managed text nodes in place (wrapping them in its own
          <font> elements); when React later unmounts a subtree Translate has
          rewritten, removeChild throws on a node that is no longer where React
          left it, the component stops re-rendering, and the field silently
          refuses to switch — which is exactly the bug the owner hit with
          Chrome's translate turned on. Nothing here unmounts, so React and
          Translate never fight over the same nodes, and the page stays fully
          translatable (no translate="no" needed on real content).

          `disabled` matters as much as `hidden`: a hidden-but-enabled required
          field blocks submission with a validation message the visitor cannot
          see, and disabled controls are omitted from the payload, so only the
          contact method actually chosen is submitted.

          The enter motion is a CSS keyframe that replays whenever a row goes
          from display:none back to displayed, so the swap still feels smooth
          with no mount/unmount and no animation the field depends on to
          exist. Both rows share one anatomy, so there is no height jump. */}
      <div hidden={wantsPhone} className="field-enter">
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
          required={!wantsPhone}
          disabled={wantsPhone}
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

      <div hidden={!wantsPhone} className="field-enter">
        <label
          htmlFor="phone"
          className="mb-1.5 block font-mono text-xs tracking-wide text-foreground/60"
        >
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          required={wantsPhone}
          disabled={!wantsPhone}
          autoComplete="tel"
          placeholder="+31 6 12 34 56 78"
          className={FIELD_CLASSES}
        />
        <ValidationError
          prefix="Phone"
          field="phone"
          errors={state.errors}
          className="mt-1 block text-xs text-accent"
        />
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
              it never becomes the accessible name and never blocks typing.
              Every hint stays in the DOM and only its opacity changes, for the
              same Translate-safety reason as the email/phone swap above: this
              used to mount and unmount a text node every 3.5s, which is the
              single most reliable way to make React and Google Translate
              collide on a page. Crossfading instead of swapping means nothing
              is ever removed, and the hints still translate normally. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-3 text-sm text-muted"
          >
            {MESSAGE_HINTS.map((hint, i) => (
              <span
                key={hint}
                className={`absolute left-0 top-0 whitespace-nowrap transition-opacity duration-500 motion-reduce:transition-none ${
                  showHint && i === hintIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {hint}
              </span>
            ))}
          </div>
        </div>
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="mt-1 block text-xs text-accent"
        />
      </div>

      {/* Iteration 10, Task 2. This used to be a hand-rolled <button> carrying
          its own copy of the pill classes, which is why it still had the [ ]
          motif long after Iteration 8 removed brackets from every other CTA —
          it simply never received that change. Going through the shared
          component removes the brackets, hands this button the magnet follow,
          four-channel hover brighten and copper glow that were previously
          exclusive to CtaButton instances, and means the next change to the
          site's primary button reaches the highest-intent button on the site
          for free instead of drifting away from it again. */}
      <CtaButton
        submit
        size="lg"
        fullWidth
        label={state.submitting ? "Sending..." : "Send message"}
        disabled={state.submitting}
      />

      <ValidationError
        errors={state.errors}
        className="block text-center text-xs text-accent"
      />

      {/* A visible security cue sits at the point of collection, next to copy
          that was already correct (Iteration 10, Task 4). Contrast also lifted
          from /50 to text-muted, which is the solid AA-safe token — /50 on
          graphite computes below the 4.5:1 floor for normal text. */}
      <p className="flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="10.5" width="16" height="10" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
        <span>
          Your details are used only to reply to your message. No newsletters,
          no sharing with third parties. Read the{" "}
          <Link href="/privacy" className="text-accent hover:opacity-80">
            privacy policy
          </Link>
          .
        </span>
      </p>
    </form>
  );
}
