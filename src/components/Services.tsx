import Image from "next/image";
import Link from "next/link";
import { CAPABILITIES } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// The full capability gallery (Iteration 3, Task 1). Every card shares the
// same anatomy — isometric illustration, pain-led headline, one supporting
// outcome line — so breadth is represented by equal craft across however many
// cards there are, not by trimming to a tidy small number (Constraint 5).
// Each card links quietly to its /knowledge#slug depth (Task 3): /knowledge
// stays reachable, just not as a competing top-level destination.
export function Services() {
  return (
    <section id="services" className="cv-auto mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <SectionNumber number="01" title="What gets built." />
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CAPABILITIES.map((capability, i) => (
          <Reveal key={capability.slug} delay={Math.min(i, 6) * 0.06}>
            <Link
              href={`/knowledge#${capability.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
            >
              <div className="relative aspect-square overflow-hidden bg-surface">
                <Image
                  src={capability.image}
                  alt={capability.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(199,123,63,0.20),transparent_65%)]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-base font-semibold leading-snug">
                  {capability.headline}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {capability.outcome}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10 text-center">
          <Link
            href="/knowledge"
            className="font-mono text-xs text-foreground/60 transition-colors hover:text-accent"
          >
            See how each one works →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
