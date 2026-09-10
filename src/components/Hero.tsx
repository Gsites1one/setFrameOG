"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { useAnimateAfterIdle } from "@/lib/useAnimateAfterIdle";
import { CtaButton } from "./CtaButton";
import { TrustStrip } from "./TrustStrip";

// Content-first paint: the headline and CTA are visible and clickable from
// first paint (no opacity/transform gate). Only decorative elements animate,
// and opacity fades never block interaction.
//
// Iteration 11 settled the hero after a side-by-side preview. The bracket
// frame won, which is a deliberate reversal of the older "brackets are for
// logo and buttons only" rule: the frame is structural here, at low stroke
// opacity, sized off the copy block rather than applied to a control, so it
// reads as the brand's own geometry rather than as a button that cannot be
// clicked. The rule still holds everywhere else on the site.
//
// Gone with that decision: the opaque headline scrim (every generation of it,
// through Iteration 10's frosted version) and HeroVisual's flanking node
// clusters. The scrim existed only because the clusters passed behind the
// copy; with the clusters gone it had nothing left to protect against, and
// .hero-text-shadow carries legibility on its own — measured below.

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const animate = useAnimateAfterIdle();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 sm:py-24"
    >
      {/* Idle-gated so the opacity pulse doesn't run inside the Speed Index
          window (P7.5).

          Iteration 12 removed this layer's own 36rem blur-[120px] copper blob,
          which sat centred at left-1/2 top-1/3 — directly behind the headline.
          It dated from before the aurora rebuild, when the hero had to supply
          its own depth. Post-Iteration-11 it was the second of five soft copper
          layers stacked in exactly the region the headline needs to stay
          readable in (this blob, LifeBackground's ambient-glow-drift, the four
          aurora blobs, gradient-shift, and the breathe wash below), and it was
          the only one that was both redundant and aimed at the copy.

          The breathe wash below STAYS: it is already an order of magnitude
          fainter (0.05-0.07 against the blob's full bg-accent), and contrast
          was re-measured after removing the blob rather than assumed. */}
      <div
        aria-hidden="true"
        data-animate={animate ? "on" : "off"}
        className="anim-gate pointer-events-none absolute inset-0"
      >
        {/* Slow breathing wash across the full hero (Iteration 7, Task 1).
            Brightness only — nothing travels — so the hero keeps some life
            without pulling the eye off the headline. */}
        <div
          className="hero-breathe absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 40%, rgba(199,123,63,0.07), transparent 72%), radial-gradient(45% 40% at 12% 78%, rgba(79,179,201,0.05), transparent 70%)",
          }}
        />
      </div>

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

      {/* Copy block. Four iterations of scrim history lived here (Iteration 6
          introduced it as a blurred rounded rect after a radial ellipse
          measured badly; 7 fixed it painting over the CTA's hover state; 9
          pulled its bottom inset in; 10 traded opacity for backdrop-blur). All
          of it is gone, and none of it needs re-litigating, because the thing
          it defended against is gone too: the scrim existed to stop
          HeroVisual's leak arc and travelling beads competing with the copy,
          and those clusters were removed with the variant decision.

          What remains is z-10 on this wrapper and z-20 on the CTA below. That
          stacking is kept deliberately even with no veil left to sit under —
          it costs nothing and it is what stopped the Iteration 7 bug being
          possible at widths nobody measured. */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Corner brackets only: not a closed box, not filled, no glow or
            shadow on the bracket itself, so it frames the copy without
            competing with it. Top-left and bottom-right rather than all four,
            which is the logo's own [ ] anatomy scaled up.

            It occupies the same absolutely-positioned slot the scrim used, so
            it tracks the copy block at every breakpoint with no fixed height,
            and it is aria-hidden + pointer-events-none: it is pure decoration
            and must never land in the accessibility tree or eat a click. */}
        <div
          aria-hidden="true"
          data-animate={animate ? "on" : "off"}
          className="anim-gate pointer-events-none absolute -inset-x-6 -inset-y-8 sm:-inset-x-10"
        >
          {/* Iteration 12: the same two corners, now SVG paths that draw
              themselves in once on mount instead of appearing fully formed.

              pathLength="100" normalises each path to 100 units regardless of
              its real geometry, so one dasharray/dashoffset pair in CSS drives
              both brackets and keeps working if the arm lengths ever change.
              vectorEffect="non-scaling-stroke" holds the stroke at exactly 1px
              at BOTH sizes — without it the 48-unit viewBox scaled up to 64px
              at sm would render a 1.33px stroke and stop matching the 1px
              border it replaces.

              Same stroke-dashoffset technique as .pipe-flow and
              .score-ring-draw already in globals.css, not a new pattern.
              Wrapped in .anim-gate on the same data-animate flag the ambient
              layer above uses, so it cannot run inside the Speed Index
              window. */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="absolute left-0 top-0 h-12 w-12 sm:h-16 sm:w-16"
          >
            <path
              d="M0.5 48 L0.5 0.5 L48 0.5"
              pathLength="100"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="bracket-draw text-accent/30"
            />
          </svg>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="absolute bottom-0 right-0 h-12 w-12 sm:h-16 sm:w-16"
          >
            <path
              d="M47.5 0 L47.5 47.5 L0 47.5"
              pathLength="100"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="bracket-draw bracket-draw-delayed text-accent/30"
            />
          </svg>
        </div>

        {/* Scale is unchanged from production. The headline step-up belonged
            to the losing variant, which leaned entirely on typography; the
            bracket does the framing here, so the type did not need to grow. */}
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

        {/* Iteration 12 — blueprint treatment, so this card stops reading as a
            generic bordered box. Two additions only, both deliberately quiet
            because this sits centimetres from body copy rather than inside a
            standalone piece of art:

            1. Corner tick marks, inset INSIDE the card rather than outside, so
               they read as registration marks on a technical drawing rather
               than as a second border competing with the real one. Same
               border-white/10 weight as the card edge.
            2. A small radial copper glow behind each NUMERAL, not behind the
               whole card. Kept at /10 rather than /15 on measurement: a
               glow behind text raises the local background luminance, and /15
               left the numeral at 3.89:1 against the 3:1 large-text floor
               where /10 holds 4.20:1 for a difference the eye barely reads. Contrast was re-measured after adding it, because a
               glow behind text raises the local background luminance and these
               numerals are already the tightest copper on the page. */}
        <div className="relative mt-3 sm:mt-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2 z-10"
          >
            <div className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-white/10" />
            <div className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-white/10" />
            <div className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-white/10" />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-white/10" />
          </div>

          <div className="grid grid-cols-2 divide-x divide-white/10 rounded-2xl border border-white/10 bg-surface/70 py-4">
            <div className="px-3 text-center sm:px-4">
              <span className="relative block">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[14px]"
                />
                <span className="relative block font-mono text-xl font-bold leading-none text-accent sm:text-2xl">
                  7 days
                </span>
              </span>
              <span className="mt-2 block text-xs leading-snug text-foreground/75 sm:text-sm">
                to a working version
              </span>
            </div>
            <div className="px-3 text-center sm:px-4">
              <span className="relative block">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[14px]"
                />
                <span className="relative block font-mono text-xl font-bold leading-none text-accent sm:text-2xl">
                  30 days
                </span>
              </span>
              <span className="mt-2 block text-xs leading-snug text-foreground/75 sm:text-sm">
                to full rollout
              </span>
            </div>
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

        {/* Iteration 12. Kept ALONGSIDE the line above rather than replacing
            it, because the two are not the same reassurance: the microcopy is
            about the call itself (the CTA books one), the strip is about the
            engagement that follows it. Dropping either would lose a distinct
            objection rather than de-duplicate one.

            It sits above the secondary link on purpose, so the hero still ENDS
            on an onward path for anyone not ready to book, rather than on a
            fact list. Same three FACTS already defined in TrustStrip — no new
            copy, and the same wording the closing band and /contact use. */}
        <TrustStrip className="mt-5 max-w-sm sm:max-w-none" />

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
          {/* accent-text, not brand copper: it is 14px and sits on the bare
              background. aria-hidden, so strictly it is decoration — but a
              glyph a sighted reader is meant to read is text in practice. */}
          <span aria-hidden="true" className="text-accent-text">
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
