import { WEBSITE_PROJECT } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";
import { WebsiteCard } from "./WebsiteCard";

// Delivered-work proof (Iteration 3): the real portfolio case study only.
// The broader capability range lives entirely in Services now — this section
// no longer duplicates it, so there is exactly one place breadth is shown
// and exactly one place proof is shown.
export function Work() {
  return (
    <section id="work" className="mx-auto max-w-5xl px-6 py-24" aria-label="Selected work">
      <Reveal>
        <SectionNumber number="02" title="Built and running." />
      </Reveal>

      <Reveal delay={0.1}>
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
    </section>
  );
}
