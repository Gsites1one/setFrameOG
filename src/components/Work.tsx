import { WEBSITE_PROJECT } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";
import { SystemsStrip } from "./SystemsStrip";
import { WebsiteCard } from "./WebsiteCard";

// Plain copper numerals (no brackets — the [ ] motif is logo + buttons only).
const WHY_WEBSITES = [
  { number: "01", text: "Search engines answer first now. Visitors arrive half-decided." },
  { number: "02", text: "Your website has one job: turn that trust into action." },
  { number: "03", text: "Growing businesses run systems of pages, not a brochure." },
];

export function Work() {
  return (
    <section id="work" className="overflow-hidden py-24" aria-label="Selected work">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionNumber number="01" title="Work that moves businesses forward." />
        </Reveal>

        <Reveal delay={0.1}>
          <ul
            className="mb-12 grid gap-4 sm:grid-cols-3"
            aria-label="Why your website matters now"
          >
            {WHY_WEBSITES.map((item) => (
              <li key={item.number} className="flex gap-3">
                <span className="shrink-0 font-mono text-sm font-medium text-accent">
                  {item.number}
                </span>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* One website project, shown as two prototypes of one concept. */}
        <Reveal delay={0.15}>
          <div className="mb-6">
            <h3 className="font-display text-lg font-semibold">
              {WEBSITE_PROJECT.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-foreground/60">
              {WEBSITE_PROJECT.concept}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {WEBSITE_PROJECT.prototypes.map((prototype) => (
              <WebsiteCard key={prototype.slug} prototype={prototype} />
            ))}
          </div>
        </Reveal>
      </div>

      {/* Systems strip — full-bleed, tiles link into /knowledge. */}
      <div className="mt-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h3 className="font-display text-xl font-bold sm:text-2xl">
              Systems that run quietly in the background.
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/60">
              The kinds of systems SetFrame builds to catch what a business
              loses. Tap any one to see what it does.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <SystemsStrip />
        </Reveal>
      </div>
    </section>
  );
}
