import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

// Calm "approach" band (P7.2) near the About block: a modern, individual
// method stated in two short sentences, with a supporting graphic and a quiet
// link into the depth on /knowledge. Light on purpose; the detail lives there.
export function ApproachBand() {
  return (
    <section aria-label="Our approach" className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        <div className="grid items-center gap-8 rounded-2xl border border-white/10 bg-surface/40 p-6 md:grid-cols-[1fr_1.4fr] md:gap-12 md:p-10">
          <div className="relative mx-auto aspect-square w-40 shrink-0 overflow-hidden rounded-xl md:w-full md:max-w-xs">
            <Image
              src="/approach/tailored.webp"
              alt="Illustration of a copper core linked to four distinct nodes, representing a system tailored to one business"
              fill
              sizes="(max-width: 768px) 160px, 320px"
              loading="lazy"
              className="object-contain"
            />
          </div>
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
