"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { useAnimateAfterIdle } from "@/lib/useAnimateAfterIdle";
import { CtaButton } from "./CtaButton";
import { HeroVisual } from "./HeroVisual";

// Content-first paint: the headline and CTA are visible and clickable from
// first paint (no opacity/transform gate). Only decorative elements (the coded
// visual, glow) animate, and opacity fades never block interaction. No bracket
// frame around the H1 — the [ ] motif is reserved for logo + buttons.

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const animate = useAnimateAfterIdle();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* Idle-gated so the glow's opacity pulse doesn't run inside the Speed
          Index window (P7.5). */}
      <div
        aria-hidden="true"
        data-animate={animate ? "on" : "off"}
        className="anim-gate pointer-events-none absolute inset-0"
      >
        <div className="ambient-glow absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[120px]" />
        {/* Slow breathing wash across the full hero (Iteration 7, Task 1).
            Brightness only — nothing travels — so the hero stops reading as
            flat behind the scrim without pulling the eye off the headline. */}
        <div
          className="hero-breathe absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 40%, rgba(199,123,63,0.07), transparent 72%), radial-gradient(45% 40% at 12% 78%, rgba(79,179,201,0.05), transparent 70%)",
          }}
        />
      </div>
      <HeroVisual />

      <div className="relative mb-8">
        {/* Above the fold and the first brand element the visitor sees, so it
            loads with the initial resources rather than lazily. It is a tiny
            optimized asset, so preloading it costs almost nothing and stops the
            brand mark appearing after everything else. (The mobile LCP is the
            H1 text below, not this — see the perf notes in the plan.) */}
        <Image
          src="/brand/wordmark-white.png"
          alt="SetFrame"
          width={150}
          height={100}
          priority
          className="h-auto w-32 md:w-36"
        />
      </div>

      {/* Text block + its own scrim (Iteration 6, Task 3). The HeroVisual's
          leak arc and travelling beads pass directly behind this copy and were
          competing with it for attention. Rather than slowing, rerouting or
          dimming the animation — which stays at full activity everywhere else
          in the hero — a soft elliptical wash of the page background sits
          between the animation and the text, so the type always has a stable
          backing to sit on.

          It is a static CSS gradient (no image, no animation, no filter), so
          it costs nothing on the LCP path and cannot shift layout: it is
          absolutely positioned and sized in percentages of this wrapper, so it
          tracks the text at every breakpoint without a fixed height. DOM order
          does the layering — the scrim is painted first, the copy after — so
          no z-index juggling against the visual underneath. */}
      <div className="relative z-10 flex flex-col items-center">
        {/* A blurred rounded rectangle, deliberately NOT a radial gradient.
            A radial ellipse was tried first and measured badly: a gradient
            falls off by elliptical distance, so the widest line of a wide
            3-line headline lands far out on the radius. Measured per rendered
            line, the FIRST headline line sat at only 0.33 scrim alpha — the
            most important text on the page was the least protected — and
            sizing the ellipse to cover it would have swallowed ~90% of the
            hero and killed the animation everywhere.

            A rounded rect matches the shape of a text block, so the copy sits
            in a uniformly opaque core while the blur dissolves the edge within
            ~32px of the boundary. The inset padding is larger than the blur
            radius, which is what guarantees every line sits in the solid core
            rather than in the falloff. Static, no animation; the hero already
            uses a large blur for its ambient glow, so this is nothing new for
            the compositor. */}
        {/* Iteration 7, Task 2 — the scrim was bleeding onto the CTA.
            Measured before the fix: the scrim's bottom edge sat 8px BELOW the
            button's top edge, and with its 32px blur the veil covered 87% of
            the button. Because this wrapper is z-10 and the button's wrapper
            was z-auto, that veil painted OVER the button, so the button's
            hover brightening happened underneath a 0.88-alpha dark layer and
            read as going darker instead of brighter. It was never a hover-CSS
            bug.

            Two changes, so neither has to hold alone: the bottom inset is
            pulled in (the top keeps its generous inset, since that is where
            the headline needs cover) and the button is given a higher stacking
            order below. Geometry keeps them apart; z-index guarantees it even
            if the copy reflows at a width nobody measured. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-12 -top-10 -bottom-8 rounded-[48px] bg-[rgba(18,18,20,0.88)] blur-[32px]"
        />

        <h1 className="relative max-w-3xl text-center font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Your business is losing money in places you never look.
        </h1>

        <p className="relative mt-6 max-w-xl text-center text-foreground/70">
          SetFrame builds websites and systems that catch what quietly slips
          away and turn it into movement.
        </p>

        {/* The one literal fact the headline deliberately does not state: this
            is something you buy, it is made for your business specifically,
            and it arrives on a date. Kept to a single mono line rather than
            another paragraph — the page already carries a lot of prose, and
            set in mono at low contrast this reads as a spec, not as more
            marketing. The two numbers are the whole point, so they get the
            copper. */}
        <p className="relative mt-5 max-w-xl text-center font-mono text-xs leading-relaxed tracking-wide text-foreground/55">
          Websites and business systems, built to order.{" "}
          <span className="text-accent">7 days</span> to a working version,{" "}
          <span className="text-accent">30 days</span> to full rollout.
        </p>
      </div>

      {/* z-20 puts the CTA above the headline scrim's stacking context (z-10),
          and the larger top margin clears the scrim's blurred edge outright.
          No interactive element may sit under that veil. */}
      <m.div
        className="relative z-20 mt-20"
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
