"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BracketMark } from "./BracketMark";
import { CornerShowcase } from "./CornerShowcase";
import { CtaButton } from "./CtaButton";

const H1_LINES = ["Websites and systems", "that quietly run your business."];
const BRACKET_DURATION = 0.5;
const LINE_STAGGER = 0.12;
const LINE_DURATION = 0.4;
const SUBLINE_DELAY =
  BRACKET_DURATION + (H1_LINES.length - 1) * LINE_STAGGER + LINE_DURATION;

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <div
        aria-hidden="true"
        className="ambient-glow pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[120px]"
      />

      <div className="relative flex items-stretch justify-center gap-3 md:gap-6">
        <BracketMark
          side="left"
          duration={BRACKET_DURATION}
          className="w-3 shrink-0 text-foreground md:w-5"
        />

        <h1 className="max-w-3xl text-center font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          {H1_LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={shouldReduceMotion ? false : { y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: LINE_DURATION,
                        delay: BRACKET_DURATION + i * LINE_STAGGER,
                        ease: "easeOut",
                      }
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <BracketMark
          side="right"
          duration={BRACKET_DURATION}
          className="w-3 shrink-0 text-foreground md:w-5"
        />
      </div>

      <motion.p
        className="relative mt-6 max-w-xl text-center text-foreground/70"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.4, delay: SUBLINE_DELAY, ease: "easeOut" }
        }
      >
        SetFrame is a one-person studio in Tilburg building websites, content
        systems and automation for businesses that want things done properly.
      </motion.p>

      <motion.div
        className="relative mt-8"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.4, delay: SUBLINE_DELAY + 0.1, ease: "easeOut" }
        }
      >
        <CtaButton size="lg" />
      </motion.div>

      <motion.div
        className="relative mt-16 w-full max-w-3xl"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.5, delay: SUBLINE_DELAY + 0.2, ease: "easeOut" }
        }
      >
        <CornerShowcase />
      </motion.div>
    </section>
  );
}
