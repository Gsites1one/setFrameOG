"use client";

import Image from "next/image";
import Link from "next/link";
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 sm:py-24"
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

      {/* Tighter on phones (Iteration 9, Task 5): the hero now carries the
          proof bar and two CTAs below the copy, so the space above the headline
          is the cheapest place to buy vertical room back. */}
      <div className="relative mb-6 sm:mb-8">
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
          className="h-auto w-28 sm:w-32 md:w-36"
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
        {/* Iteration 9: the bottom inset is pulled in one more step (-bottom-8
            -> -bottom-6). The mono commitment line used to be the last child of
            this wrapper and needed cover; it has moved out into the proof bar
            below, so the wrapper now ends at the subline and the veil no longer
            needs to reach as far down. The top inset is untouched — that is
            where the headline actually needs the backing. */}
        {/* Iteration 10, Task 1 — opacity traded for depth. At 0.88 alpha on a
            near-black fill this was functionally opaque: one dead, unmoving
            rectangle sitting in the middle of a screen where the ambient glow
            and hero-breathe wash visibly drift everywhere else. Note the
            blur-[32px] never helped with that — it is a `filter`, so it
            softens this box's OWN edges and does nothing to what is behind it.

            Now the fill is translucent (0.5) and backdrop-blur-2xl diffuses the
            glow through the panel, so the light keeps moving underneath rather
            than being blocked. What is NOT reopened here: the rounded-rect
            shape (a radial ellipse was measured and failed — first headline
            line at 0.33 alpha, Iteration 6 Task 3), the insets, and the
            z-10/z-20 stacking that keeps the CTA clear of the veil.

            The alpha could only come down this far because .hero-text-shadow
            below carries legibility independently. Measured after the change,
            identical at 320/768/1440 because nothing here is breakpoint-
            dependent: compositing the panel over the ambient glow AND the
            breathe wash both held at their keyframe peaks gives a worst-case
            surface of rgb(34,27,24), against which the headline reads 15.56:1
            and the subline 9.26:1. AA needs 4.5:1. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-12 -top-10 -bottom-6 rounded-[48px] bg-[rgba(18,18,20,0.5)] backdrop-blur-2xl blur-[32px]"
        />

        <h1 className="hero-text-shadow relative max-w-3xl text-center font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Your business is losing money in places you never look.
        </h1>

        {/* Wording is fixed. Only the measure changes with the breakpoint:
            capped near 34 characters on phones so the sentence breaks into
            short, scannable lines instead of running the full column width,
            then back to max-w-xl from sm up. text-pretty stops a single word
            being orphaned on the last line at any width. */}
        <p className="hero-text-shadow relative mt-5 max-w-[19rem] text-pretty text-center leading-relaxed text-foreground/75 sm:mt-6 sm:max-w-xl">
          SetFrame builds websites and systems that catch what quietly slips
          away and turn it into movement.
        </p>
      </div>

      {/* ── Proof bar (Iteration 9, Task 2) ──────────────────────────────────
          The delivery commitment used to be one 12px mono line at 55% opacity
          sitting under the subline — the most concrete, checkable thing on the
          page, set as the least legible text in the hero. Same words, promoted:
          the two dates become paired stat callouts and read as a commitment
          rather than fine print.

          "Websites and business systems, built to order." stays, as a standalone
          label line directly above the strip. It is the sentence that says what
          is being sold and that it is made to order — dropping it would leave two
          bare numbers with nothing to attach to. It keeps the mono face (it is
          still a spec line, not marketing prose) but steps up from 12px/55% to
          12-13px at 70%, which is where Task 4's legibility fix lands.

          Numerals are Space Mono, matching the section numbers and the FAQ
          numbering — Syne stays on headings and button labels. The copper on the
          two figures is the same accent the old sentence already gave them.

          z-20 for the same reason the CTA has it: this sits below the headline
          scrim's blurred bottom edge and must never be painted under that veil.
          No motion gate on it — it is proof, so it is in the first paint. */}
      <div className="relative z-20 mt-10 w-full max-w-md sm:mt-12">
        <p className="text-center font-mono text-xs leading-relaxed tracking-wide text-foreground/70 sm:text-[13px]">
          Websites and business systems, built to order.
        </p>

        <div className="mt-3 grid grid-cols-2 divide-x divide-white/10 rounded-2xl border border-white/10 bg-surface/70 py-4 sm:mt-4">
          <div className="px-3 text-center sm:px-4">
            <span className="block font-mono text-xl font-bold leading-none text-accent sm:text-2xl">
              7 days
            </span>
            <span className="mt-2 block text-xs leading-snug text-foreground/75 sm:text-sm">
              to a working version
            </span>
          </div>
          <div className="px-3 text-center sm:px-4">
            <span className="block font-mono text-xl font-bold leading-none text-accent sm:text-2xl">
              30 days
            </span>
            <span className="mt-2 block text-xs leading-snug text-foreground/75 sm:text-sm">
              to full rollout
            </span>
          </div>
        </div>
      </div>

      {/* z-20 puts the CTA above the headline scrim's stacking context (z-10).
          No interactive element may sit under that veil. */}
      <m.div
        className="relative z-20 mt-8 flex flex-col items-center sm:mt-10"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }
        }
      >
        {/* "Book a 15-minute call" names the actual next step and its cost in
            time. The nav pill and the closing band keep their own wording —
            this is the hero instance only. */}
        <CtaButton size="lg" label="Book a 15-minute call" />

        {/* Deliberately the same phrase section 03 step 1 already uses ("A
            conversation, not a pitch"), so the promise made at the button and
            the promise made in the process section are word-for-word the same
            rather than two similar-sounding claims. */}
        <p className="mt-3 text-center text-[13px] text-foreground/70">
          A conversation, not a pitch — no obligation.
        </p>

        {/* Colder visitors get a way through that is not "talk to someone".
            Same arrow-link anatomy as "Discover the process →" — Syne label,
            border-b that lights on hover, copper arrow — one step down in size
            and starting at 70% opacity so it never competes with the button
            directly above it. */}
        <Link
          href="/work"
          className="group mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-foreground/70 transition-colors hover:text-accent"
        >
          <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-accent">
            See recent builds
          </span>
          <span aria-hidden="true" className="text-accent">
            →
          </span>
        </Link>
      </m.div>

      {/* Iteration 9, Task 6 — the "scroll" cue is gone rather than upgraded.
          A chevron version was built and measured first, and the measurement is
          what killed it. The cue was absolutely positioned at the BOTTOM OF THE
          SECTION, not of the viewport, and with the proof bar and second CTA
          added the hero is now taller than the screen at every width checked:
          918px against a 700px viewport at 320px, 956px against 900px at 1440px.
          The cue therefore sat below the fold on phone AND desktop — it could
          never do its job. At 320px it was worse than useless: it landed with a
          0px gap against the "See recent builds" link, and the only fixes were
          extra bottom padding (pushing the CTA further down, straight against
          Task 5) or a per-breakpoint hide.

          Nothing is lost. The hero overflowing the fold is itself the strongest
          possible scroll cue — the next section is visibly cut off at the bottom
          of the screen — and the hero now ends on an explicit onward link rather
          than a dead end. */}
    </section>
  );
}
