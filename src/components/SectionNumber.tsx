"use client";

import { m, useReducedMotion } from "framer-motion";

type SectionNumberProps = {
  /** Two-digit number, e.g. "01". */
  number: string;
  title: string;
};

// Shared "bracket beam" section mark (Task 3): a larger mono number with a
// small bracket-corner accent, paired with a thin copper line that draws in
// once on section-enter. transform/opacity only, so it stays compositor-safe;
// reduced-motion renders the line fully drawn with no animation.
export function SectionNumber({ number, title }: SectionNumberProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4">
        <span className="relative inline-flex px-1 font-mono text-2xl font-semibold text-accent sm:text-3xl">
          <span
            aria-hidden="true"
            className="absolute -left-1 -top-1.5 h-2.5 w-2.5 border-l-2 border-t-2 border-accent/50"
          />
          [{number}]
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 -right-1 h-2.5 w-2.5 border-b-2 border-r-2 border-accent/50"
          />
        </span>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      <m.div
        aria-hidden="true"
        className="mt-4 h-px w-full origin-left bg-accent/50"
        initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={
          shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }
        }
      />
    </div>
  );
}
