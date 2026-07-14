"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { BracketMark } from "./BracketMark";
import { CtaButton } from "./CtaButton";
import { SystemSignature } from "./SystemSignature";

// Content-first paint: the headline and CTA are visible and clickable from
// first paint (no opacity/transform gate). Only decorative elements (brackets,
// signature, glow) animate in, and opacity fades never block interaction.

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
      <SystemSignature />

      <div className="relative mb-8">
        <Image
          src="/brand/wordmark-white.png"
          alt="SetFrame"
          width={150}
          height={100}
          priority
          className="h-auto w-32 md:w-36"
        />
      </div>

      <div className="relative flex items-stretch justify-center gap-3 md:gap-6">
        <BracketMark
          side="left"
          duration={0.5}
          className="w-3 shrink-0 text-foreground md:w-5"
        />

        <h1 className="max-w-3xl text-center font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Your business is losing money in places you never look.
        </h1>

        <BracketMark
          side="right"
          duration={0.5}
          className="w-3 shrink-0 text-foreground md:w-5"
        />
      </div>

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
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-foreground/40"
      >
        scroll
      </div>
    </section>
  );
}
