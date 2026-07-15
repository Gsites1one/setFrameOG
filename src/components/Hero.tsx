"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { CtaButton } from "./CtaButton";
import { HeroVisual } from "./HeroVisual";

// Content-first paint: the headline and CTA are visible and clickable from
// first paint (no opacity/transform gate). Only decorative elements (the coded
// visual, glow) animate, and opacity fades never block interaction. No bracket
// frame around the H1 — the [ ] motif is reserved for logo + buttons.

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
      <HeroVisual />

      <div className="relative mb-8">
        <Image
          src="/brand/wordmark-white.png"
          alt="SetFrame"
          width={150}
          height={100}
          className="h-auto w-32 md:w-36"
        />
      </div>

      <h1 className="relative max-w-3xl text-center font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
        Your business is losing money in places you never look.
      </h1>

      <p className="relative mt-6 max-w-xl text-center text-foreground/70">
        SetFrame builds websites and systems that catch what quietly slips
        away and turn it into movement.
      </p>

      <m.div
        className="relative mt-8"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }
        }
      >
        <CtaButton size="lg" />
      </m.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-muted"
      >
        scroll
      </div>
    </section>
  );
}
