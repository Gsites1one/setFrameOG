import { Reveal } from "./Reveal";
import { CtaButton } from "./CtaButton";

// Lively closing band (P7.2): a copper current sweeps along a full-width
// hairline through a single pulsing node, then lands on the outcome headline
// and the primary button. The motion turns the quiet "leak" into visible
// movement. transform/opacity only; under reduced motion the current is
// hidden and the static hairline + node remain.
export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-6 py-32 text-center">
      <div
        aria-hidden="true"
        className="ambient-glow pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[130px]"
      />

      {/* Full-bleed hairline + traveling current + pulsing node */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-24 h-px"
      >
        <div className="h-px w-full bg-accent/15" />
        <div className="cta-current absolute inset-y-0 left-0 h-px w-32 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="cta-node block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(199,123,63,0.6)]" />
        </span>
      </div>

      <Reveal>
        <div className="relative mx-auto max-w-2xl pt-16">
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Turn the quiet leak into movement.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/70">
            Find out what your business is losing, and what stopping it is
            worth.
          </p>
          <div className="mt-10">
            <CtaButton size="lg" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
