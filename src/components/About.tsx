import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// Impersonal studio description (owner decision): no founder framing, no
// location-as-personal-detail, no photo. What SetFrame is, what it
// specializes in, how it helps the visitor's business. Outcome-first.
export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <SectionNumber number="04" title="What SetFrame is." />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="space-y-4 text-lg leading-relaxed text-foreground/80">
          <p>
            SetFrame is a studio that builds websites and the systems behind
            them for businesses that run on inquiries, appointments and
            follow-up.
          </p>
          <p>
            The focus is simple: turn the trust a business already earns into
            booked calls, and stop the leads, replies and paperwork that
            quietly slip through the cracks.
          </p>
          <p>
            Every project is built to keep working after launch, fast,
            accessible and fully owned by the business it serves.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
