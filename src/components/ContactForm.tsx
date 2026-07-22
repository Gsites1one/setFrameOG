"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, ValidationError } from "@formspree/react";
import { useReducedMotion } from "framer-motion";

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
  const [method, setMethod] = useState("Email");
  const wantsPhone = method === "Phone call" || method === "Video call";
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
          htmlFor="contactMethod"
          className="mb-1.5 block font-mono text-xs tracking-wide text-foreground/60"
        >
          Preferred contact method
        </label>
        {/* Each option carries an explicit value. This is load-bearing, not
            tidiness: an <option> with no value attribute takes its value from
            its own text, so when Chrome's translate rewrites the labels the
            selected value becomes the translated string, `method` never again
            equals "Phone call", and the field below silently refuses to switch
            from email to phone. That was the owner-reported bug, and it only
            ever appeared with translation on. Translate rewrites visible text
            but not attributes, so an explicit value stays stable in every
            language — and the submitted value stays consistent in the inbox
            instead of arriving in whatever language the visitor was reading. */}
        <select
          id="contactMethod"
          name="contactMethod"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={FIELD_CLASSES}
        >
          <option value="Email">Email</option>
          <option value="Phone call">Phone call</option>
          <option value="Video call">Video call</option>
        </select>
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
