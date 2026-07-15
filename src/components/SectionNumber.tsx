"use client";

import { m, useReducedMotion } from "framer-motion";

type SectionNumberProps = {
  /** Two-digit number, e.g. "01". */
  number: string;
  title: string;
};

// Section mark (P7.2): an oversized low-opacity mono numeral sitting behind
// the title like a watermark, plus a short copper hairline rule that draws in
// on section-enter. No brackets — the [ ] motif is reserved for logo + buttons.
// transform/opacity only; reduced-motion renders the rule fully drawn.
export function SectionNumber({ number, title }: SectionNumberProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative mb-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-1 -top-10 select-none font-mono text-7xl font-medium leading-none text-foreground/[0.06] sm:text-8xl"
      >
        {number}
      </span>
      <div className="relative">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        <m.div
          aria-hidden="true"
          className="mt-4 h-px w-16 origin-left bg-accent"
          initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={
            shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }
          }
        />
      </div>
    </div>
  );
}
