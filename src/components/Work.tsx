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
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">
            One brief. Two different directions.
          </h3>
          <p className="mt-3 leading-relaxed text-foreground/70">
            The same brief, taken two deliberately different ways: one goal,
            two designs that share nothing but intent. Proof that a project is
            shaped around the client, not stamped from a house template.
          </p>
        </div>
        {/* The two prototypes sit on staggered planes rather than in a
            perfectly level pair (Iteration 6, Task 5): the second frame is
            dropped ~64px on desktop, so section 02 no longer shares the
            level-grid rhythm of sections 01 and 03. It is a composition change
            only — each BrowserFrame's own chrome, shadow and hover treatment
            are untouched — and it collapses back to a plain stack on mobile,
            where a vertical offset would just read as inconsistent spacing.
            `items-start` keeps the offset from stretching either column. */}
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          {WEBSITE_PROJECT.prototypes.map((prototype, i) => (
            <div key={prototype.slug} className={i === 1 ? "md:mt-16" : ""}>
              <WebsiteCard prototype={prototype} />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
