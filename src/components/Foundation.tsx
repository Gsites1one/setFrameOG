import Image from "next/image";
import { ArtFrame } from "./ArtFrame";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// Section 01 — "The foundation" (Iteration 4, revised). Three co-equal pillars
// sit SIDE BY SIDE, not stacked: a vertical stack read as a ranking (top =
// most important), which these three are not. In one row they carry equal
// weight.
//
// The three artworks have different native aspect ratios (1.50 / 1.38 / 1.00),
// so object-contain letterboxed each one differently — one bar top/bottom, one
// left/right — and the panels read as three mismatched frames. They now fill
// one shared 4:3 box with object-cover and are centre-cropped, so all three
// present an identical rectangle.
//
// This used to be object-contain because an earlier generation of these
// artworks had legend text baked into the image that cropping would have cut.
// The current files (supplied in 4.1) are plain cinematic photographs with no
// text in them, so that constraint no longer applies. Verified by opening each
// file before switching.
//
// Copy meaning and pain-first order are locked; wording is tuned for rhythm.
// The movement art already labels the four outcomes (time / leads / costs /
// revenue), so its copy gives only the framing line, never repeats that list.

const PILLARS = [
  {
    slug: "movement",
    image: "/pillars/movementv2.webp",
    alt: "A hand placing a chess knight under a warm lamp, a glowing copper trail marking the square it moved from.",
    heading: "Movement, not technology.",
    body: [
      "What matters is never what gets installed. It is what changes once it does, and every build is measured by that move alone.",
      "A three-hour job that comes back as thirty minutes is a result. A new dashboard is not.",
    ],
  },
  {
    slug: "tailored",
    image: "/pillars/tailored.webp",
    alt: "A tailor measuring a client beside a bespoke suit on a stand, a rack of identical off-the-peg suits behind them, a copper thread of light running from the workbench to the suit.",
    heading: "Built for your business, not from a template.",
    body: [
      "It starts with a conversation, not a pitch, and every project is shaped around one specific business.",
      "Feedback runs until the goal is reached. No copied patterns, no convincing, just agreement and execution.",
    ],
  },
  {
    slug: "preview",
    image: "/pillars/preview.webp",
    alt: "A glowing dashboard screen behind a sealed, unsigned envelope and a fountain pen resting on red velvet.",
    heading: "See it working before you commit.",
    body: [
      "A working preview exists before anything is signed, so you judge the result with your own eyes instead of a promise.",
      "The tools stay invisible. The result is the pitch.",
    ],
  },
];

export function Foundation() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <SectionNumber number="01" title="The foundation." />
      </Reveal>

      <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
        {/* Staggered scroll-in entrance (Iteration 6, Task 4): 120ms between
            panels. The rest of the requested spec was already in place via the
            shared Reveal system — translateY(24px), 0.5s, ease-out, fires once
            (the observer unobserves on reveal, so scrolling back never
            replays), and prefers-reduced-motion jumps straight to the final
            state. Only the stagger was off spec (80ms).

            Deliberately NOT rebuilt on Framer Motion whileInView: Reveal was
            converted OFF Framer precisely to cut hydration cost, and Foundation
            is a server component today. Reintroducing it here would mean
            shipping JS and a "use client" boundary for an effect that already
            runs in CSS, with no visual difference. */}
        {PILLARS.map((pillar, i) => (
          <Reveal key={pillar.slug} delay={i * 0.12}>
            <div className="flex h-full flex-col">
              <ArtFrame className="aspect-[4/3]">
                {/* All three pillars lazy-load. The section sits ~1080px down
                    the page, below the fold on both mobile and desktop (the
                    hero is min-h-screen), so none of them is the LCP. Pillar 1
                    previously had priority+eager, which injected a preload for
                    a below-the-fold image that competed with the above-the-fold
                    Syne font — the actual mobile LCP element — on the throttled
                    mobile connection, delaying it. Removing that lets the hero
                    font win the pipe first. */}
                <Image
                  src={pillar.image}
                  fill
                  alt={pillar.alt}
                  sizes="(max-width: 768px) 100vw, 360px"
                  loading="lazy"
                  className="object-cover object-center"
                />
              </ArtFrame>
              <h3 className="mt-6 font-display text-xl font-bold leading-snug sm:text-2xl">
                {pillar.heading}
              </h3>
              {pillar.body.map((line) => (
                <p
                  key={line}
                  className="mt-3 text-sm leading-relaxed text-foreground/70"
                >
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
