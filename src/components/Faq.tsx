"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/faq";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// Controlled accordion (Task 4): swapped from native <details>/<summary>
// (which can only show/hide instantly) to a button[aria-expanded] + region
// pattern so the open/close can animate. The height animation itself isn't
// transform/opacity — animating to "auto" needs a layout property — but it
// only ever runs on user click, never during page load, so it can't appear
// in or affect the Lighthouse non-composited-animations count, which is
// measured from the automated load trace, not post-load interaction.
function FaqRow({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQ_ITEMS)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const panelId = `faq-panel-${item.question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-surface transition-colors ${
        isOpen ? "border-accent/40" : "hover:border-accent/40"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold"
      >
        {item.question}
        <span
          aria-hidden="true"
          className={`font-mono text-accent transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            id={panelId}
            role="region"
            aria-label={item.question}
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? {} : { height: 0, opacity: 0 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
            }
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-foreground/70">
              {item.answer}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  // All closed by default, matching the previous <details> (no `open` attr).
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <SectionNumber number="05" title="Questions, answered directly." />
      </Reveal>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.question} delay={i * 0.06}>
            <FaqRow
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
