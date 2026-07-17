import { WEBSITE_PROJECT } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";
import { SystemsStrip } from "./SystemsStrip";
import { WebsiteCard } from "./WebsiteCard";

// Proof section (P9): shows both sides of the capability stated in "What gets
// built" — websites that are live AND the systems running behind them — as one
// cohesive body of work, so the page never re-narrows to websites-only.
export function Work() {
  return (
    <section id="work" className="overflow-hidden py-24" aria-label="Built and running">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionNumber number="02" title="Built and running." />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-12 max-w-2xl text-foreground/70">
            Both sides of what we build, in the open: websites that are live,
            and the systems running quietly behind them.
          </p>
        </Reveal>

        {/* Websites — one concept, shown as two prototypes. */}
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

      {/* Systems — explicitly the systems side of the same work, tied back to
          the capability list rather than reading as a separate offering. */}
      <div className="mt-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h3 className="font-display text-xl font-bold sm:text-2xl">
              The systems side of the same work.
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/60">
              Not just sites. The same builds include the systems that keep
              replying, booking and sorting after launch. Tap any one to see
              what it does.
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
