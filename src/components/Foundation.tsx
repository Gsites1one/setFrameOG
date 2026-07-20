import Image from "next/image";
import { ArtFrame } from "./ArtFrame";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// Section 01 — "The foundation" (Iteration 4, Task 1). Three monumental,
// equal-weight pillars replace the old 10-card grid. They share one anatomy
// (heading scale, supporting-copy style, art treatment via ArtFrame, vertical
// rhythm) even though the artworks have different aspect ratios.
//
// Copy meaning and pain-first order are locked; wording is tuned for rhythm.
// Never lead with technology. Panel 1's art already labels the four outcomes
// (time / leads / costs / revenue), so the HTML gives only the framing line,
// never repeats that list.

const SPLIT_PILLARS = [
  {
    slug: "tailored",
    artSide: "left" as const,
    aspect: "aspect-square",
    image: "/pillars/tailored.webp",
    width: 1440,
    height: 1440,
    alt: "A tailor measuring a client beside a bespoke suit on a stand, a rack of identical suits behind them, labelled conversation, understanding, built for you, feedback until it fits.",
    heading: "Built for your business, not from a template.",
    body: [
      "It starts with a conversation, not a pitch, and every project is shaped around one specific business.",
      "Feedback runs until the goal is reached. No copied patterns, no convincing, just agreement and execution.",
    ],
  },
  {
    slug: "preview",
    artSide: "right" as const,
    aspect: "aspect-[3/2]",
    image: "/pillars/preview.webp",
    width: 1536,
    height: 1024,
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
    <section id="services" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <SectionNumber number="01" title="The foundation." />
      </Reveal>

      <div className="space-y-16 md:space-y-24">
        {/* Panel 1 — 16:9 panorama, full content width, headline above. */}
        <Reveal>
          <div>
            <div className="mb-6 max-w-2xl">
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                Movement, not technology.
              </h3>
              <p className="mt-3 leading-relaxed text-foreground/70">
                What matters is never what gets installed. It is what changes
                once it does, and every build is measured by that move alone.
              </p>
            </div>
            <ArtFrame>
              <Image
                src="/pillars/movement.webp"
                width={1672}
                height={941}
                alt="A dark mountain range with a glowing path climbing to a sunlit summit, marked with four milestones: time back, leads that stop going cold, costs that stop leaking, revenue that grows."
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="h-auto w-full"
                priority
              />
            </ArtFrame>
          </div>
        </Reveal>

        {/* Panels 2 & 3 — two-column split rows, alternating art side. Mobile
            always stacks art above text. */}
        {SPLIT_PILLARS.map((pillar) => (
          <Reveal key={pillar.slug}>
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <ArtFrame
                className={`${pillar.aspect} ${
                  pillar.artSide === "right" ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={pillar.image}
                  fill
                  alt={pillar.alt}
                  sizes="(max-width: 768px) 100vw, 480px"
                  loading="lazy"
                  className="object-cover"
                />
              </ArtFrame>
              <div className={pillar.artSide === "right" ? "md:order-1" : ""}>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">
                  {pillar.heading}
                </h3>
                {pillar.body.map((line) => (
                  <p
                    key={line}
                    className="mt-3 leading-relaxed text-foreground/70"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
