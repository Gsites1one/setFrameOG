import Image from "next/image";
import { ArtFrame } from "./ArtFrame";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// Section 01 — "The foundation" (Iteration 4, revised). Three co-equal pillars
// sit SIDE BY SIDE, not stacked: a vertical stack read as a ranking (top =
// most important), which these three are not. In one row they carry equal
// weight.
//
// The three artworks have different native aspect ratios and baked-in legend
// text that must never be cropped, so each sits object-contain inside one
// shared aspect box; the art's own dark background blends into the letterbox
// so the boxes read as equal without cropping any text.
//
// Copy meaning and pain-first order are locked; wording is tuned for rhythm.
// The movement art already labels the four outcomes (time / leads / costs /
// revenue), so its copy gives only the framing line, never repeats that list.

const PILLARS = [
  {
    slug: "movement",
    image: "/pillars/movement.webp",
    alt: "A dark mountain range with a glowing path climbing to a sunlit summit, marked with four milestones: time back, leads that stop going cold, costs that stop leaking, revenue that grows.",
    heading: "Movement, not technology.",
    body: [
      "What matters is never what gets installed. It is what changes once it does, and every build is measured by that move alone.",
    ],
  },
  {
    slug: "tailored",
    image: "/pillars/tailored.webp",
    alt: "A tailor measuring a client beside a bespoke suit on a stand, a rack of identical suits behind them, labelled conversation, understanding, built for you, feedback until it fits.",
    heading: "Built for your business, not from a template.",
    body: [
      "It starts with a conversation, not a pitch, and every project is shaped around one specific business.",
      "Feedback runs until the goal is reached. No copied patterns, no convincing, just agreement and execution.",
    ],
  },
  {
    slug: "preview",
    image: "/pillars/preview.webp",
    alt: "A glowing dashboard behind a sealed, unsigned envelope and a fountain pen on red velvet, with a plaque reading a working preview before anything is signed.",
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
        {PILLARS.map((pillar, i) => (
          <Reveal key={pillar.slug} delay={i * 0.08}>
            <div className="flex h-full flex-col">
              <ArtFrame className="aspect-[4/3]">
                <Image
                  src={pillar.image}
                  fill
                  alt={pillar.alt}
                  sizes="(max-width: 768px) 100vw, 360px"
                  loading={i === 0 ? "eager" : "lazy"}
                  priority={i === 0}
                  className="object-contain"
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
