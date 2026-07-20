import Image from "next/image";
import Link from "next/link";
import { ArtFrame } from "./ArtFrame";
import { Reveal } from "./Reveal";

// "The approach" banner. Original text banner restored (eyebrow + framing
// sentence + link into /knowledge); only the supporting graphic changed to the
// new puzzle artwork (Iteration 4, Task 6 corrected — it was a graphic swap,
// not an image-dominant rebuild). The art carries extra detail; the paragraph
// still states the point in plain words.
export function ApproachBand() {
  return (
    <section aria-label="Our approach" className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        <div className="grid items-center gap-8 rounded-2xl border border-white/10 bg-surface/40 p-6 md:grid-cols-2 md:gap-12 md:p-10">
          <ArtFrame className="aspect-[3/2] w-full">
            <Image
              src="/approach/puzzle.webp"
              fill
              alt="A dark isometric puzzle of nine business areas with one empty slot, and a glowing copper piece labelled the specific gap in your business hovering above it, beside a four-step process: investigate, identify the gap, find the fit, complete the picture."
              sizes="(max-width: 768px) 100vw, 480px"
              loading="lazy"
              className="object-contain"
            />
          </ArtFrame>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              The approach
            </p>
            <p className="mt-4 font-display text-xl font-semibold leading-snug sm:text-2xl">
              Every business leaks in a different place: time, leads, or
              follow-up. We diagnose your specific gap and build to it, not to a
              template.
            </p>
            <Link
              href="/knowledge"
              className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-foreground/70 transition-colors hover:text-accent"
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
