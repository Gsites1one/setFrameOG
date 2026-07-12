"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BracketMark } from "./BracketMark";
import { CornerShowcase } from "./CornerShowcase";
import { CtaButton } from "./CtaButton";

const H1_LINES = ["Your business is losing money", "in places you never look."];
const BRACKET_DURATION = 0.5;
const LINE_STAGGER = 0.12;
const LINE_DURATION = 0.4;
const SUBLINE_DELAY =
  BRACKET_DURATION + (H1_LINES.length - 1) * LINE_STAGGER + LINE_DURATION;

// Keyword-level distillation only: signals insight without teaching the method.
const WHY_WEBSITES = [
  {
    number: "[ 01 ]",
    text: "Search engines answer first now. Visitors arrive half-decided.",
  },
  {
    number: "[ 02 ]",
    text: "Your website has one job: turn that trust into action.",
  },
  {
    number: "[ 03 ]",
    text: "Growing businesses run systems of pages, not a brochure.",
  },
];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = (delay: number) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { duration: 0.4, delay, ease: "easeOut" as const },
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <div
        aria-hidden="true"
        className="ambient-glow pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[120px]"
      />

      <motion.div
        className="relative mb-8"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }
        }
      >
        <Image
          src="/brand/wordmark-white.png"
          alt="SetFrame"
          width={150}
          height={100}
          priority
          className="h-auto w-32 md:w-36"
        />
      </motion.div>

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
        {...fadeIn(SUBLINE_DELAY)}
      >
        SetFrame builds websites and systems that catch what quietly slips
        away and turn it into movement.
      </motion.p>

      <motion.div className="relative mt-8" {...fadeIn(SUBLINE_DELAY + 0.1)}>
        <CtaButton size="lg" />
      </motion.div>

      <motion.div
        className="relative mt-16 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[3fr_2fr]"
        {...fadeIn(SUBLINE_DELAY + 0.2)}
      >
        <CornerShowcase />

        <ul className="space-y-6" aria-label="Why your website matters now">
          {WHY_WEBSITES.map((item, i) => (
            <motion.li
              key={item.number}
              className="flex gap-4"
              {...fadeIn(SUBLINE_DELAY + 0.35 + i * 0.15)}
            >
              <span className="shrink-0 font-mono text-sm text-accent">
                {item.number}
              </span>
              <p className="text-sm leading-relaxed text-foreground/80">
                {item.text}
              </p>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
