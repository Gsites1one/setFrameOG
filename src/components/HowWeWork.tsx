"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// Buyer-perspective steps, framed as question -> answer for AEO.
const STEPS = [
  {
    number: "01",
    question: "Where does it start?",
    answer:
      "A conversation, not a pitch. We find where your business leaks time, leads or follow-up, and what stopping that is worth.",
  },
  {
    number: "02",
    question: "What do I see before committing?",
    answer:
      "A working preview. You see the direction with your own eyes before anything is signed, so there is nothing to take on faith.",
  },
  {
    number: "03",
    question: "When do results show up?",
    answer:
      "Launch lands in weeks, not months. Then the system keeps working: replying, reminding and booking while you run the business.",
  },
];

export function HowWeWork() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.getAttribute("data-index")));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    for (const el of stepRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  return (
    <section
      id="how"
      className="mx-auto max-w-5xl overflow-x-clip px-6 py-24"
    >
      <Reveal>
        <SectionNumber number="03" title="How working together goes." />
        <p className="-mt-6 mb-12 font-mono text-xs tracking-widest text-muted">
          scroll — how it works
        </p>
      </Reveal>

      <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-16">
        {/* Sticky number rail: desktop + motion only. */}
        {!shouldReduceMotion && (
          <div className="hidden lg:block" aria-hidden="true">
            <div className="sticky top-[38vh]">
              {/* Weight hierarchy (Task 3): active step is large and
                  copper-filled; inactive steps are small and outline-only
                  (transparent fill + text stroke), so the rail reads as one
                  deliberate mark instead of a plain number swap. */}
              <div className="flex flex-col gap-2">
                {STEPS.map((step, i) => (
                  <div
                    key={step.number}
                    className={
                      i === active
                        ? "font-display text-6xl font-bold leading-none text-accent transition-all duration-300"
                        : "font-display text-2xl font-bold leading-none text-transparent opacity-40 transition-all duration-300 [-webkit-text-stroke:1px_var(--color-foreground)]"
                    }
                  >
                    [{step.number}]
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                {STEPS.map((step, i) => (
                  <span
                    key={step.number}
                    className={`h-1 w-8 rounded-full transition-colors ${
                      i === active ? "bg-accent" : "bg-foreground/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <ol className="space-y-12 lg:space-y-0">
          {STEPS.map((step, i) => (
            <li
              key={step.number}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-index={i}
              className={
                shouldReduceMotion
                  ? "border-t border-accent/30 pt-5"
                  : "flex flex-col justify-center border-t border-accent/30 pt-5 lg:min-h-[62vh] lg:border-t-0 lg:pt-0"
              }
            >
              <m.div
                initial={shouldReduceMotion ? false : { opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.5, ease: "easeOut" }
                }
              >
                {/* number shown inline on mobile / reduced motion; the rail
                    carries it on desktop */}
                <span
                  className={`font-mono text-sm text-accent ${
                    shouldReduceMotion ? "" : "lg:hidden"
                  }`}
                >
                  [ {step.number} ]
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold sm:text-2xl">
                  {step.question}
                </h3>
                <p className="mt-3 max-w-lg text-foreground/70">{step.answer}</p>
              </m.div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
