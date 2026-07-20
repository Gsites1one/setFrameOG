import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

// "The approach" banner — image-dominant (Iteration 4, Task 6). The supplied
// puzzle artwork is a complete 3:2 infographic (nine capability pieces, one
// glowing "specific gap" piece, a four-step process column, a closing line),
// so the HTML no longer restates any of that: only the eyebrow label and the
// link into /knowledge remain. The artwork carries the message.
//
// The art already matches the site's dark-graphite + copper palette, so it
// needs the shared container (radius + line-colour border) but not the warm
// unifying tint. On narrow screens the infographic's small legend text would
// drop below legibility if shrunk to fit, so instead it holds a legible
// min-width and the frame pans horizontally.
export function ApproachBand() {
  return (
    <section aria-label="Our approach" className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-surface/40 p-4 sm:p-6 md:p-8">
          <p className="mb-5 font-mono text-xs uppercase tracking-widest text-accent">
            The approach
          </p>

          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Image
              src="/approach/puzzle.webp"
              width={1536}
              height={1024}
              alt="A dark isometric puzzle of nine business areas with one empty slot, and a glowing copper piece labelled the specific gap in your business hovering above it. A four-step column reads: we investigate, we identify the gap, we find the perfect fit, we complete the picture."
              sizes="(min-width: 1024px) 960px, 640px"
              loading="lazy"
              className="h-auto w-full min-w-[640px] max-w-none rounded-lg border border-white/10"
            />
          </div>

          <Link
            href="/knowledge"
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-foreground/70 transition-colors hover:text-accent"
          >
            Learn how the systems work
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
