import { Reveal } from "./Reveal";

// Faceless for now (decided in review): a short first-person studio statement,
// no photo. The human trust edge without exposing identity yet.
export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <div className="mb-8 flex items-baseline gap-4">
          <span className="font-mono text-sm text-accent">[ 04 ]</span>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Who is behind this.
          </h2>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="space-y-4 text-lg leading-relaxed text-foreground/80">
          <p>
            SetFrame is a founder-operated studio based in Tilburg, working with
            businesses across the Netherlands and beyond.
          </p>
          <p>
            I build systems, not just pages, because a website that only looks
            good still lets leads slip through. Financial and advisory firms are
            where this started, since trust and follow-up decide everything, but
            the same thinking fits any business that runs on inquiries and
            appointments.
          </p>
          <p>
            You work directly with the person who designs and builds your
            project. No handoffs, no lost context, no one to hide behind.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
