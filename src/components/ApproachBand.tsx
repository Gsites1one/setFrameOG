import Image from "next/image";
import Link from "next/link";
import { ArtFrame } from "./ArtFrame";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

// "The approach" banner: original text layout (eyebrow + framing sentence +
// link into /knowledge) with the puzzle-v2 graphic. Sized up a step
// (Iteration 4.1, item 1): wider container, larger art column, roomier
// padding, bigger framing type.
export function ApproachBand() {
  return (
    <section aria-label="Our approach" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <div className="grid items-center gap-8 rounded-2xl border border-white/10 bg-surface/40 p-6 md:grid-cols-[1.15fr_1fr] md:gap-14 md:p-12">
          <ArtFrame className="aspect-[3/2] w-full">
            <Image
              src="/approach/puzzle.webp"
              fill
              alt="A dark isometric puzzle of business areas with one empty slot and a glowing copper piece labelled the specific gap in your business hovering above it."
              sizes="(max-width: 768px) 100vw, 620px"
              loading="lazy"
              className="object-contain"
            />
          </ArtFrame>
          <div>
            <Eyebrow>The approach</Eyebrow>
            <p className="mt-5 font-display text-2xl font-semibold leading-snug sm:text-3xl">
              Every business leaks in a different place: time, leads, or
              follow-up. We diagnose your specific gap and build to it, not to a
              template.
            </p>
            <Link
              href="/knowledge"
              className="mt-7 inline-flex items-center gap-1.5 font-mono text-xs text-foreground/70 transition-colors hover:text-accent"
            >
              Learn how the systems work
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
