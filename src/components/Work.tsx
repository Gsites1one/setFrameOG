import { WEBSITE_PROJECT } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";
import { WebsiteCard } from "./WebsiteCard";

// Delivered-work proof. Intro reframed around adaptability (Iteration 4,
// Task 3): the same brief produced two deliberately different designs, which
// makes the "shaped around the client" pillar visible without naming it — and
// keeps the niche (advisory) inside the prototype cards, not the section head.
export function Work() {
  return (
    <section id="work" className="mx-auto max-w-5xl px-6 py-24" aria-label="Selected work">
      <Reveal>
        <SectionNumber number="02" title="Built and running." />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mb-8 max-w-2xl">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">
            One brief. Two different directions.
          </h3>
          <p className="mt-3 leading-relaxed text-foreground/70">
            The same brief, taken two deliberately different ways: one goal,
            two designs that share nothing but intent. Proof that a project is
            shaped around the client, not stamped from a house template.
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
