import { Reveal } from "./Reveal";
import { CtaButton } from "./CtaButton";

// Large, calm closing section with room to breathe and a single copper glow.
// One sentence, one button. Nothing competing for attention.
export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-6 py-32 text-center">
      <div
        aria-hidden="true"
        className="ambient-glow pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[130px]"
      />

      <Reveal>
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Find out what your business is quietly losing.
          </h2>
          <div className="mt-10">
            <CtaButton size="lg" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
