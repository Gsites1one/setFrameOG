import Link from "next/link";
import { AboutPipe } from "./AboutPipe";
import { LogoMark } from "./LogoMark";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// Impersonal studio description (owner decision): no founder framing, no
// location-as-personal-detail, no photo. What SetFrame is, what it
// specializes in, how it helps the visitor's business. Outcome-first.
// A subtle ambient pipe animation sits behind the text (P7.3).
export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-3xl overflow-hidden px-6 py-24"
    >
      <AboutPipe />

      <div className="relative z-10">
        <Reveal>
          <SectionNumber number="04" title="What SetFrame is." />
        </Reveal>

        {/* Teaser only (Iteration 6, Task 7). The full studio description now
            lives on /about; this keeps the two opening paragraphs and hands
            off rather than printing the same text on both pages. */}
        <Reveal delay={0.1}>
          <div className="space-y-4 text-lg leading-relaxed text-foreground/80">
            <p>
              <LogoMark className="text-foreground" /> is a studio that builds
              websites and the systems behind them for businesses that run on
              inquiries, appointments and follow-up.
            </p>
            <p>
              The focus is simple: turn the trust a business already earns into
              booked calls, and stop the leads, replies and paperwork that
              quietly slip through the cracks.
            </p>
          </div>

          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-1.5 font-display text-base font-semibold text-foreground transition-colors hover:text-accent"
          >
            <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-accent">
              Read more about SetFrame
            </span>
            <span aria-hidden="true" className="text-accent">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
