"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

// The three "why work with me" reasons as ONE quiet rotating line
// (Iteration 4.1, item 6): the previous three-card grid pulled too much
// attention on a page whose only job is the form. One reason shows at a
// time, crossfading 1-2-3-1-2-3 (~6s each, paused on hover so it can be
// read); copper line-icon + title + body, with small progress dots.
// Reduced motion: no rotation, all three rendered as a plain static list.

type IconProps = { className?: string };

function IconAccountability({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSystems({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.7 7.3 8.5 16M6.8 6.4 17 8.4M17.6 10.6 11.4 16.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDurable({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3 19 6v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const REASONS = [
  {
    Icon: IconAccountability,
    title: "One person, full accountability",
    body: "You talk directly to the person who designs and builds your project. No handoffs, no account managers, no lost context.",
  },
  {
    Icon: IconSystems,
    title: "Systems, not just pages",
    body: "Websites come wired with the follow-up, booking and content flows that keep working after launch. The site is the start, not the end.",
  },
  {
    Icon: IconDurable,
    title: "Built to last",
    body: "Fast, accessible and easy to update. You own everything that gets built, from the code to the content.",
  },
];

const HOLD_MS = 6000;

export function ContactReasons() {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % REASONS.length),
      HOLD_MS
    );
    return () => window.clearInterval(id);
  }, [shouldReduceMotion, paused]);

  // Reduced motion: plain static list, nothing rotates.
  if (shouldReduceMotion) {
    return (
      <section aria-label="Why SetFrame" className="mt-12 space-y-5">
        {REASONS.map((reason) => (
          <div key={reason.title} className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/30 text-accent">
              <reason.Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">
                {reason.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                {reason.body}
              </p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  const reason = REASONS[index];

  return (
    <section
      aria-label="Why SetFrame"
      className="mt-12 rounded-xl border border-white/10 bg-surface/60 p-5"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Fixed min-height so the card never resizes as copy length changes. */}
      <div className="relative min-h-[7.5rem] sm:min-h-[6rem]">
        <AnimatePresence mode="wait">
          <m.div
            key={reason.title}
            className="flex items-start gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/30 text-accent">
              <reason.Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">
                {reason.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                {reason.body}
              </p>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Progress dots double as manual controls. */}
      <div className="mt-4 flex items-center gap-2">
        {REASONS.map((r, i) => (
          <button
            key={r.title}
            type="button"
            aria-label={`Show reason ${i + 1}: ${r.title}`}
            aria-current={i === index || undefined}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-accent" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
